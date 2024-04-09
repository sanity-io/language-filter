import {
  definePlugin,
  type DocumentLanguageFilterComponent,
  isObjectSchemaType,
  type ObjectInputProps,
} from 'sanity'

import {isLanguageFilterEnabled} from './filterField'
import {LanguageFilterMenuButton} from './LanguageFilterMenuButton'
import {FilteredObjectWrapper} from './LanguageFilterObjectInput'
import {defaultContextValue, LanguageFilterStudioProvider} from './LanguageFilterStudioContext'
import type {LanguageFilterConfig} from './types'

/**
 * ## Usage in sanity.config.ts (or .js)
 *
 * ```
 * import {defineConfig} from 'sanity'
 * import {languageFilter} from '@sanity/language-filter'
 *
 * export const defineConfig({
 *     /...
 *     plugins: [
 *         languageFilter({
 *             supportedLanguages: [
 *               {id: 'nb', title: 'Norwegian (Bokmål)'},
 *               {id: 'nn', title: 'Norwegian (Nynorsk)'},
 *               {id: 'en', title: 'English'},
 *               {id: 'es', title: 'Spanish'},
 *               {id: 'arb', title: 'Arabic'},
 *               {id: 'pt', title: 'Portuguese'},
 *               //...
 *             ],
 *             // Select Norwegian (Bokmål) by default
 *             defaultLanguages: ['nb'],
 *             // Only show language filter for document type `page` (schemaType.name)
 *             // Can also enable via document-options: options.languageFilter: true
 *             documentTypes: ['page'],
 *             // default filter function shown
 *             filterField: (enclosingType, field, selectedLanguageIds) =>
 *               !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(field.name),
 *        })
 *    ]
 * })
 * ```
 */
export const languageFilter = definePlugin<LanguageFilterConfig>((options) => {
  const RenderLanguageFilter: DocumentLanguageFilterComponent = () => {
    return <LanguageFilterMenuButton />
  }

  const pluginOptions = {
    ...defaultContextValue.options,
    ...options,
  }

  return {
    name: '@sanity/language-filter',
    studio: {
      components: {
        layout: (props) => LanguageFilterStudioProvider({...props, options: pluginOptions}),
      },
    },

    document: {
      unstable_languageFilter: (prev, {schemaType, schema}) => {
        if (isLanguageFilterEnabled(schema.get(schemaType), options)) {
          return [...prev, RenderLanguageFilter]
        }
        return prev
      },
    },

    form: {
      components: {
        input: (props) => {
          if (props.id !== 'root' && isObjectSchemaType(props.schemaType)) {
            return FilteredObjectWrapper(props as ObjectInputProps)
          }

          return props.renderDefault(props)
        },
      },
    },
  }
})
