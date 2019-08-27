import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import util from 'util'
import ejs from 'ejs'
import readPkgUp from 'read-pkg-up'

interface HandleFile {
  templateName: string
  output: string
  templateData: { [key: string]: string }
  flag: 'w' | 'wx'
  message: string
}

const handleFile = async ({
  templateName,
  output,
  templateData,
  flag,
  message,
}: HandleFile) => {
  const writeFile = util.promisify(fs.writeFile)

  try {
    const template = await ejs.renderFile(
      path.join(__dirname, `../src/templates/${templateName}.ejs`),
      templateData
    )

    await writeFile(path.join(process.cwd(), output), template, { flag })

    console.log(message)
  } catch (e) {
    switch (e.code) {
      case 'EEXIST':
        console.error(`File already exists ${chalk.yellow(output)}`)
        break
      default:
        console.error('Something went wrong', e)
    }
  }
}

export const create = async (
  templateName: string,
  output: string,
  templateData: { [key: string]: string } = {}
) => {
  await handleFile({
    templateName,
    templateData,
    output,
    flag: 'wx',
    message: `Created ${chalk.green(output)}`,
  })
}

export const overwrite = async (
  templateName: string,
  output: string,
  templateData: { [key: string]: string } = {}
) => {
  await handleFile({
    templateName,
    templateData,
    output,
    flag: 'w',
    message: `Updated ${chalk.green(output)}`,
  })
}

export const hasPkg = async (packageName: string) => {
  const pkg = await readPkgUp()

  if (!pkg) {
    return false
  }

  const dep = pkg.package.dependencies
  const devDep = pkg.package.devDependencies

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