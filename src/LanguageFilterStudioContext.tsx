import React, {createContext, useContext, useMemo, useState} from 'react'
import {LanguageFilterConfig} from './types'
import {LayoutProps} from 'sanity'

export interface LanguageFilterStudioContextProps {
  // eslint-disable-next-line react/require-default-props
  options: LanguageFilterConfig
}

export interface LanguageFilterStudioContextValue extends LanguageFilterStudioContextProps {
  selectedLanguageIds: string[]
  setSelectedLanguageIds: (ids: string[]) => void
}

const LanguageFilterStudioContext = createContext<LanguageFilterStudioContextValue | undefined>(
  undefined
)

/**
 * This is a separate Provider from the Context that wraps the document pane
 * but it used to listen to changes to the selected language IDs inside it
 * and provide them to a Studio-wide context
 */
export function LanguageFilterStudioProvider(
  props: LayoutProps & LanguageFilterStudioContextProps
) {
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<string[]>([])
  const value = useMemo(() => ({options: props.options}), [props.options])

  return (
    <LanguageFilterStudioContext.Provider
      value={{...value, selectedLanguageIds, setSelectedLanguageIds}}
    >
      {props.renderDefault(props)}
    </LanguageFilterStudioContext.Provider>
  )
}

/**
 * Retrieves plugin options and the currently selected
 * language IDs from anywhere in the Studio
 */
export function useLanguageFilterStudioContext() {
  return useContext(LanguageFilterStudioContext)
}
