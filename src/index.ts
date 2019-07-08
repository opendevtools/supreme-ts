import chalk from 'chalk'
import meow from 'meow'
import { react } from './commands/react'
import { gitignore, nvmrc, jest, prettierrc } from './tools'

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
  default:
    gitignore()
    prettierrc()
    jest()
    nvmrc()
}
