import chalk from 'chalk'
import meow from 'meow'
import { react } from './commands/react'
import { reason } from './commands/reason'
import { init } from './commands/init'

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
      $ init                    Create some configs and ignore files
      $ react <name> [flags]    Creates a React app (CRA)
      $ reason <name>           Creates a ReasonReact app

    Flags
      --typescript    Typescript (React apps only)
`)

const { input, flags, pkg } = cli
const [command, name] = input

console.log(chalk.italic.bgRed(` SUPREME \n`))

switch (command) {
  case 'init':
    init(pkg)
    break
  case 'react':
    react({ name, flags })
    break
  case 'reason':
    reason({ name, flags })
    break
}
