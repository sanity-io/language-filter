import React, {useMemo} from 'react'
import {ObjectInputProps, ObjectMember} from 'sanity'
import {ObjectInput} from 'sanity/form'
import {usePaneLanguages} from './usePaneLanguages'
import {LanguageFilterConfig} from './types'
import {defaultFilterField} from './filterField'

export type LanguageFilterObjectInputProps = {options: LanguageFilterConfig} & ObjectInputProps

export function LanguageFilterObjectInput(props: LanguageFilterObjectInputProps) {
  const {members: membersProp, level, options, path, schemaType, ...restProps} = props
  const {visibleLanguages} = usePaneLanguages({options})

  const filterField = options.filterField ?? defaultFilterField

  const members: ObjectMember[] = useMemo(() => {
    return membersProp.filter(
      (member) =>
        (member.kind === 'field' && filterField(schemaType, member, visibleLanguages)) ||
        (member.kind === 'fieldSet' && filterField(schemaType, member.fieldSet, visibleLanguages))
    )
  }, [schemaType, membersProp, filterField, visibleLanguages])

  return (
    <ObjectInput
      {...restProps}
      level={level}
      members={members}
      path={path}
      schemaType={schemaType}
    />
  )
}
