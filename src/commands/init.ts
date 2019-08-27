import { config, gitignore, jest, nvmrc, prettierrc } from '../tools'

export const init = async () => {
  await config()
  await gitignore()
  await prettierrc()
  await jest()
  await nvmrc()
}
