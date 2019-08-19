import { gitignore, jest, nvmrc, prettierrc } from '../tools'

export const init = (pkg: { [key: string]: string }) => {
  gitignore()
  prettierrc(pkg)
  jest(pkg)
  nvmrc()
}
