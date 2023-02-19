import { createContext, useState } from "react";

export const LoadingContext = createContext({})

export function Loading({ children }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}