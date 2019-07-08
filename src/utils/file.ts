import chalk from 'chalk'
import execa from 'execa'
import pjson from 'pjson'
import fs from 'fs'
import path from 'path'
import util from 'util'
import ejs from 'ejs'

const writeFile = util.promisify(fs.writeFile)

export const create = async (
  templateName: string,
  output: string,
  templateData: { [key: string]: string } = {}
) => {
  try {
    const template = await ejs.renderFile(
      path.join(__dirname, `../src/templates/${templateName}.ejs`),
      templateData
    )

    await writeFile(path.join(process.cwd(), output), template, { flag: 'wx' })

    console.log(`Created ${chalk.green(output)}`)
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

export const hasPkg = (packageName: string) => {
  return (
    (pjson.dependencies && pjson.dependencies.hasOwnProperty(packageName)) ||
    (pjson.devDependencies && pjson.devDependencies.hasOwnProperty(packageName))
  )
}

export const pkg = async (packageName: string) => {
  if (!hasPkg(packageName)) {
    console.log(`Installing ${chalk.blue(packageName)}`)
    await execa('npm', ['install', '--save-dev', packageName])
  }
}
