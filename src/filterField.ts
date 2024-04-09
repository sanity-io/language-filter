import type {SchemaType} from 'sanity'

import type {FilterFieldFunction, LanguageFilterConfig, LanguageFilterSchema} from './types'

export const defaultFilterField: FilterFieldFunction = (
  enclosingType,
  field,
  selectedLanguageIds,
) => !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(field.name)

export function isLanguageFilterEnabled(
  schemaType: SchemaType | undefined,
  options: LanguageFilterConfig,
): boolean {
  const schemaFilter =
    isDocument(schemaType) && (schemaType as LanguageFilterSchema)?.options?.languageFilter
  const defaultEnabled = !options.documentTypes

  return !!(
    (defaultEnabled && schemaFilter !== false) ||
    (!defaultEnabled && schemaFilter) ||
    (schemaType && options.documentTypes?.includes(schemaType.name))
  )
}

function isDocument(schemaType?: SchemaType) {
  return schemaType?.jsonType === 'object' && getRootType(schemaType).name === 'document'
}

function getRootType(schema: SchemaType): SchemaType {
  if (schema.type) {
    return getRootType(schema.type)
  }
  return schema
}
