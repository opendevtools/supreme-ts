<div align="center">
  <p>
    <img alt="Iteam Supreme" src="docs/iteam-supreme.png" width="300" />
  </p>
</div>

[![Build Status](https://travis-ci.com/Iteam1337/supreme.svg?branch=master)](https://travis-ci.com/Iteam1337/supreme) [![Test Coverage](https://api.codeclimate.com/v1/badges/f43b4db75e264464c6d1/test_coverage)](https://codeclimate.com/github/Iteam1337/supreme/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/f43b4db75e264464c6d1/maintainability)](https://codeclimate.com/github/Iteam1337/supreme/maintainability)

Use this tool to get up and running fast with configs and more in your project.
The tool currently supports creating React apps (using [`create-react-app`](https://facebook.github.io/create-react-app)) and [ReasonReact](https://reasonml.github.io/reason-react/) apps. It can also create some basic configs in your project.

Built with ❤️ by [@Jimjardland](https://github.com/Jimjardland) and [@believer](https://github.com/believer).

## Installation

```bash
npx @iteam/supreme
```

or

```bash
npm install -g @iteam/supreme
```

After that you'll have `supreme` as a global command to use in a repository of your choice.

## Commands

### `init`

- Initializes empty Git repository and adds a `.gitignore`
- Installs `prettier` and creates config
- Installs `jest`
- Creates an `.nvmrc` with the current Node version

### `add <command>`

Add one of the configs/packages created by `init`. Valid commands are

```typescript
export type Command =
  | 'gitignore'
  | 'git'
  | 'jest'
  | 'nvm'
  | 'nvmrc'
  | 'prettier'
```

### `react <name> [flags]`

Creates a React app using `create-react-app` with the provided name.

**Supported flags:**

- `--typescript` - create a Typescript React app

### `reason <name>`

Creates a ReasonReact app using `bsb` and customizes the app with our preferred
defaults.
