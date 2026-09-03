import { useAuth } from "../../context/context";
import DashboardBrand from "./DashboardBrand";
import DashboardCreator from "./DashboardCreator";


export default function Dashboard() {
  const { role } = useAuth();

  if (role === "brand") return <DashboardBrand />;
  if (role === "creator") return <DashboardCreator />;

  return null; 
}