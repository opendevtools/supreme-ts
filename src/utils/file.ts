import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import util from 'util'
import ejs from 'ejs'
import readPkgUp from 'read-pkg-up'
import inquirer from 'inquirer'

interface HandleFileData {
  templateName: string
  output: string
  templateData?: { [key: string]: string }
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
    const template = await ejs.renderFile<string>(
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
  return ejs.renderFile<string>(
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

  await mkdir(path.resolve(process.cwd(), folderName))
}

export const folderExists = (folderName: string) => {
  const stat = util.promisify(fs.stat)
  return stat(path.resolve(process.cwd(), folderName))
}

export const hasPkg = async (packageName: string) => {
  const pkg = await readPkgUp()

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

export const installPkg = async (packageName: string) => {
  const hasPackageInstalled = await hasPkg(packageName)

  if (!hasPackageInstalled) {
    console.log(`Installing ${chalk.blue(packageName)}`)
    await execa('npm', ['install', '--save-dev', packageName])
  }
}
