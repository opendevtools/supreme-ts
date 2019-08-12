import chalk from 'chalk'
import meow from 'meow'
import { react } from './commands/react'
import { reason } from './commands/reason'
import { gitignore, jest, nvmrc, prettierrc } from './tools'

export interface CLIProps {
  name?: string
  flags: {
    [name: string]: string
  }
}

const cli = meow(`
    Usage
      $ supreme [command]

    Commands
      $ init            Create some configs and ignore files
      $ react [flags]   Creates a React app (CRA)
      $ reason [flags]  Creates a Reason app

    Flags
      --typescript    Typescript (React apps only)
`)

const { input, flags } = cli
const [command, name] = input

console.log(chalk.italic.bgRed(` SUPREME \n`))

switch (command) {
  case 'init':
    gitignore()
    prettierrc()
    jest()
    nvmrc()
    break
  case 'react':
    react({ name, flags })
    break
  case 'reason':
    reason({ name, flags })
    break
}
