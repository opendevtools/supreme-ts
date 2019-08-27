import { nvmrc, gitignore, jest, prettierrc } from '../tools'

export type Command =
  | 'gitignore'
  | 'git'
  | 'jest'
  | 'nvm'
  | 'nvmrc'
  | 'prettier'

export const add = (command: Command) => {
  switch (command) {
    case 'nvm':
    case 'nvmrc':
      nvmrc()
      break
    case 'git':
    case 'gitignore':
      gitignore()
      break
    case 'jest':
      jest()
      break
    case 'prettier':
      prettierrc()
      break
    default:
      console.log(`${command} is not a valid command`)
  }
}
