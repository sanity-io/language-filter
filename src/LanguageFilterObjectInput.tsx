import React, {useEffect, useMemo} from 'react'
import {ObjectInputProps, ObjectMember, RenderInputCallback} from 'sanity'
import {LanguageFilterConfig} from './types'
import {defaultFilterField} from './filterField'
import {useLanguageFilterContext} from './LanguageFilterContext'
import {useSelectedLanguageIds} from './useSelectedLanguageIds'

export type LanguageFilterObjectInputProps = {
  options: LanguageFilterConfig
  next: RenderInputCallback
  /**
   * We need a way to communicate state changes between the pane menu and input components.
   * LanguageFilter button lives outside the input-render tree, so Context is out.
   * This is a workaround for that.
   */
  subscribeSelectedIds: (callback: (ids: string[]) => void) => () => void
} & ObjectInputProps

export function LanguageFilterObjectInput(
  props: ObjectInputProps & {
    next: RenderInputCallback
    subscribeSelectedIds: (callback: (ids: string[]) => void) => () => void
  }
) {
  const {options, enabled} = useLanguageFilterContext()
  const {next, subscribeSelectedIds, ...restProps} = props
  if (!enabled || !options) {
    return <>{next(restProps)}</>
  }
  return (
    <FilteredObjectInput
      {...restProps}
      next={next}
      options={options}
      subscribeSelectedIds={subscribeSelectedIds}
    />
  )
}

function FilteredObjectInput(props: LanguageFilterObjectInputProps) {
  const {
    members: membersProp,
    options,
    schemaType,
    next,
    subscribeSelectedIds,
    ...restProps
  } = props
  const [selectedIds, setSelectedIds] = useSelectedLanguageIds(options)

  useEffect(() => {
    const unsubscribe = subscribeSelectedIds(setSelectedIds)
    return () => unsubscribe()
  }, [subscribeSelectedIds, setSelectedIds])

  const activeLanguages = useMemo(
    () => [...(options.defaultLanguages ?? []), ...selectedIds],
    [options.defaultLanguages, selectedIds]
  )

  const filterField = options.filterField ?? defaultFilterField

  const members: ObjectMember[] = useMemo(() => {
    return membersProp.filter(
      (member) =>
        (member.kind === 'field' && filterField(schemaType, member, activeLanguages)) ||
        (member.kind === 'fieldSet' && filterField(schemaType, member.fieldSet, activeLanguages))
    )
  }, [schemaType, membersProp, filterField, activeLanguages])

  return <>{next({...restProps, members, schemaType})}</>
}
