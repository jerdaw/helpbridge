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

import {
  loadSecurityHeadersFromNextConfig,
  validateSecurityHeaders as validateSecurityHeadersReport,
} from "@/lib/security/security-headers"

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
}

/**
 * Main validation function
 */
function runValidation(): boolean {
  console.log(`${colors.blue}${colors.bold}🔒 Security Headers Validation${colors.reset}\n`)

  let allPassed = true

  try {
    const headers = loadSecurityHeadersFromNextConfig()
    const report = validateSecurityHeadersReport(headers)

    console.log(`Found ${headers.length} security headers in next.config.ts\n`)

    for (const check of report.checks) {
      if (check.result.passed) {
        console.log(`${colors.green}✓ ${check.headerName}${colors.reset}`)
      } else {
        console.log(`${colors.red}✗ ${check.headerName}${colors.reset}`)
        allPassed = false
      }

      if (!check.present) {
        console.log(`  ${colors.red}Missing required header${colors.reset}\n`)
        continue
      }

      for (const issue of check.result.issues) {
        console.log(`  ${colors.red}${issue}${colors.reset}`)
      }

      for (const warning of check.result.warnings) {
        console.log(`  ${colors.yellow}⚠ ${warning}${colors.reset}`)
      }

      console.log()
    }

    console.log(`${colors.bold}Summary:${colors.reset}`)
    console.log(
      allPassed
        ? `${colors.green}All required security headers are properly configured${colors.reset}`
        : `${colors.red}Some security headers are missing or misconfigured${colors.reset}`
    )

    if (report.warnings.length > 0) {
      console.log(`${colors.yellow}${report.warnings.length} warning(s) - review recommended${colors.reset}`)
    }

    return allPassed && report.passed
  } catch (error) {
    console.error(`${colors.red}Error during validation:${colors.reset}`, error)
    return false
  }
}

const passed = runValidation()
process.exit(passed ? 0 : 1)
