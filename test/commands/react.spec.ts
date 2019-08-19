import { react } from '../../src/commands/react'
import execa from 'execa'
import chalk from 'chalk'

jest.mock('execa')
jest.mock('chalk', () => ({
  blue: param => param,
  green: param => param,
}))

jest.spyOn(global.console, 'log').mockImplementation(() => {})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('#react', () => {
  test('prints intro message', async () => {
    await react({ name: 'test', flags: {} })

    expect(global.console.log).toHaveBeenCalledWith('Creating app test')
  })

  test('handles creating inside folder', async () => {
    await react({ flags: {} })

    expect(global.console.log).toHaveBeenCalledWith('Creating app ')
    expect(execa).toHaveBeenCalledWith('npx', ['create-react-app', '.', ''])
    expect(global.console.log).toHaveBeenCalledWith('Created app ')
  })

  test('create a CRA app', async () => {
    await react({ name: 'test', flags: {} })

    expect(execa).toHaveBeenCalledWith('npx', ['create-react-app', 'test', ''])
  })

  test('create a typescript CRA app', async () => {
    await react({ name: 'test', flags: { typescript: true } })

    expect(execa).toHaveBeenCalledWith('npx', [
      'create-react-app',
      'test',
      '--typescript',
    ])
  })

  test('prints success message', async () => {
    await react({ name: 'test', flags: {} })

    expect(global.console.log).toHaveBeenCalledWith('Created app test')
  })
})
