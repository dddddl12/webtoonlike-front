import { createContext } from "react";

const OpenOfferFormContext
  = createContext<() => void>(() => {});
export default OpenOfferFormContext;
