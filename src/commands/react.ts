import execa from 'execa'
import chalk from 'chalk'
import { CLIFlags } from '../'

interface ReactProps {
  name?: string
  flags: CLIFlags
}

export const react = async ({ name, flags }: ReactProps) => {
  console.log(`Creating app ${chalk.blue(name || '')}`)

  // Create app
  await execa('npx', [
    'create-react-app',
    name || '.',
    flags.javascript ? '' : '--typescript',
  ])

  console.log(chalk.green(`Created app ${name || ''}`))
}
