import chalk from 'chalk'
import execa from 'execa'
import ora from 'ora'
import path from 'path'
import { husky, jest, nvmrc, prettierrc, eslint } from '../tools'
import { create, createFolder, overwrite, installPkg } from '../utils/file'

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

  await prettierrc({ cwd: name, spinner })
  await jest({ cwd: name, spinner })
  await nvmrc({ cwd: name, spinner })
  await husky({ cwd: name, spinner })
  await eslint({ cwd: name, node: true, spinner })

  spinner.text = 'Creating base files'

  await createFolder(`${name}/lib`)
  await createFolder(`${name}/lib/__generated__`)

  if (flags.auth) {
    spinner.text = 'Installing additional dependencies'

    await installPkg('graphql-directive-auth@0.3.2', {
      spinner,
      cwd: name,
      dev: false,
    })
    await installPkg('graphql-tools@6.0.10', { spinner, cwd: name, dev: false })

    spinner.text = 'Creating base files'
    await create({
      templateName: 'graphql/auth/server.ts',
      output: `${name}/lib/server.ts`,
    })

    await create({
      templateName: 'graphql/auth/graphql.d.ts',
      output: `${name}/lib/__generated__/graphql.d.ts`,
    })

    await create({
      templateName: 'graphql/auth/index.d.ts',
      output: `${name}/index.d.ts`,
    })

    await create({
      templateName: 'graphql/auth/tsconfig.json',
      output: `${name}/tsconfig.json`,
    })
  } else if (flags.examples) {
    await create({
      templateName: 'graphql/serverExample.ts',
      output: `${name}/lib/server.ts`,
    })

    await createFolder(`${name}/lib/resolvers`)
    await create({
      templateName: 'graphql/resolversExample.ts',
      output: `${name}/lib/resolvers/queue.ts`,
    })

    await create({
      templateName: 'graphql/graphqlExample.d.ts',
      output: `${name}/lib/__generated__/graphql.d.ts`,
    })
  } else {
    await create({
      templateName: 'graphql/server.ts',
      output: `${name}/lib/server.ts`,
    })

    await create({
      templateName: 'graphql/graphql.d.ts',
      output: `${name}/lib/__generated__/graphql.d.ts`,
    })

    await create({
      templateName: 'typescript/tsconfig.json',
      output: `${name}/tsconfig.json`,
    })
  }

  await create({
    templateName: 'graphql/codegen.yml',
    output: `${name}/codegen.yml`,
  })

  spinner.stop()

  console.log(chalk.green(`Created app ${name}`))
  console.log(`
  Start the API by running:

  * ${chalk.green(`cd ${name}`)}
  * ${chalk.green('npm run dev')} (starts API on port 4000)
  `)
}
