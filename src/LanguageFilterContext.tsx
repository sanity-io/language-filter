import React, {createContext, PropsWithChildren, useContext, useMemo} from 'react'
import {LanguageFilterConfig} from './types'

export interface LanguageFilterContextValue {
  // eslint-disable-next-line react/require-default-props
  options: LanguageFilterConfig
  // eslint-disable-next-line react/require-default-props
  enabled: boolean
}

const LanguageFilterContext = createContext<LanguageFilterContextValue | undefined>(undefined)

export function LanguageFilterProvider({
  options,
  enabled,
  children,
}: PropsWithChildren<
  Omit<LanguageFilterContextValue, 'selectedLanguageIds' | 'setSelectedLanguageIds'>
>) {
  const value = useMemo(() => ({options, enabled}), [options, enabled])
  return <LanguageFilterContext.Provider value={value}>{children}</LanguageFilterContext.Provider>
}

export function useLanguageFilterContext() {
  return useContext(LanguageFilterContext)
}
