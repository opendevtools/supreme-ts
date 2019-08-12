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
    $ supreme <command>
`)

const { input, flags } = cli
const [command, name] = input

console.log(chalk.italic.bgRed(` SUPREME \n`))

switch (command) {
  case 'react':
    react({ name, flags })
    break
  case 'reason':
    reason({ name, flags })
    break
  default:
    gitignore()
    prettierrc()
    jest()
    nvmrc()
}
