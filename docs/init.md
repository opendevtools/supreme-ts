# init

- Creates a base setup for [`@iteam/config`](https://github.com/Iteam1337/config).
- Initializes an empty repository and creates a `.gitignore` with some standard
  values.
- Installs [`husky`](https://github.com/typicode/husky), a tool for git hooks, and setup
  it up with [`pretty-quick`](https://github.com/azz/pretty-quick) that runs
  `prettier` on staged files.
- Create `jest.config.js` and install [`jest`](https://jestjs.io/)
- Create a `.nvmrc` wih the users current node version
- Installs [`prettier`](https://prettier.io/), a tool that formats JavaScript, and
  creates our preferred configuration.

## Example

```sh
$ supreme init
```
