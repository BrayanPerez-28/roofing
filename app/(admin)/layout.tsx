import { AuthProvider } from "./_context/AuthContext";
import "./admin.css";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
