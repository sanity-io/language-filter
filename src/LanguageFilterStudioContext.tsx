import {createContext, useContext, useEffect, useMemo, useState} from 'react'
import {type LayoutProps, useClient} from 'sanity'

import {defaultFilterField} from './filterField'
import type {
  Language,
  LanguageCallback,
  LanguageFilterConfig,
  LanguageFilterConfigProcessed,
} from './types'
import {useSelectedLanguageIds} from './useSelectedLanguageIds'

export interface LanguageFilterStudioContextProps {
  // eslint-disable-next-line react/require-default-props
  options: Required<LanguageFilterConfig>
}

export interface LanguageFilterStudioContextProcessed {
  options: Required<LanguageFilterConfigProcessed>
}

export interface LanguageFilterStudioContextValue extends LanguageFilterStudioContextProcessed {
  selectedLanguageIds: string[]
  setSelectedLanguageIds: (ids: string[]) => void
}

export const defaultContextValue: LanguageFilterStudioContextValue = {
  options: {
    apiVersion: '2022-11-27',
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
  props: LayoutProps & LanguageFilterStudioContextProps,
) {
  const client = useClient({apiVersion: '2023-01-01'})
  const [languages, setLanguages] = useState<Language[]>(
    Array.isArray(props.options.supportedLanguages) ? props.options.supportedLanguages : [],
  )
  useEffect(() => {
    let asyncLanguages: Language[] = []

    async function getLanguages(supportedLanguagesCallback: LanguageCallback) {
      asyncLanguages = await supportedLanguagesCallback(client, {})
      setLanguages(asyncLanguages)
    }

    if (!Array.isArray(props.options.supportedLanguages)) {
      getLanguages(props.options.supportedLanguages)
    }
  }, [client, props.options.supportedLanguages])

  const options = useMemo<Required<LanguageFilterConfigProcessed>>(() => {
    return {
      ...defaultContextValue.options,
      ...props.options,
      supportedLanguages: languages,
    }
  }, [props.options, languages])

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
