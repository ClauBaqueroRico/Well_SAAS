import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DashboardFilterContextType {
  selectedContract: string
  setSelectedContract: (contractId: string) => void
  selectedClient: string
  setSelectedClient: (clientName: string) => void
  timeframe: string
  setTimeframe: (timeframe: string) => void
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined)

interface DashboardFilterProviderProps {
  children: ReactNode
}

export function DashboardFilterProvider({ children }: DashboardFilterProviderProps) {
  const [selectedContract, setSelectedContract] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [timeframe, setTimeframe] = useState<string>('30')

  const value = {
    selectedContract,
    setSelectedContract,
    selectedClient,
    setSelectedClient,
    timeframe,
    setTimeframe
  }

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  )
}

export function useDashboardFilter() {
  const context = useContext(DashboardFilterContext)
  if (context === undefined) {
    throw new Error('useDashboardFilter must be used within a DashboardFilterProvider')
  }
  return context
}