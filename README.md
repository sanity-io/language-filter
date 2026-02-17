# @sanity/language-filter

> For the v2 version, please refer to the [v2 version](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/language-filter).

# Field-level translation filter Plugin for Sanity.io

A Sanity plugin that supports filtering localized fields by language

![Language Filter UI](https://github.com/sanity-io/language-filter/assets/9684022/a48fe4b7-975b-424d-9740-386f09ed9cd8)

## What this plugin solves

There are two popular methods of internationalization in Sanity Studio:

- **Field-level translation**
  - A single document with many languages of content
  - Achieved by mapping over languages on each field, to create an object
  - Best for documents that have a mix of language-specific and common fields
  - Not recommended for Portable Text
- **Document-level translation**
  - A unique document version for every language
  - Joined together by references and/or a predictable `_id`
  - Best for documents that have unique, language-specific fields and no common content across languages
  - Best for translating content using Portable Text

This plugin adds features to the Studio to improve handling **field-level translations**.

- A "Filter Languages" button to show/hide fields in an object of language-specific fields
- Configuration to set "default" languages which are always visible

For **document-level translations** you should use the [@sanity/document-internationalization plugin](https://www.npmjs.com/package/@sanity/document-internationalization).

## Installation

```
npm install --save @sanity/language-filter
```

or

```
yarn add @sanity/language-filter
```

## Usage

Add it as a plugin in sanity.config.ts (or .js), and configure it:

```ts
 import {defineConfig} from 'sanity'
 import {languageFilter} from '@sanity/language-filter'

 export const defineConfig({
     //...
     plugins: [
        languageFilter({
            supportedLanguages: [
              {id: 'nb', title: 'Norwegian (Bokmål)'},
              {id: 'nn', title: 'Norwegian (Nynorsk)'},
              {id: 'en', title: 'English'},
              {id: 'es', title: 'Spanish'},
              {id: 'arb', title: 'Arabic'},
              {id: 'pt', title: 'Portuguese'},
              //...
            ],
            // Select Norwegian (Bokmål) by default
            defaultLanguages: ['nb'],
            // Only show language filter for document type `page` (schemaType.name)
            documentTypes: ['page'],
            filterField: (enclosingType, member, selectedLanguageIds) =>
              !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(member.name),
       })
     ]
 })
```

Config properties:

- `supportedLanguages` can be either:
  -- An static array of language objects with `id` and `title`. If your localized fields are defined using our recommended way described here (https://www.sanity.io/docs/localization), you probably want to share this list of supported languages between this config and your schema.
  -- A function that returns a promise resolving to an array of language objects with `id` and `title`. This is useful if you want to fetch the list of supported languages from an external source. See [Loading languages](#loading-languages) for more details.
- `defaultLanguages` (optional) is an array of strings where each entry must match an `id` from the `supportedLanguages` array. These languages will be listed by default and will not be possible to unselect. If no `defaultLanguages` is configured, all localized fields will be selected by default.
- `documentTypes` (optional) is an array of strings where each entry must match a `name` from your document schemas. If defined, this property will be used to conditionally show the language filter on specific document schema types. If undefined, the language filter will show on all document schema types.
- `filterField` (optional) is a function that must return true if the field should be displayed. It is passed the enclosing type (e.g the object type containing the localized fields, the field, and an array of the currently selected language ids.
  This function is called for all fields and in objects for documents that have language filter enabled.
  _Default:_ `!enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(field.name)`
- `apiVersion` (optional) used for the Sanity Client when asynchronously loading languages.

## Loading languages

Languages must be an array of objects with an `id` and `title`.

```ts
languages: [
  {id: 'en', title: 'English'},
  {id: 'fr', title: 'French'}
],
```

Or an asynchronous function that returns an array of objects with an `id` and `title`.

```ts
languages: async () => {
  const response = await fetch('https://example.com/languages')
  return response.json()
}
```

The async function contains a configured Sanity Client in the first parameter, allowing you to store Language options as documents. Your query should return an array of objects with an `id` and `title`.

```ts
languages: async (client) => {
  const response = await client.fetch(`*[_type == "language"]{ id, title }`)
  return response
},
```

`@sanity/language-filter`'s asynchronous language loading does not currently support modifying the query based on a value in the current document.

## Changes in V3

### documentTypes

Language filter can now be enabled/disabled directly from a schema, using `options.languageFilter: boolean`.
When `documentTypes` is omitted from plugin config, use `options.languageFilter: false` in a document-definition to hide the filter button.
When `documentTypes` is provided in plugin config, use `options.languageFilter: true` in a document-definition to show the filter button.

Example:

```js
export const myDocumentSchema = {
  type: 'document',
  name: 'my-enabled-language-filter-document',
  /** ... */
  options: {
    // show language filter for this document type, regardless of how documentTypes for the plugin is configured
    languageFilter: true,
  },
}
```

## License

MIT-licensed. See LICENSE.

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/language-filter/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
