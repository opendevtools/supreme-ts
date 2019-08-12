<div align="center">
  <p>
    <img alt="Iteam Supreme" src="docs/iteam-supreme.png" width="300" />
  </p>
</div>

Use this tool to get up and running fast with configs and more in your project.
The tool currently supports creating React apps (using [`create-react-app`](https://facebook.github.io/create-react-app)) and [ReasonReact](https://reasonml.github.io/reason-react/) apps. It can also create some basic configs in your project.

Built with ❤️ by [@Jimjardland](https://github.com/Jimjardland) and [@believer](https://github.com/believer).

## commands

`supreme`

- Initializes empty Git repository and adds a `.gitignore`
- Installs `prettier` and creates config
- Installs `jest`
- Creates an `.nvmrc` with the current Node version

`supreme react <name> [flags]`

Creates a React app using `create-react-app` with the provided name.

**Supported flags:**

- `--typescript` - create a Typescript React app

`supreme reason <name>`

Creates a ReasonReact app using `bsb` and customizes the app with our preferred
defaults.

## Installation

```bash
npx @iteam/supreme
```

or

```bash
npm install -g @iteam/supreme
```

After that you'll have `supreme` as a global command to use in a repository of your choice.
