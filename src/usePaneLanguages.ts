import {useCallback, useMemo} from 'react'
import {LanguageFilterConfig} from './types'
import {
  getSelectableLanguages,
  persistLanguageIds,
  useSelectedLanguageIds,
} from './useSelectedLanguageIds'

export interface UsePaneLanguagesParams {
  options: LanguageFilterConfig
  /**
   * We need a way to communicate state changes between the pane menu and input components.
   * LanguageFilter button lives outside the input-render tree, so Context is out.
   * This is a workaround for that.
   */
  onSelectedIdsChange: (ids: string[]) => void
}

export function usePaneLanguages(props: UsePaneLanguagesParams): {
  activeLanguages: string[]
  allSelected: boolean
  selectAll: () => void
  selectNone: () => void
  toggleLanguage: (languageId: string) => void
} {
  const {options, onSelectedIdsChange} = props
  const {defaultLanguages} = options

  const [selectedIds, setSelectedIds] = useSelectedLanguageIds(options)

  const selectableLanguages = useMemo(() => getSelectableLanguages(options), [options])

  const updateSelectedIds = useCallback(
    (ids: string[]) => {
      setSelectedIds(ids)
      persistLanguageIds(ids)
      onSelectedIdsChange(ids)
    },
    [onSelectedIdsChange, setSelectedIds]
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
      let lang = selectedIds

      if (lang.includes(languageId)) {
        lang = lang.filter((l) => l !== languageId)
      } else {
        lang = [...lang, languageId]
      }

      updateSelectedIds(lang)
    },
    [updateSelectedIds, selectedIds]
  )

  const activeLanguages = useMemo(
    () => [...(defaultLanguages ?? []), ...selectedIds],
    [defaultLanguages, selectedIds]
  )

  return {
    activeLanguages,
    allSelected: selectedIds.length === selectableLanguages.length,
    selectAll,
    selectNone,
    toggleLanguage,
  }
}
