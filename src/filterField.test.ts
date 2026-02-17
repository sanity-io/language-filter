import type {FieldMember, ObjectSchemaType} from 'sanity'

import {defaultFilterField, isLanguageFilterEnabled} from './filterField'

describe('filterField', () => {
  describe('isLanguageFilterEnabled', () => {
    const docType: ObjectSchemaType = {
      name: 'some-doc',
      jsonType: 'object',
      fields: [],
      // eslint-disable-next-line camelcase
      __experimental_search: [],
      type: {
        name: 'document',
        jsonType: 'object',
        fields: [],
        // eslint-disable-next-line camelcase
        __experimental_search: [],
      },
    }
    it('should be enabled when documentTypes is missing', () => {
      const enabled = isLanguageFilterEnabled(docType, {supportedLanguages: []})
      expect(enabled).toBeTruthy()
    })

    it('should be disabled when documentTypes is missing and options.languageFilter: false', () => {
      const enabled = isLanguageFilterEnabled(
        {...docType, options: {languageFilter: false}},
        {supportedLanguages: []},
      )
      expect(enabled).toBeFalsy()
    })

    it('should be enabled when documentTypes is contains doc-type name', () => {
      const enabled = isLanguageFilterEnabled(
        {...docType, options: {languageFilter: false}},
        {supportedLanguages: [], documentTypes: [docType.name]},
      )
      expect(enabled).toBeTruthy()
    })

    it('should be enabled when documentTypes does not contain doc-type name, but options.languageFilter: true', () => {
      const enabled = isLanguageFilterEnabled(
        {...docType, options: {languageFilter: true}},
        {supportedLanguages: [], documentTypes: []},
      )
      expect(enabled).toBeTruthy()
    })
  })

  describe('defaultFilterField', () => {
    const localePrefixedObject: ObjectSchemaType = {
      name: 'locale_parent',
      jsonType: 'object',
      fields: [],
      // eslint-disable-next-line camelcase
      __experimental_search: [],
    }
    const member: FieldMember = {
      name: 'nb',
      key: 'nb',
      collapsed: undefined,
      collapsible: undefined,
      kind: 'field',
      open: true,
      index: 0,
      field: {
        schemaType: {name: 'string', jsonType: 'string'},
        level: 1,
        id: 'nb',
        path: [],
        validation: [],
        presence: [],
        changed: false,
        value: undefined,
      },
      groups: [],
      inSelectedGroup: false,
    }

    it('should filter -> true for nb field inside local-prefixed object', () => {
      const result = defaultFilterField(localePrefixedObject, member, ['nb'])
      expect(result).toBeTruthy()
    })

    it('should filter -> false for unselected field inside local-prefixed object', () => {
      const result = defaultFilterField(localePrefixedObject, member, ['other'])
      expect(result).toBeFalsy()
    })

    it('should filter -> true for nb field inside non-prefixed object', () => {
      const result = defaultFilterField(
        {...localePrefixedObject, name: 'not-start-with-locale-field'},
        member,
        ['nb'],
      )
      expect(result).toBeTruthy()
    })
  })
})
