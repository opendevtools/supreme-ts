import { nvmrc, gitignore, jest, prettierrc, config, husky } from '../tools'

export type Command =
  | 'config'
  | 'gitignore'
  | 'git'
  | 'husky'
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
    case 'config':
      config()
      break
    case 'husky':
      husky()
      break
    default:
      console.log(`${command} is not a valid command`)
  }
}
