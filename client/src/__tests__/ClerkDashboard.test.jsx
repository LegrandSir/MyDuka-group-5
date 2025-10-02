import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import ClerkDashboard from "../pages/ClerkDashboard";

function renderWithAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe("ClerkDashboard", () => {
  it("renders clerk KPI cards", async () => {
    renderWithAuth(<ClerkDashboard />);

    // KPIs 
    expect(await screen.findByTestId("kpi-inventory")).toBeInTheDocument();
    expect(await screen.findByTestId("kpi-category")).toBeInTheDocument();
    expect(await screen.findByTestId("kpi-request")).toBeInTheDocument();
    expect(await screen.findByTestId("kpi-pending")).toBeInTheDocument();
  });

  it("switches to Overview tab", async () => {
    renderWithAuth(<ClerkDashboard />);
    const tab = await screen.findByRole("button", { name: /Overview/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Low Stock Items/i)).toBeInTheDocument();
  });

  it("switches to Products tab", async () => {
    renderWithAuth(<ClerkDashboard />);
    const tab = await screen.findByRole("button", { name: /Products/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Price/i)).toBeInTheDocument();
  });

  it("switches to Category tab", async () => {
    renderWithAuth(<ClerkDashboard />);
    const tab = await screen.findByRole("button", { name: /Category/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Description/i)).toBeInTheDocument();
  });

  it("switches to Inventory tab", async () => {
    renderWithAuth(<ClerkDashboard />);
    const tab = await screen.findByRole("button", { name: /Inventory/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Status/i)).toBeInTheDocument();
  });

  it("switches to Requests tab", async () => {
    renderWithAuth(<ClerkDashboard />);
    const tab = await screen.findByRole("button", { name: /Requests/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Requested By/i)).toBeInTheDocument();
  });
});