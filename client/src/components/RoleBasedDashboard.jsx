import { useAuth } from "../context/AuthContext";
import MerchantDashboard from "../pages/MerchantDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ClerkDashboard from "../pages/ClerkDashboard";
import DashboardLayout from "../components/DashboardLayout";

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return <p className="text-white">Loading...</p>;

  return (
    <DashboardLayout>
      {(() => {
        switch (user.role?.toLowerCase()) {
          case "admin":
            return <AdminDashboard />;
          case "merchant":
            return <MerchantDashboard />;
          case "clerk":
            return <ClerkDashboard />;
          default:
            return (
              <p className="text-red-500">
                Unauthorized (role: {user.role})
              </p>
            );
        }
      })()}
    </DashboardLayout>
  );
}