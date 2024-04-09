import {useCallback, useMemo} from 'react'

import {useLanguageFilterStudioContext} from './LanguageFilterStudioContext'
import {getSelectableLanguages, persistLanguageIds} from './useSelectedLanguageIds'

const unique = (arr: string[]) => Array.from(new Set(arr))

export function usePaneLanguages(): {
  activeLanguages: string[]
  allSelected: boolean
  selectAll: () => void
  selectNone: () => void
  toggleLanguage: (languageId: string) => void
} {
  const {selectedLanguageIds, setSelectedLanguageIds, options} = useLanguageFilterStudioContext()
  const {defaultLanguages = []} = options

  const selectableLanguages = useMemo(() => getSelectableLanguages(options), [options])

  const updateSelectedIds = useCallback(
    (ids: string[]) => {
      setSelectedLanguageIds(unique([...defaultLanguages, ...ids]))
      persistLanguageIds(unique([...defaultLanguages, ...ids]))
    },
    [defaultLanguages, setSelectedLanguageIds],
  )

  const selectAll = useCallback(
    () => updateSelectedIds(selectableLanguages.map((l) => l.id)),
    [updateSelectedIds, selectableLanguages],
  )

  const selectNone = useCallback(() => {
    updateSelectedIds(defaultLanguages)
  }, [defaultLanguages, updateSelectedIds])

  const toggleLanguage = useCallback(
    (languageId: string) => {
      let lang = selectedLanguageIds

      if (lang.includes(languageId)) {
        lang = lang.filter((l) => l !== languageId)
      } else {
        lang = unique([...lang, languageId])
      }

      updateSelectedIds(lang)
    },
    [updateSelectedIds, selectedLanguageIds],
  )

  const activeLanguages = useMemo(
    () => unique([...(defaultLanguages ?? []), ...selectedLanguageIds]),
    [defaultLanguages, selectedLanguageIds],
  )

  return {
    activeLanguages,
    allSelected:
      selectedLanguageIds.length === selectableLanguages.length + defaultLanguages.length,
    selectAll,
    selectNone,
    toggleLanguage,
  }
}
