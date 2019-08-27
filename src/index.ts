import chalk from 'chalk'
import meow from 'meow'
import { react } from './commands/react'
import { add, Command } from './commands/add'
import { reason } from './commands/reason'
import { init } from './commands/init'

export interface CLIProps {
  name?: string
  flags: {
    [name: string]: string
  }
}

export const run = (cli: meow.Result) => {
  const { input, flags, help } = cli
  const [command, name] = input

  console.log(chalk.italic.bgRed(` SUPREME \n`))

  switch (command) {
    case 'init':
      init()
      break
    case 'react':
      react({ name, flags })
      break
    case 'reason':
      reason({ name, flags })
      break
    case 'add':
      add(name as Command)
      break
    default:
      console.log(help)
  }
}

const cli = meow(
  `
    Usage
    $ supreme [command]

    Commands
    $ init                    Create some configs and ignore files
    $ add <name>              Add a specific config
    $ react <name> [flags]    Creates a React app (CRA)
    $ reason <name>           Creates a ReasonReact app

    Flags
    --typescript    Typescript (React apps only)
    `,
  {
    flags: {
      typescript: {
        type: 'boolean',
      },
    },
  }
)

run(cli)
