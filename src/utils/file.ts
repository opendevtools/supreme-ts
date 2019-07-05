import chalk from 'chalk'
import execa from 'execa'
import pjson from 'pjson'
import fs from 'fs'
import path from 'path'
import util from 'util'

const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile)

export const create = async (templateName: string, output: string) => {
  try {
    const template = await readFile(
      path.resolve(`src/templates/${templateName}`),
      'utf-8'
    )

    await writeFile(output, template, { flag: 'wx' })

    console.log(`Created ${chalk.green(output)}`)
  } catch (e) {
    console.log(`\nFile already exists ${chalk.yellow(output)}`)
  }
}

export const pkg = async (packageName: string) => {
  const hasPkg =
    (pjson.dependencies && pjson.dependencies.hasOwnProperty(packageName)) ||
    (pjson.devDependencies && pjson.devDependencies.hasOwnProperty(packageName))

  if (!hasPkg) {
    console.log(`Installing ${chalk.blue(packageName)}`)
    await execa('npm', ['install', '--save-dev', packageName])
  }
}
