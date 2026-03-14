import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDealershipCtx } from "@/contexts/DealershipContext";

export default function DealershipOwnerRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { dealership, slug } = useDealershipCtx();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isOwner =
    user.email?.toLowerCase() === dealership.ownerEmail?.toLowerCase();

  if (!isOwner) {
    return <Navigate to={`/d/${slug}`} replace />;
  }

  return <>{children}</>;
}
