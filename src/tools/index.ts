import { create, installPkg } from '../utils/file'
import execa from 'execa'

export const gitignore = async () => {
  await create('gitignore', '.gitignore')
}

export const prettierrc = async (pkg: { [key: string]: string }) => {
  await installPkg('prettier', pkg)
  await create('prettierrc', '.prettierrc')
}

export const jest = async (pkg: { [key: string]: string }) => {
  await installPkg('jest', pkg)
  await installPkg('jest-watch-typeahead', pkg)
  await create('jest.config', 'jest.config.js')
}

export const nvmrc = async () => {
  const { stdout: nodeVersion } = await execa('node', ['-v'])

  await create('nvmrc', '.nvmrc', { nodeVersion })
}
