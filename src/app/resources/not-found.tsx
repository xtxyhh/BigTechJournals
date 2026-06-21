import { PremiumErrorState } from "@/components/RouteFeedback";

export default function NotFound() {
  return <PremiumErrorState title="Resource not found" description="That resource is not available yet." />;
}
