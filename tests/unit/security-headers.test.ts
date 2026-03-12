import { describe, expect, it } from "vitest"
import { validateSecurityHeaders, type SecurityHeader } from "@/lib/security/security-headers"

function buildValidHeaders(): SecurityHeader[] {
  return [
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.onesignal.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://onesignal.com https://cdn.onesignal.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
  ]
}

describe("security header validation", () => {
  it("fails when a required header is missing", () => {
    const report = validateSecurityHeaders(buildValidHeaders().filter((header) => header.key !== "X-Frame-Options"))

    expect(report.passed).toBe(false)
    expect(report.checks.find((check) => check.headerName === "X-Frame-Options")?.present).toBe(false)
  })

  it("fails when an exact-value header is wrong", () => {
    const headers = buildValidHeaders().map((header) =>
      header.key === "X-Frame-Options" ? { ...header, value: "SAMEORIGIN" } : header
    )

    const report = validateSecurityHeaders(headers)

    expect(report.passed).toBe(false)
    expect(report.checks.find((check) => check.headerName === "X-Frame-Options")?.result.issues).toContain(
      "Expected value 'DENY', got 'SAMEORIGIN'"
    )
  })

  it("fails when CSP directives are incomplete", () => {
    const headers = buildValidHeaders().map((header) =>
      header.key === "Content-Security-Policy" ? { ...header, value: "default-src 'self'; script-src 'self'" } : header
    )

    const report = validateSecurityHeaders(headers)

    expect(report.passed).toBe(false)
    expect(report.checks.find((check) => check.headerName === "Content-Security-Policy")?.result.issues).toContain(
      "Missing required CSP directive: style-src"
    )
  })

  it("fails when HSTS max-age is too low", () => {
    const headers = buildValidHeaders().map((header) =>
      header.key === "Strict-Transport-Security" ? { ...header, value: "max-age=60; includeSubDomains" } : header
    )

    const report = validateSecurityHeaders(headers)

    expect(report.passed).toBe(false)
    expect(report.checks.find((check) => check.headerName === "Strict-Transport-Security")?.result.issues).toContain(
      "HSTS max-age too short: 60 seconds (minimum: 31536000 = 1 year)"
    )
  })

  it("warns when permissions policy does not restrict dangerous features", () => {
    const headers = buildValidHeaders().map((header) =>
      header.key === "Permissions-Policy" ? { ...header, value: "geolocation=(self)" } : header
    )

    const report = validateSecurityHeaders(headers)

    expect(report.passed).toBe(true)
    expect(report.checks.find((check) => check.headerName === "Permissions-Policy")?.result.warnings).toContain(
      "Permissions-Policy should restrict feature: camera"
    )
  })
})
