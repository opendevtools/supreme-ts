import execa from 'execa'
import chalk from 'chalk'
import { CLIProps } from '../'

export const react = async ({ name, flags }: CLIProps) => {
  console.log(`Creating app ${chalk.blue(name || '')}`)

  // Create app
  await execa('npx', [
    'create-react-app',
    name || '.',
    flags.typescript ? '--typescript' : '',
  ])

  console.log(chalk.green(`Created app ${name || ''}`))
}
