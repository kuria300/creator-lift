import { useAuth } from "../../context/context";
import DealsBrand from "./DealsBrand";
import DealsCreator from "./DealsCreator";


export default function Deals() {
  const { role } = useAuth();

  if (role === "brand") return <DealsBrand />;
  if (role === "creator") return <DealsCreator />;

  return null; 
}