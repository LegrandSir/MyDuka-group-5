import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import MerchantDashboard from "../pages/MerchantDashboard";

function renderWithAuth(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

describe("MerchantDashboard", () => {
  it("renders KPI cards", async () => {
    renderWithAuth(<MerchantDashboard />);

    //  KPI cards
    expect(await screen.findByText("Stores", { selector: "div" })).toBeInTheDocument();
    expect(await screen.findByText("Products", { selector: "div" })).toBeInTheDocument();
    expect(await screen.findByText("Payments", { selector: "div" })).toBeInTheDocument();
    expect(await screen.findByText("Admins", { selector: "div" })).toBeInTheDocument();
  });

  it("navigates to Overview tab", async () => {
    renderWithAuth(<MerchantDashboard />);
    const tab = await screen.findByRole("button", { name: /Overview/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Store Reports/i)).toBeInTheDocument();
  });

  it("navigates to Stores tab", async () => {
    renderWithAuth(<MerchantDashboard />);
    const tab = await screen.findByRole("button", { name: /Stores/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Add New Store/i)).toBeInTheDocument();
  });

  it("navigates to Payments tab", async () => {
    renderWithAuth(<MerchantDashboard />);
    const tab = await screen.findByRole("button", { name: /Payments/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Method/i)).toBeInTheDocument();
  });

  it("navigates to Admins tab", async () => {
    renderWithAuth(<MerchantDashboard />);
    const tab = await screen.findByRole("button", { name: /Admins/i });
    fireEvent.click(tab);

    expect(await screen.findByText(/Invite New Admin/i)).toBeInTheDocument();
  });
});