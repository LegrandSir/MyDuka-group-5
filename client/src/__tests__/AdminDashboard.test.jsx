import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import AdminDashboard from "../pages/AdminDashboard";

function renderWithAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe("AdminDashboard", () => {
  it("renders KPI cards", async () => {
    renderWithAuth(<AdminDashboard />);

    expect(await screen.findByTestId("kpi-inventory")).toBeInTheDocument();
    expect(await screen.findByTestId("kpi-payments")).toBeInTheDocument();
    expect(await screen.findByTestId("kpi-request")).toBeInTheDocument();
  });

  it("switches to Overview tab", async () => {
    renderWithAuth(<AdminDashboard />);
    const tab = await screen.findByRole("button", { name: /Overview/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Admin Overview/i)).toBeInTheDocument();
  });

  it("switches to supply requests tab", async () => {
    renderWithAuth(<AdminDashboard />);
    const tab = await screen.findByRole("button", { name: /Supply Requests/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Requested By/i)).toBeInTheDocument();
  });

  it("switches to Payments tab", async () => {
    renderWithAuth(<AdminDashboard />);
    const tab = await screen.findByRole("button", { name: /Payments/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Supplier/i)).toBeInTheDocument();
  });

  it("switches to Clerks tab", async () => {
    renderWithAuth(<AdminDashboard />);
    const tab = await screen.findByRole("button", { name: /Clerks/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Invite New Clerk/i)).toBeInTheDocument();
  });
});