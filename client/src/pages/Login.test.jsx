import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
import Login from "./Login";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Login component", () => {
  const mockNavigate = jest.fn();
  const mockLoginContext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ login: mockLoginContext });
  });

  test("renders inputs and button", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates input values", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("123456");
  });

  test("calls loginAPI and context login on success", async () => {
    const mockUser = { id: 1, name: "John" };
    jest.spyOn(api, "loginAPI").mockResolvedValue({ user: mockUser, access_token: "token123" });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(api.loginAPI).toHaveBeenCalledWith("john@example.com", "password"));
    expect(mockLoginContext).toHaveBeenCalledWith(mockUser, "token123");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
