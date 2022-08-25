# @sanity/language-filter

## Installation

```
npm install --save sanity-plugin-language-filter
```

or

```
yarn add sanity-plugin-language-filter
```

## Usage
Add it as a plugin in sanity.config.ts (or .js):

```
 import {createConfig} from 'sanity'
 import {myPlugin} from 'sanity-plugin-language-filter'

 export const createConfig({
     /...
     plugins: [
         myPlugin({})
     ]
 })
```
## License

MIT © Sanity.io
See LICENSE
