import React, { useState, createContext } from 'react'

type ContextState = {
  stockCode?: string
  setStockCode: (code: string) => void
}

export const HomeContext = createContext<ContextState>({
  stockCode: 'TSLA',
  setStockCode: () => {},
})

export const HomeContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stockCode, setStockCode] = useState<string>()

  return (
    <HomeContext.Provider
      value={{
        stockCode,
        setStockCode,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
