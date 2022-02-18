import React, { useState, createContext } from 'react'

type ContextState = {
  stockCode?: string
  setStockCode: (code: string) => void
}

const INITIAL_STOCK_CODE = 'TSLA'

export const HomeContext = createContext<ContextState>({
  stockCode: INITIAL_STOCK_CODE,
  setStockCode: () => {},
})

export const HomeContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stockCode, setStockCode] = useState<string>(INITIAL_STOCK_CODE)

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
