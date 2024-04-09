import {useState} from 'react'

import type {Language, LanguageFilterConfig} from './types'
const storageKey = '@sanity/plugin/language-filter/selected-languages'

export function getPersistedLanguageIds(options: LanguageFilterConfig): string[] {
  const selectableLangs = getSelectableLanguages(options).map((l) => l.id)

  let selected: string[] = selectableLangs
  try {
    const persistedValue = window.localStorage.getItem(storageKey)
    if (persistedValue) {
      selected = JSON.parse(persistedValue)
    }
  } catch (err) {} // eslint-disable-line no-empty

  // constrain persisted/selected languages to the ones currently supported
  selected = intersection(selected, selectableLangs)
  return selected
}

export function persistLanguageIds(languageIds: string[]): void {
  window.localStorage.setItem(storageKey, JSON.stringify(languageIds))
}

function intersection(array1: string[], array2: string[]) {
  return array1.filter((value) => array2.includes(value))
}

export function getSelectableLanguages({
  supportedLanguages,
  defaultLanguages,
}: LanguageFilterConfig): Language[] {
  return Array.isArray(supportedLanguages)
    ? supportedLanguages.filter((lang) => !defaultLanguages?.includes(lang.id))
    : []
}

export function useSelectedLanguageIds(
  options: LanguageFilterConfig,
): [string[], (ids: string[]) => void] {
  return useState(() => [...(options.defaultLanguages ?? []), ...getPersistedLanguageIds(options)])
}
