# eslint-plugin-loadable-imports

An ESLint plugin to automatically sort loadable imports alphabetically in your JavaScript files.

## Installation

You can install this plugin using either npm or yarn:

```bash
# npm
npm install eslint-plugin-loadable-imports --save-dev

# yarn
yarn add eslint-plugin-loadable-imports --dev
```

## Usage
After installing the plugin, you need to add it to your ESLint configuration file (.eslintrc.js or equivalent).

### Example configuration
Add loadable-imports to the plugins array and the sort-loadable-imports rule to the rules section:

```js
  module.exports = {
    plugins: [
      'loadable-imports',
    ],
    rules: {
      'loadable-imports/sort-loadable-imports': 'error', // or warn
    },
  };
```

### Example code
Before running ESLint:

```js
  const SecondComponent = loadable(() => import('@/components/SecondComponent'));
  const FirstComponent = loadable(() => import('@/components/FirstComponent'));
  const ThirdComponent = loadable(() => import('@/components/ThirdComponent'));
```

After applying the rule (sorted alphabetically):

```js
  const FirstComponent = loadable(() => import('@/components/FirstComponent'));
  const SecondComponent = loadable(() => import('@/components/SecondComponent'));
  const ThirdComponent = loadable(() => import('@/components/ThirdComponent'));
```

## Rule options

Currently, sort-loadable-imports does not have any options. It simply sorts the imports wrapped in loadable() alphabetically based on the variable names.

## Fixing automatically

You can use ESLint's --fix option to automatically sort the imports.