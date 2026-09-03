import { useAuth } from "../../context/context";
import OffersBrand from "./OffersBrand";
import OffersCreator from "./OffersCreator";


export default function Offers() {
  const { role } = useAuth();

  if (role === "brand") return <OffersBrand />;
  if (role === "creator") return <OffersCreator />;

  return null; 
}