import {createPlugin} from 'sanity'

interface MyPluginConfig {
  /* nothing here yet */
}

/**
 * ## Usage in sanity.config.ts (or .js)
 *
 * ```
 * import {createConfig} from 'sanity'
 * import {myPlugin} from '@sanity/language-filter'
 *
 * export const createConfig({
 *     /...
 *     plugins: [
 *         myPlugin()
 *     ]
 * })
 * ```
 */
export const myPlugin = createPlugin<MyPluginConfig | void>((config = {}) => {
  // eslint-disable-next-line no-console
  console.log('hello from @sanity/language-filter')
  return {
    name: '@sanity/language-filter',
  }
})
