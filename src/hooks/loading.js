import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export function useLoading() {
  const context = useContext(LoadingContext)

  return context
}