import { add } from '../../src/commands/add'
import {
  nvmrc,
  gitignore,
  jest as jestFn,
  prettierrc,
  config,
  husky,
} from '../../src/tools'

jest.mock('../../src/tools')

jest.spyOn(global.console, 'log').mockImplementation(() => {})

beforeEach(jest.clearAllMocks)

test('nvm - runs nvmrc tool', async () => {
  await add('nvm')

  expect(nvmrc).toHaveBeenCalled()
})

test('nvmrc - runs nvmrc tool', async () => {
  await add('nvmrc')

  expect(nvmrc).toHaveBeenCalled()
})

test('git - runs gitignore tool', async () => {
  await add('git')

  expect(gitignore).toHaveBeenCalled()
})

test('gitignore - runs gitignore tool', async () => {
  await add('gitignore')

  expect(gitignore).toHaveBeenCalled()
})

test('jest - runs jest tool', async () => {
  await add('jest')

  expect(jestFn).toHaveBeenCalled()
})

test('prettier - runs prettier tool', async () => {
  await add('prettier')

  expect(prettierrc).toHaveBeenCalled()
})

test('config - creates config files', async () => {
  await add('config')

  expect(config).toHaveBeenCalled()
})

test('husky - setup', async () => {
  await add('husky')

  expect(husky).toHaveBeenCalled()
})

test('handles unknown command', async () => {
  await add('__not_valid__')

  expect(global.console.log).toHaveBeenCalledWith(
    '__not_valid__ is not a valid command'
  )
})
