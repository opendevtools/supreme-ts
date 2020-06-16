import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import util from 'util'
import ejs from 'ejs'
import readPkgUp from 'read-pkg-up'
import inquirer from 'inquirer'
import { Ora } from 'ora'

interface HandleFileData {
  templateName: string
  output: string
  templateData?: { [key: string]: string | boolean }
}

interface HandleFileOptions {
  flag: 'w' | 'wx'
}

const handleFileExists = async (data: HandleFileData) => {
  console.error(`File already exists ${chalk.yellow(data.output)}`)

  const answers = await inquirer.prompt({
    type: 'confirm',
    name: 'isOverwrite',
    message: 'Do you want to overwrite the existing file?',
    default: false,
  })

  if (answers.isOverwrite) {
    overwrite(data)
  }
}

const handleFile = async (
  data: HandleFileData,
  { flag }: HandleFileOptions
) => {
  const { templateName, output, templateData = {} } = data
  const writeFile = util.promisify(fs.writeFile)

  try {
    const template = await ejs.renderFile(
      path.join(__dirname, `../src/templates/${templateName}.ejs`),
      templateData
    )

    await writeFile(path.join(process.cwd(), output), template, { flag })
  } catch (e) {
    switch (e.code) {
      case 'EEXIST':
        await handleFileExists(data)
        break
      default:
        console.error('Something went wrong', e)
    }
  }
}

export const readSnippet = (templateName: string) => {
  return ejs.renderFile(
    path.resolve(__dirname, `../src/templates/snippets/${templateName}.ejs`)
  )
}

export const create = (data: HandleFileData) =>
  handleFile(data, {
    flag: 'wx',
  })

export const overwrite = (data: HandleFileData) =>
  handleFile(data, {
    flag: 'w',
  })

export const createFolder = async (folderName: string) => {
  const mkdir = util.promisify(fs.mkdir)

  try {
    await mkdir(path.resolve(process.cwd(), folderName))
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

export const folderExists = (folderName: string) => {
  return fs.existsSync(path.resolve(process.cwd(), folderName))
}

interface PackageOptions {
  cwd?: string
  spinner?: Ora
}

export const hasPkg = async (packageName: string, options: PackageOptions) => {
  const pkg = await readPkgUp(options)

  if (!pkg) {
    return false
  }

  const dep = pkg.packageJson.dependencies
  const devDep = pkg.packageJson.devDependencies

  return (
    (!!dep && dep.hasOwnProperty(packageName)) ||
    (!!devDep && devDep.hasOwnProperty(packageName))
  )
}

export const installPkg = async (
  packageName: string,
  options: PackageOptions = {}
) => {
  const hasPackageInstalled = await hasPkg(packageName, options)

  if (!hasPackageInstalled) {
    const msg = `Installing ${chalk.blue(packageName)}`

    if (options.spinner) {
      options.spinner.text = msg
    } else {
      console.log(msg)
    }

    await execa.command(
      `npm install --save-dev --save-exact ${packageName}`,
      options
    )
  }
}
