import { react } from '../../src/commands/react'
import execa from 'execa'

jest.mock('execa')
jest.mock('chalk', () => ({
  blue: (param: string) => param,
  green: (param: string) => param,
}))

jest.spyOn(global.console, 'log').mockImplementation(() => {})

beforeEach(jest.clearAllMocks)

describe('#react', () => {
  test('prints intro message', async () => {
    await react({ name: 'test', flags: {} })

    expect(global.console.log).toHaveBeenCalledWith('Creating app test')
  })

  test('handles creating inside folder', async () => {
    await react({ flags: {} })

    expect(global.console.log).toHaveBeenCalledWith('Creating app ')
    expect(execa).toHaveBeenCalledWith('npx', [
      'create-react-app',
      '.',
      '--typescript',
    ])
    expect(global.console.log).toHaveBeenCalledWith('Created app ')
  })

  test('create a CRA app', async () => {
    await react({ name: 'test', flags: {} })

    expect(execa).toHaveBeenCalledWith('npx', [
      'create-react-app',
      'test',
      '--typescript',
    ])
  })

  test('create a javascript CRA app', async () => {
    await react({ name: 'test', flags: { javascript: true } })

    expect(execa).toHaveBeenCalledWith('npx', ['create-react-app', 'test', ''])
  })

  test('prints success message', async () => {
    await react({ name: 'test', flags: {} })

    expect(global.console.log).toHaveBeenCalledWith('Created app test')
  })
})
