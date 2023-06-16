import React from 'react'
import {definePlugin, DocumentLanguageFilterComponent, ObjectInputProps} from 'sanity'
import {LanguageFilterObjectInput} from './LanguageFilterObjectInput'
import {LanguageFilterMenuButton} from './LanguageFilterMenuButton'
import {LanguageFilterConfig} from './types'
import {isLanguageFilterEnabled} from './filterField'
import {LanguageFilterProvider} from './LanguageFilterContext'
import {createSelectedLanguageIdsBus} from './languageSubscription'
import {LanguageFilterStudioProvider} from './LanguageFilterStudioContext'

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
  const {onSelectedIdsChange, subscribeSelectedIds} = createSelectedLanguageIdsBus()

  const RenderLanguageFilter: DocumentLanguageFilterComponent = () => {
    return <LanguageFilterMenuButton options={options} onSelectedIdsChange={onSelectedIdsChange} />
  }

  return {
    name: '@sanity/language-filter',
    studio: {
      components: {
        layout: (props) => LanguageFilterStudioProvider({...props, options}),
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
        // eslint-disable-next-line func-name-matching
        input: function LanguageFilterWrapper(props) {
          const enabled = isLanguageFilterEnabled(props.schemaType, options)
          // will only be considered enabled for document, so this is only done once
          if (enabled) {
            return (
              <LanguageFilterProvider enabled={enabled} options={options}>
                {props.renderDefault(props)}
              </LanguageFilterProvider>
            )
          }
          if (props.schemaType.jsonType === 'object') {
            return (
              <LanguageFilterObjectInput
                {...(props as ObjectInputProps)}
                subscribeSelectedIds={subscribeSelectedIds}
              />
            )
          }

          return props.renderDefault(props)
        },
      },
    },
  }
})
