#!/usr/bin/env tsx

/**
 * Security Headers Validation Script
 *
 * Validates that Next.js security headers meet security best practices.
 * Runs in CI to prevent misconfiguration.
 *
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation failures or errors
 */

import fs from "fs"
import path from "path"

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
}

interface ValidationResult {
  passed: boolean
  issues: string[]
  warnings: string[]
}

interface SecurityHeader {
  key: string
  value: string
}

/**
 * Expected security headers with validation rules
 */
const EXPECTED_HEADERS = {
  "Content-Security-Policy": {
    required: true,
    directives: [
      { name: "default-src", required: true },
      { name: "script-src", required: true },
      { name: "style-src", required: true },
      { name: "img-src", required: true },
      { name: "font-src", required: true },
      { name: "connect-src", required: true },
      { name: "frame-ancestors", required: true, expectedValue: "'none'" },
      { name: "base-uri", required: true },
      { name: "form-action", required: true },
    ],
    warnings: [
      {
        directive: "script-src",
        contains: "'unsafe-inline'",
        message: "script-src contains 'unsafe-inline' - consider using nonces for inline scripts",
      },
      {
        directive: "script-src",
        contains: "'unsafe-eval'",
        message: "script-src contains 'unsafe-eval' - required for WebLLM AI features",
      },
    ],
  },
  "X-Frame-Options": {
    required: true,
    expectedValue: "DENY",
  },
  "X-Content-Type-Options": {
    required: true,
    expectedValue: "nosniff",
  },
  "Referrer-Policy": {
    required: true,
    allowedValues: [
      "no-referrer",
      "no-referrer-when-downgrade",
      "origin",
      "origin-when-cross-origin",
      "same-origin",
      "strict-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url",
    ],
  },
  "Strict-Transport-Security": {
    required: true,
    mustContain: ["max-age=", "includeSubDomains"],
    minMaxAge: 31536000, // 1 year minimum
  },
  "Permissions-Policy": {
    required: true,
    shouldRestrictFeatures: ["camera", "microphone"],
  },
}

/**
 * Parse CSP string into directives map
 */
function parseCSP(csp: string): Map<string, string> {
  const directives = new Map<string, string>()
  const parts = csp.split(";").map((s) => s.trim())

  for (const part of parts) {
    if (!part) continue
    const [directive, ...values] = part.split(/\s+/)
    if (directive) {
      directives.set(directive, values.join(" "))
    }
  }

  return directives
}

/**
 * Validate Content-Security-Policy header
 */
function validateCSP(cspValue: string): ValidationResult {
  const result: ValidationResult = { passed: true, issues: [], warnings: [] }
  const directives = parseCSP(cspValue)

  const cspConfig = EXPECTED_HEADERS["Content-Security-Policy"]

  // Check required directives
  for (const { name, required, expectedValue } of cspConfig.directives) {
    if (required && !directives.has(name)) {
      result.passed = false
      result.issues.push(`Missing required CSP directive: ${name}`)
    }

    if (expectedValue && directives.get(name) !== expectedValue) {
      result.passed = false
      result.issues.push(`CSP directive ${name} should be exactly '${expectedValue}', got '${directives.get(name)}'`)
    }
  }

  // Check for warnings
  for (const { directive, contains, message } of cspConfig.warnings) {
    const value = directives.get(directive)
    if (value && value.includes(contains)) {
      result.warnings.push(message)
    }
  }

  return result
}

/**
 * Validate HSTS header
 */
function validateHSTS(hstsValue: string): ValidationResult {
  const result: ValidationResult = { passed: true, issues: [], warnings: [] }
  const config = EXPECTED_HEADERS["Strict-Transport-Security"]

  // Check required components
  for (const required of config.mustContain) {
    if (!hstsValue.includes(required)) {
      result.passed = false
      result.issues.push(`HSTS missing required component: ${required}`)
    }
  }

  // Extract and validate max-age
  const maxAgeMatch = hstsValue.match(/max-age=(\d+)/)
  if (maxAgeMatch) {
    const maxAge = parseInt(maxAgeMatch[1], 10)
    if (maxAge < config.minMaxAge) {
      result.passed = false
      result.issues.push(`HSTS max-age too short: ${maxAge} seconds (minimum: ${config.minMaxAge} = 1 year)`)
    }
  } else {
    result.passed = false
    result.issues.push("HSTS max-age not found or invalid")
  }

  return result
}

/**
 * Validate Permissions-Policy header
 */
function validatePermissionsPolicy(policyValue: string): ValidationResult {
  const result: ValidationResult = { passed: true, issues: [], warnings: [] }
  const config = EXPECTED_HEADERS["Permissions-Policy"]

  for (const feature of config.shouldRestrictFeatures) {
    if (!policyValue.includes(`${feature}=(`)) {
      result.warnings.push(`Permissions-Policy should restrict feature: ${feature}`)
    }
  }

  return result
}

/**
 * Load and parse next.config.ts
 */
function loadNextConfig(): SecurityHeader[] {
  const configPath = path.join(process.cwd(), "next.config.ts")

  if (!fs.existsSync(configPath)) {
    throw new Error(`next.config.ts not found at ${configPath}`)
  }

  const configContent = fs.readFileSync(configPath, "utf8")

  // Extract securityHeaders array - find the array declaration
  const arrayStartMatch = configContent.match(/const securityHeaders\s*=\s*\[/)
  if (!arrayStartMatch) {
    throw new Error("Could not find securityHeaders array in next.config.ts")
  }

  const arrayStart = arrayStartMatch.index! + arrayStartMatch[0].length
  let depth = 1
  let arrayEnd = arrayStart

  // Find matching closing bracket
  for (let i = arrayStart; i < configContent.length && depth > 0; i++) {
    if (configContent[i] === "[") depth++
    if (configContent[i] === "]") depth--
    arrayEnd = i
  }

  const arrayContent = configContent.substring(arrayStart, arrayEnd)

  // Now parse individual header objects
  const headers: SecurityHeader[] = []
  const objectRegex = /\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g
  let match: RegExpExecArray | null

  while ((match = objectRegex.exec(arrayContent)) !== null) {
    const objectContent = match[1]

    // Extract key
    const keyMatch = objectContent.match(/key:\s*["']([^"']+)["']/)
    if (!keyMatch) continue

    const key = keyMatch[1]

    // Extract value - could be string or array.join()
    let value = ""

    // Try array.join() pattern first (for CSP)
    const arrayJoinMatch = objectContent.match(/value:\s*\[([\s\S]*?)\]\.join\(["'][^"']*["']\)/)
    if (arrayJoinMatch) {
      const arrayItems = arrayJoinMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
      value = arrayItems.join("; ")
    } else {
      // Try simple string value
      const stringMatch = objectContent.match(/value:\s*["']([^"']*)["']/)
      if (stringMatch) {
        value = stringMatch[1]
      }
    }

    headers.push({ key, value })
  }

  return headers
}

/**
 * Main validation function
 */
function validateSecurityHeaders(): boolean {
  console.log(`${colors.blue}${colors.bold}🔒 Security Headers Validation${colors.reset}\n`)

  let allPassed = true
  const allWarnings: string[] = []

  try {
    const headers = loadNextConfig()
    console.log(`Found ${headers.length} security headers in next.config.ts\n`)

    // Validate each header
    for (const [headerName, config] of Object.entries(EXPECTED_HEADERS)) {
      const header = headers.find((h) => h.key === headerName)

      if (!header) {
        if (config.required) {
          console.log(`${colors.red}✗ ${headerName}${colors.reset}`)
          console.log(`  ${colors.red}Missing required header${colors.reset}\n`)
          allPassed = false
        }
        continue
      }

      // Header-specific validation
      let result: ValidationResult | null = null

      if (headerName === "Content-Security-Policy") {
        result = validateCSP(header.value)
      } else if (headerName === "Strict-Transport-Security") {
        result = validateHSTS(header.value)
      } else if (headerName === "Permissions-Policy") {
        result = validatePermissionsPolicy(header.value)
      } else if ("expectedValue" in config && config.expectedValue) {
        result = { passed: true, issues: [], warnings: [] }
        if (header.value !== config.expectedValue) {
          result.passed = false
          result.issues.push(`Expected value '${config.expectedValue}', got '${header.value}'`)
        }
      } else if ("allowedValues" in config && config.allowedValues) {
        result = { passed: true, issues: [], warnings: [] }
        if (!config.allowedValues.includes(header.value)) {
          result.passed = false
          result.issues.push(`Value '${header.value}' not in allowed values: ${config.allowedValues.join(", ")}`)
        }
      } else {
        // Default: just check presence
        result = { passed: true, issues: [], warnings: [] }
      }

      // Report results
      if (result.passed) {
        console.log(`${colors.green}✓ ${headerName}${colors.reset}`)
      } else {
        console.log(`${colors.red}✗ ${headerName}${colors.reset}`)
        allPassed = false
      }

      for (const issue of result.issues) {
        console.log(`  ${colors.red}${issue}${colors.reset}`)
      }

      for (const warning of result.warnings) {
        console.log(`  ${colors.yellow}⚠ ${warning}${colors.reset}`)
        allWarnings.push(`${headerName}: ${warning}`)
      }

      console.log() // Empty line
    }

    // Summary
    console.log(`${colors.bold}Summary:${colors.reset}`)
    console.log(
      allPassed
        ? `${colors.green}All required security headers are properly configured${colors.reset}`
        : `${colors.red}Some security headers are missing or misconfigured${colors.reset}`
    )

    if (allWarnings.length > 0) {
      console.log(`${colors.yellow}${allWarnings.length} warning(s) - review recommended${colors.reset}`)
    }

    return allPassed
  } catch (error) {
    console.error(`${colors.red}Error during validation:${colors.reset}`, error)
    return false
  }
}

// Run validation
const passed = validateSecurityHeaders()
process.exit(passed ? 0 : 1)
