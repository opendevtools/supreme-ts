import { create, pkg } from '../utils/file'

export const gitignore = async () => {
  await create('gitignore.txt', '.gitignore')
}

export const prettierrc = async () => {
  await pkg('prettier')
  await create('prettierrc.txt', '.prettierrc')
}

export const jest = async () => {
  await pkg('jest')
  await pkg('jest-watch-typeahead')
  await create('jest.config.txt', 'jest.config.js')
}
