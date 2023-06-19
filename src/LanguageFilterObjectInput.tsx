import React, {useMemo} from 'react'
import {ObjectInputProps, ObjectMember, useFormValue} from 'sanity'
import {useLanguageFilterStudioContext} from './LanguageFilterStudioContext'

// First check that this Object is in a schema type for which language-filter is enabled
export function FilteredObjectWrapper(props: ObjectInputProps) {
  const {options} = useLanguageFilterStudioContext()

  const documentType = useFormValue(['_type'])
  const {documentTypes} = options
  const languageFilterEnabled =
    typeof documentType === 'string' && documentTypes.includes(documentType)

  return languageFilterEnabled ? <FilteredObjectInput {...props} /> : props.renderDefault(props)
}

// Modify the object members based on selected languages in the filter
export function FilteredObjectInput(props: ObjectInputProps) {
  const {members: membersProp, schemaType, renderDefault, ...restProps} = props
  const {selectedLanguageIds, options} = useLanguageFilterStudioContext()
  const {filterField} = options

  const members: ObjectMember[] = useMemo(() => {
    return membersProp
      .filter((member) => {
        return (
          (member.kind === 'field' && filterField(schemaType, member, selectedLanguageIds)) ||
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
                  filterField(schemaType, fieldsetMember, selectedLanguageIds)
                )
              }),
            },
          }
        }
        return member
      })
  }, [schemaType, membersProp, filterField, selectedLanguageIds])

  return renderDefault({...restProps, members, schemaType, renderDefault})
}
