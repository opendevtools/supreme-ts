import execa from 'execa'
import chalk from 'chalk'

interface ReactProps {
  name?: string
  flags: {
    [name: string]: string
  }
}

export const react = async ({ name, flags }: ReactProps) => {
  console.log(`Creating app ${chalk.blue(name || '')}`)

  // Create app
  await execa('npx', [
    'create-react-app',
    name || '.',
    flags.typescript ? '--typescript' : '',
  ])

  console.log(chalk.green(`Created app ${name || ''}`))
}
