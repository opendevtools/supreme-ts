import {
  config,
  gitignore,
  jest,
  nvmrc,
  prettierrc,
  husky,
  eslint,
} from '../tools'
import { CLIFlags } from '../'

interface InitProps {
  flags: CLIFlags
}

export const init = async ({ flags }: InitProps) => {
  await config({ javascript: flags.javascript || false })
  await gitignore()
  await prettierrc()
  await jest()
  await nvmrc()
  await husky()
  await eslint({ node: flags.node, react: flags.react })
}
