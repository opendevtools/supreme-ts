import { config, gitignore, jest, nvmrc, prettierrc, husky } from '../tools'

export const init = async () => {
  await config()
  await gitignore()
  await prettierrc()
  await jest()
  await nvmrc()
  await husky()
}
