import React, {useEffect, useMemo} from 'react'
import {ObjectInputProps, ObjectMember} from 'sanity'
import {LanguageFilterConfig} from './types'
import {defaultFilterField} from './filterField'
import {useLanguageFilterContext} from './LanguageFilterContext'
import {useSelectedLanguageIds} from './useSelectedLanguageIds'

export type LanguageFilterObjectInputProps = {
  options: LanguageFilterConfig
  /**
   * We need a way to communicate state changes between the pane menu and input components.
   * LanguageFilter button lives outside the input-render tree, so Context is out.
   * This is a workaround for that.
   */
  subscribeSelectedIds: (callback: (ids: string[]) => void) => () => void
} & ObjectInputProps

export function LanguageFilterObjectInput(
  props: ObjectInputProps & {
    subscribeSelectedIds: (callback: (ids: string[]) => void) => () => void
  }
) {
  const context = useLanguageFilterContext()
  const {options, enabled} = context || {}
  const {subscribeSelectedIds, ...restProps} = props
  if (!enabled || !options) {
    return props.renderDefault(restProps)
  }
  return (
    <FilteredObjectInput
      {...restProps}
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
    renderDefault,
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
    return membersProp
      .filter((member) => {
        return (
          (member.kind === 'field' && filterField(schemaType, member, activeLanguages)) ||
          member.kind === 'fieldSet'
        )
      })
      .map((member) => {
        if (member.kind === 'fieldSet') {
          return {
            ...member,
            fieldSet: {
              ...member.fieldSet,
              members: member.fieldSet.members.filter((fieldsetMember) => {
                return (
                  fieldsetMember.kind === 'field' &&
                  filterField(schemaType, fieldsetMember, activeLanguages)
                )
              }),
            },
          }
        }
        return member
      })
  }, [schemaType, membersProp, filterField, activeLanguages])

  return renderDefault({...restProps, members, schemaType, renderDefault})
}
