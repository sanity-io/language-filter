import type {FieldMember, FieldsetState, ObjectSchemaType, SanityClient} from 'sanity'

export interface LanguageFilterOptions {
  languageFilter?: boolean
}

export interface LanguageFilterSchema extends ObjectSchemaType {
  options?: LanguageFilterOptions
}

export type Language = {
  id: Intl.UnicodeBCP47LocaleIdentifier
  title: string
}

export type LanguageCallback = (
  client: SanityClient,
  selectedValue: Record<string, unknown>,
) => Promise<Language[]>

export type FilterFieldFunction = (
  enclosingType: ObjectSchemaType,
  field: FieldMember | FieldsetState,
  selectedLanguageIds: string[],
) => boolean

export interface LanguageFilterConfig {
  supportedLanguages: Language[] | LanguageCallback
  defaultLanguages?: string[]
  documentTypes?: string[]
  filterField?: FilterFieldFunction
  /**
   * https://www.sanity.io/docs/api-versioning
   * @defaultValue '2022-11-27'
   */
  apiVersion?: string
}

export interface LanguageFilterConfigProcessed extends LanguageFilterConfig {
  supportedLanguages: Language[]
}
