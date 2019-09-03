# add

Add one of the configs/packages created by [`init`](init) inside the current
working directory.

## Valid commands

#### config

Creates a base setup for [`@iteam/config`](https://github.com/Iteam1337/config).

#### gitignore / git

Initializes an empty repository and creates a `.gitignore` with some standard
values.

#### husky

Installs [`husky`](https://github.com/typicode/husky), a tool for git hooks, and setup
it up with [`pretty-quick`](https://github.com/azz/pretty-quick) that runs
`prettier` on staged files.

#### jest

Create `jest.config.js` and install [`jest`](https://jestjs.io/)

#### nvm / nvmrc

Create a `.nvmrc` wih the users current node version

#### prettier

Installs [`prettier`](https://prettier.io/), a tool that formats JavaScript, and
creates our preferred configuration.

## Example

```sh
$ supreme add git
```
