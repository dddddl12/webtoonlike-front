import { useState } from "react";

export default function useReload() {
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey(prev => prev + 1);
  return { reload, reloadKey };
}