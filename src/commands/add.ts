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

interface AddProps {
  command: Command
  flags: {
    javascript: boolean
  }
}

export const add = ({ command, flags }: AddProps) => {
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
      config({ javascript: flags.javascript })
      break
    case 'husky':
      husky()
      break
    default:
      console.log(`${command} is not a valid command`)
  }
}
