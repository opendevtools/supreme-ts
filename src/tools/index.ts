import { create, installPkg } from '../utils/file'
import execa from 'execa'

export const gitignore = async () => {
  await create({
    templateName: 'gitignore',
    output: '.gitignore',
  })
}

export const prettierrc = async () => {
  await installPkg('prettier')

  await create({
    templateName: 'prettierrc',
    output: '.prettierrc',
  })
}

export const jest = async () => {
  await installPkg('jest')
  await installPkg('jest-watch-typeahead')

  await create({
    templateName: 'jest.config',
    output: 'jest.config.js',
  })
}

export const nvmrc = async () => {
  const { stdout: nodeVersion } = await execa('node', ['-v'])

  await create({
    templateName: 'nvmrc',
    output: '.nvmrc',
    templateData: { nodeVersion },
  })
}

export const config = async () => {
  await installPkg('@iteam/config')

  await create({
    templateName: 'config/config.js',
    output: 'src/config.js',
  })
  await create({
    templateName: 'config/config.json',
    output: 'config.json',
  })
}
