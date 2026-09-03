import { useAuth } from "../../context/context";
import BrandsBrnds from "./BrandsBrnds";
import BrandsCreators from "./BrandsCreators";



export default function Deals() {
  const { role } = useAuth();

  if (role === "brand") return <BrandsBrnds />;
  if (role === "creator") return <BrandsCreators />;

  return null; 
}