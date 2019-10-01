import chalk from 'chalk'
import execa from 'execa'
import ora from 'ora'
import path from 'path'
import { husky, jest, nvmrc, prettierrc } from '../tools'
import { create, createFolder, overwrite } from '../utils/file'

interface GraphQLProps {
  flags: any
  name?: string
}

export const graphql = async ({ name, flags }: GraphQLProps) => {
  if (!name) {
    console.log(`No name provided`)
    return
  }

  const projectFolder = { cwd: path.join(process.cwd(), name) }

  const spinner = ora({ text: 'Creating folder', color: 'blue' }).start()

  await createFolder(name)

  spinner.text = 'Creating empty git repository'

  await execa.command('git init', projectFolder)
  await overwrite({
    templateName: 'graphql/gitignore',
    output: `${name}/.gitignore`,
  })

  spinner.text = 'Installing dependencies'

  await create({
    templateName: 'graphql/package.json',
    output: `${name}/package.json`,
    templateData: {
      name,
    },
  })
  await execa.command('npm install --silent', projectFolder)

  await prettierrc({ cwd: name })
  await jest({ cwd: name })
  await nvmrc({ cwd: name })
  await husky({ cwd: name })

  spinner.text = 'Creating base files'

  await create({
    templateName: 'graphql/tsconfig.json',
    output: `${name}/tsconfig.json`,
  })

  await createFolder(`${name}/lib`)

  if (flags.examples) {
    await create({
      templateName: 'graphql/serverExample.ts',
      output: `${name}/lib/server.ts`,
    })

    await createFolder(`${name}/lib/resolvers`)
    await create({
      templateName: 'graphql/resolversExample.ts',
      output: `${name}/lib/resolvers/queue.ts`,
    })

    await createFolder(`${name}/lib/__generated__`)
    await create({
      templateName: 'graphql/graphql.d.ts',
      output: `${name}/lib/__generated__/graphql.d.ts`,
    })
  } else {
    await create({
      templateName: 'graphql/server.ts',
      output: `${name}/lib/server.ts`,
    })
  }

  spinner.stop()

  console.log(chalk.green(`Created app ${name}`))
  console.log(`
  Start the API by running:

  * ${chalk.green(`cd ${name}`)}
  * ${chalk.green('npm run dev')} (starts API on port 4000)
  `)
}
