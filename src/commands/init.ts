import { gitignore, jest, nvmrc, prettierrc } from '../tools'

export const init = () => {
  gitignore()
  prettierrc()
  jest()
  nvmrc()
}
