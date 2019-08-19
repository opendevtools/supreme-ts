import { create, installPkg } from '../utils/file'
import execa from 'execa'

export const gitignore = async () => {
  await create('gitignore', '.gitignore')
}

export const prettierrc = async () => {
  await installPkg('prettier')
  await create('prettierrc', '.prettierrc')
}

export const jest = async () => {
  await installPkg('jest')
  await installPkg('jest-watch-typeahead')
  await create('jest.config', 'jest.config.js')
}

export const nvmrc = async () => {
  const { stdout: nodeVersion } = await execa('node', ['-v'])

  await create('nvmrc', '.nvmrc', { nodeVersion })
}
