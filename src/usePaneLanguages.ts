import {useCallback, useMemo} from 'react'

import {getSelectableLanguages, persistLanguageIds} from './useSelectedLanguageIds'
import {useLanguageFilterStudioContext} from './LanguageFilterStudioContext'

export function usePaneLanguages(): {
  activeLanguages: string[]
  allSelected: boolean
  selectAll: () => void
  selectNone: () => void
  toggleLanguage: (languageId: string) => void
} {
  const {selectedLanguageIds, setSelectedLanguageIds, options} = useLanguageFilterStudioContext()
  const {defaultLanguages} = options

  const selectableLanguages = useMemo(() => getSelectableLanguages(options), [options])

  const updateSelectedIds = useCallback(
    (ids: string[]) => {
      setSelectedLanguageIds(ids)
      persistLanguageIds(ids)
    },
    [setSelectedLanguageIds]
  )

  const selectAll = useCallback(
    () => updateSelectedIds(selectableLanguages.map((l) => l.id)),
    [updateSelectedIds, selectableLanguages]
  )

  const selectNone = useCallback(() => {
    updateSelectedIds([])
  }, [updateSelectedIds])

  const toggleLanguage = useCallback(
    (languageId: string) => {
      let lang = selectedLanguageIds

      if (lang.includes(languageId)) {
        lang = lang.filter((l) => l !== languageId)
      } else {
        lang = [...lang, languageId]
      }

      updateSelectedIds(lang)
    },
    [updateSelectedIds, selectedLanguageIds]
  )

  const activeLanguages = useMemo(
    () => [...(defaultLanguages ?? []), ...selectedLanguageIds],
    [defaultLanguages, selectedLanguageIds]
  )

  return {
    activeLanguages,
    allSelected: selectedLanguageIds.length === selectableLanguages.length,
    selectAll,
    selectNone,
    toggleLanguage,
  }
}
