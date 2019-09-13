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

test('nvm - runs nvmrc tool', () => {
  add({ command: 'nvm', flags: { javascript: false } })

  expect(nvmrc).toHaveBeenCalled()
})

test('nvmrc - runs nvmrc tool', () => {
  add({ command: 'nvmrc', flags: { javascript: false } })

  expect(nvmrc).toHaveBeenCalled()
})

test('git - runs gitignore tool', () => {
  add({ command: 'git', flags: { javascript: false } })

  expect(gitignore).toHaveBeenCalled()
})

test('gitignore - runs gitignore tool', () => {
  add({ command: 'gitignore', flags: { javascript: false } })

  expect(gitignore).toHaveBeenCalled()
})

test('jest - runs jest tool', () => {
  add({ command: 'jest', flags: { javascript: false } })

  expect(jestFn).toHaveBeenCalled()
})

test('prettier - runs prettier tool', () => {
  add({ command: 'prettier', flags: { javascript: false } })

  expect(prettierrc).toHaveBeenCalled()
})

test('config - creates config files', () => {
  add({ command: 'config', flags: { javascript: false } })

  expect(config).toHaveBeenCalledWith({ javascript: false })
})

test('husky - setup', () => {
  add({ command: 'husky', flags: { javascript: false } })

  expect(husky).toHaveBeenCalled()
})

test('handles unknown command', () => {
  add({ command: '__not_valid__', flags: { javascript: false } })

  expect(global.console.log).toHaveBeenCalledWith(
    '__not_valid__ is not a valid command'
  )
})
