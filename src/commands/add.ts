import {
  config,
  eslint,
  gitignore,
  husky,
  jest,
  nvmrc,
  prettierrc,
} from '../tools'
import { CLIFlags } from '../'

export type Command =
  | 'config'
  | 'eslint'
  | 'git'
  | 'gitignore'
  | 'husky'
  | 'jest'
  | 'nvm'
  | 'nvmrc'
  | 'prettier'

interface AddProps {
  command: Command
  flags: CLIFlags
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
    case 'eslint':
      eslint({ node: flags.node, react: flags.react })
      break
    default:
      console.log(`${command} is not a valid command`)
  }
}
