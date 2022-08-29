import React from 'react'
import {_DocumentLanguageFilterComponent, createPlugin, ObjectInputProps} from 'sanity'
import {LanguageFilterObjectInput} from './LanguageFilterObjectInput'
import {LanguageFilterMenuButton} from './LanguageFilterMenuButton'
import {LanguageFilterConfig} from './types'
import {isLanguageFilterEnabled} from './filterField'

/**
 * ## Usage in sanity.config.ts (or .js)
 *
 * ```
 * import {createConfig} from 'sanity'
 * import {languageFilter} from '@sanity/language-filter'
 *
 * export const createConfig({
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
export const languageFilter = createPlugin<LanguageFilterConfig>((options) => {
  const RenderLanguageFilter: _DocumentLanguageFilterComponent = () => {
    return <LanguageFilterMenuButton options={options} />
  }

  return {
    name: '@sanity/language-filter',
    document: {
      unstable_languageFilter: (prev, {schemaType, schema}) => {
        if (isLanguageFilterEnabled(schema.get(schemaType), options)) {
          return [...prev, RenderLanguageFilter]
        }
        return prev
      },
    },

    form: {
      renderInput(props, next) {
        const enabled = isLanguageFilterEnabled(props.schemaType, options)
        if (enabled && props.schemaType.jsonType === 'object') {
          return <LanguageFilterObjectInput {...(props as ObjectInputProps)} options={options} />
        }
        return next(props)
      },
    },
  }
})
