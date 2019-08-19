import execa from 'execa'
import chalk from 'chalk'
import { CLIProps } from '../'
import { create, overwrite } from '../utils/file'
import path from 'path'

export const reason = async ({ name }: CLIProps) => {
  const projectName = name || 'supreme-reason'
  const projectFolder = { cwd: path.join(process.cwd(), projectName) }
  const srcFolder = { cwd: path.join(projectFolder.cwd, 'src') }

  console.log(`Creating app ${chalk.blue(projectName)}`)

  // Create app
  await execa.command(`bsb -init ${projectName} -theme react-hooks`)

  // Overwrite base files
  await overwrite('reason/package.json', `${projectName}/package.json`, {
    name: projectName,
  })

  await overwrite('reason/bsconfig.json', `${projectName}/bsconfig.json`, {
    name: projectName,
  })

  await overwrite(
    'reason/webpack.config.js',
    `${projectName}/webpack.config.js`
  )

  // Install dependencies
  await execa.command('npm install --silent', projectFolder)

  // Setup Tailwind CSS
  await execa('npx', ['tailwind', 'init'], projectFolder)

  await create('reason/postcss.config.js', `${projectName}/postcss.config.js`)
  await create('reason/index.css', `${projectName}/src/index.css`)
  await create('reason/index.js', `${projectName}/src/index.js`)

  // Move and overwrite index html
  await execa.command('mkdir public', projectFolder)
  await execa('mv', ['src/index.html', 'public/index.html'], projectFolder)

  await overwrite('reason/index.html', `${projectName}/public/index.html`, {
    name: projectName,
  })

  // Replace default component setup
  await execa.command('rm Component1.re', srcFolder)
  await execa.command('rm Component2.re', srcFolder)

  await overwrite('reason/Index.re', `${projectName}/src/Index.re`)
  await create('reason/App.re', `${projectName}/src/App.re`)

  // Bootstrap done
  console.log(chalk.green(`Created app ${projectName}`))
  console.log(`
	Get your app running by opening two terminal tabs and
	running the following commands:

  * ${chalk.green('npm start')} (starts compiler)
  * ${chalk.green('npm run server')} (start Webpack on port 3000)
`)
}
