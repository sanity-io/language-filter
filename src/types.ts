import {FieldMember, FieldsetState, ObjectSchemaType} from 'sanity'

export interface LanguageFilterOptions {
  languageFilter?: boolean
}

export interface LanguageFilterSchema extends ObjectSchemaType {
  options?: LanguageFilterOptions
}

export interface Language {
  id: string
  title: string
}

export type FilterFieldFunction = (
  enclosingType: ObjectSchemaType,
  field: FieldMember | FieldsetState,
  selectedLanguageIds: string[]
) => boolean

export interface LanguageFilterConfig {
  supportedLanguages: Language[]
  defaultLanguages?: string[]
  documentTypes?: string[]
  filterField?: FilterFieldFunction
}
