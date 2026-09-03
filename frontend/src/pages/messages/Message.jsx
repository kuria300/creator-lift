import { useAuth } from "../../context/context";
import MessagesBrand from "./MessagesBrand";
import MessagesCreator from "./MessagesCreator";


export default function Message() {
  const { role } = useAuth();

  if (role === "brand") return <MessagesBrand />;
  if (role === "creator") return <MessagesCreator/>;

  return null; 
}