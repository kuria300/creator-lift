import { useAuth } from "../../context/context";
import PaymentsBrands from "./PaymentsBrands";
import PaymentsCreators from "./PaymentsCreators";


export default function Payments() {
  const { role } = useAuth();

  if (role === "brand") return <PaymentsBrands />;
  if (role === "creator") return <PaymentsCreators />;

  return null; 
}