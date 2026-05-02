import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { BarChart3 } from "lucide-react"
import { DashboardEmptyState, DashboardShell, DashboardSurface } from "@/components/dashboard/DashboardShell"

describe("Dashboard operational surfaces", () => {
  it("renders a constrained operational shell with a smooth authenticated background", () => {
    render(
      <DashboardShell title="Operations" subtitle="Manage reviewed records." actions={<button>Action</button>}>
        <p>Body content</p>
      </DashboardShell>
    )

    const shell = screen.getByTestId("dashboard-shell")
    expect(shell).toHaveClass(
      "bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.16),transparent_24rem),radial-gradient(circle_at_88%_4%,rgba(99,102,241,0.12),transparent_26rem),linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_38%,rgba(248,250,252,0.96)_100%)]"
    )
    expect(screen.getByRole("heading", { name: "Operations" })).toBeInTheDocument()
    expect(screen.getByText("Manage reviewed records.")).toBeInTheDocument()
    expect(screen.getByText("Body content")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
  })

  it("renders reusable glass surfaces and empty states", () => {
    render(
      <DashboardSurface title="Queue" description="Reviewed manually." actions={<button>Refresh</button>}>
        <DashboardEmptyState
          icon={BarChart3}
          title="Nothing pending"
          description="There is no work in this queue."
          action={<button>Create</button>}
        />
      </DashboardSurface>
    )

    const surface = screen.getByTestId("dashboard-surface")
    expect(surface).toHaveClass("bg-white/86")
    expect(screen.getByRole("heading", { name: "Queue" })).toBeInTheDocument()
    expect(screen.getByText("Reviewed manually.")).toBeInTheDocument()
    expect(screen.getByText("Nothing pending")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument()
  })
})
