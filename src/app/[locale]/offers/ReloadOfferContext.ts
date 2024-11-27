import { createContext } from "react";

const ReloadOfferContext
  = createContext<() => void>(() => {});
export default ReloadOfferContext;
