import React, {createContext, useContext, useMemo} from 'react'
import {LanguageFilterConfig} from './types'
import {LayoutProps} from 'sanity'
import {defaultFilterField} from './filterField'
import {useSelectedLanguageIds} from './useSelectedLanguageIds'

export interface LanguageFilterStudioContextProps {
  // eslint-disable-next-line react/require-default-props
  options: Required<LanguageFilterConfig>
}

export interface LanguageFilterStudioContextValue extends LanguageFilterStudioContextProps {
  selectedLanguageIds: string[]
  setSelectedLanguageIds: (ids: string[]) => void
}

export const defaultContextValue: LanguageFilterStudioContextValue = {
  options: {
    supportedLanguages: [],
    defaultLanguages: [],
    documentTypes: [],
    filterField: defaultFilterField,
  },
  selectedLanguageIds: [],
  setSelectedLanguageIds: () => console.error('LanguageFilterStudioContext not initialized'),
}

const LanguageFilterStudioContext =
  createContext<LanguageFilterStudioContextValue>(defaultContextValue)

/**
 * This is a separate Provider from the Context that wraps the document pane
 * but it used to listen to changes to the selected language IDs inside it
 * and provide them to a Studio-wide context
 */
export function LanguageFilterStudioProvider(
  props: LayoutProps & LanguageFilterStudioContextProps
) {
  const options = useMemo(
    () => ({
      ...defaultContextValue.options,
      ...props.options,
    }),
    [props.options]
  )
  const [selectedLanguageIds, setSelectedLanguageIds] = useSelectedLanguageIds(options)

  return (
    <LanguageFilterStudioContext.Provider
      value={{options, selectedLanguageIds, setSelectedLanguageIds}}
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
