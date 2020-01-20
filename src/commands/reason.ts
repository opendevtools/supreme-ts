import execa from 'execa'
import chalk from 'chalk'
import { CLIProps } from '../'
import { create, overwrite, createFolder } from '../utils/file'
import path from 'path'
import ora from 'ora'

export const reason = async ({ name }: CLIProps) => {
  const projectName = name || 'supreme-reason'
  const projectFolder = { cwd: path.join(process.cwd(), projectName) }

  console.log(`Creating app ${chalk.blue(projectName)}`)

  const spinner = ora({ text: 'Creating folder', color: 'blue' }).start()

  // Create app
  await execa.command(`mkdir ${projectName}`)
  await execa.command('mkdir public', projectFolder)
  await execa.command('mkdir src', projectFolder)

  // Overwrite base files
  spinner.text = 'Updating configs'
  await overwrite({
    templateName: 'reason/package.json',
    output: `${projectName}/package.json`,
    templateData: {
      name: projectName,
    },
  })

  await overwrite({
    templateName: 'reason/bsconfig.json',
    output: `${projectName}/bsconfig.json`,
    templateData: {
      name: projectName,
    },
  })

  await overwrite({
    templateName: 'reason/webpack.config.js',
    output: `${projectName}/webpack.config.js`,
  })

  // Add custom README
  await overwrite({
    templateName: 'reason/README.md',
    output: `${projectName}/README.md`,
    templateData: {
      name: projectName,
    },
  })

  // Creating git
  await execa.command('git init', projectFolder)
  await overwrite({
    templateName: 'reason/gitignore',
    output: `${projectName}/.gitignore`,
  })

  // Install dependencies
  spinner.text = 'Installing dependencies'
  await execa.command('npm install --silent', projectFolder)

  // Setup Tailwind CSS
  spinner.text = 'Setting up styling'
  await execa('npx', ['tailwind', 'init'], projectFolder)

  await create({
    templateName: 'reason/postcss.config.js',
    output: `${projectName}/postcss.config.js`,
  })
  await create({
    templateName: 'reason/index.css',
    output: `${projectName}/src/index.css`,
  })
  await create({
    templateName: 'reason/index.js',
    output: `${projectName}/src/index.js`,
  })

  // Creates .releaserc for @semantic-release
  await create({
    templateName: 'reason/releaserc',
    output: `${projectName}/.releaserc`,
  })

  // Move and overwrite index html
  spinner.text = 'Updating base files'

  await overwrite({
    templateName: 'reason/index.html',
    output: `${projectName}/public/index.html`,
    templateData: {
      name: projectName,
    },
  })

  await overwrite({
    templateName: 'reason/Index.re',
    output: `${projectName}/src/Index.re`,
  })

  await create({
    templateName: 'reason/App.re',
    output: `${projectName}/src/App.re`,
  })

  // Test setup
  await createFolder(`${projectName}/__tests__`)

  await create({
    templateName: 'reason/App_test.re',
    output: `${projectName}/__tests__/App_test.re`,
  })

  spinner.stop()

  // Bootstrap done
  console.log(chalk.green(`Created app ${projectName}`))
  console.log(`
	Get your app running by opening two terminal tabs and
	running the following commands:

  * ${chalk.green('npm start')} (starts compiler)
  * ${chalk.green('npm run server')} (start Webpack on port 3000)
`)
}
