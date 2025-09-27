import { useAuth } from "../context/AuthContext";
import MerchantDashboard from "../pages/MerchantDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ClerkDashboard from "../pages/ClerkDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "merchant":
      return <MerchantDashboard />;
    case "clerk":
      return <ClerkDashboard />;
    default:
      return <p>Unauthorized</p>;
  }
}
