import chalk from 'chalk'
import execa from 'execa'
import ora from 'ora'
import path from 'path'
import { CLIFlags } from '../'
import { eslint, gitignore, husky, jest, nvmrc, prettierrc } from '../tools'
import { create, createFolder } from '../utils/file'

interface TypescriptProps {
  flags: CLIFlags
  name?: string
}

export const typescript = async ({ name }: TypescriptProps) => {
  if (!name) {
    console.log(`No name provided`)
    return
  }

  const projectFolder = { cwd: path.join(process.cwd(), name) }
  const spinner = ora({ text: 'Creating folder', color: 'blue' }).start()

  await createFolder(name)

  await create({
    templateName: 'typescript/package.json',
    output: `${name}/package.json`,
    templateData: {
      name,
    },
  })

  spinner.text = 'Installing dependencies'

  await execa.command('npm install --silent', projectFolder)

  await prettierrc({ cwd: name, spinner })
  await jest({ cwd: name, spinner })
  await nvmrc({ cwd: name, spinner })
  await husky({ cwd: name, spinner })
  await gitignore({ cwd: name, spinner })
  await eslint({ cwd: name, node: true, spinner })

  spinner.text = 'Creating files'

  await createFolder(`${name}/lib`)

  await create({
    templateName: 'typescript/tsconfig.json',
    output: `${name}/tsconfig.json`,
  })

  await create({
    templateName: 'typescript/index.ts',
    output: `${name}/lib/index.ts`,
  })

  spinner.stop()

  console.log(chalk.green(`Created app ${name}`))
  console.log(`
  Build the app by running:

  * ${chalk.green(`cd ${name}`)}
  * ${chalk.green('npm run build')} (builds app)
  `)
}
