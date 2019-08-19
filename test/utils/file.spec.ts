import { create, hasPkg, overwrite, installPkg } from '../../src/utils/file'
import ejs from 'ejs'
import util from 'util'
import execa from 'execa'

jest.mock('ejs')
jest.mock('chalk', () => ({
  yellow: (param: string) => param,
  green: (param: string) => param,
  blue: (param: string) => param,
}))
jest.mock('fs')
jest.mock('util')
jest.mock('execa')

jest.spyOn(global.console, 'log').mockImplementation(() => {})
jest.spyOn(global.console, 'error').mockImplementation(() => {})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('#create', () => {
  let writeFile: jest.Mock

  beforeEach(() => {
    writeFile = jest.fn()
    util.promisify.mockReturnValue(writeFile)
  })

  test('renders template', async () => {
    await create('test', 'test.md')

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      {}
    )
  })

  test('renders template with data', async () => {
    await create('test', 'test.md', { test: 'test' })

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      { test: 'test' }
    )
  })

  test('creates a file', async () => {
    ejs.renderFile.mockResolvedValue('template')

    await create('test', 'test.md')

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('test'),
      'template',
      { flag: 'wx' }
    )
  })

  test('prints success message', async () => {
    ejs.renderFile.mockResolvedValue('template')

    await create('test', 'test.md')

    expect(global.console.log).toHaveBeenCalledWith('Created test.md')
  })

  test('errors when file exists', async () => {
    writeFile.mockRejectedValue({
      code: 'EEXIST',
    })

    await create('test', 'test.md')

    expect(global.console.error).toHaveBeenCalledWith(
      'File already exists test.md'
    )
  })

  test('handle any other errors', async () => {
    writeFile.mockRejectedValue({
      code: 'ERR',
    })

    await create('test', 'test.md')

    expect(global.console.error).toHaveBeenCalledWith('Something went wrong', {
      code: 'ERR',
    })
  })
})

describe('#overwrite', () => {
  let writeFile: jest.Mock

  beforeEach(() => {
    writeFile = jest.fn()
    util.promisify.mockReturnValue(writeFile)
  })

  test('renders template', async () => {
    await overwrite('test', 'test.md')

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      {}
    )
  })

  test('renders template with data', async () => {
    await overwrite('test', 'test.md', { test: 'test' })

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      { test: 'test' }
    )
  })

  test('overwrites a file', async () => {
    ejs.renderFile.mockResolvedValue('template')

    await overwrite('test', 'test.md')

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('test'),
      'template',
      { flag: 'w' }
    )
  })

  test('prints success message', async () => {
    ejs.renderFile.mockResolvedValue('template')

    await overwrite('test', 'test.md')

    expect(global.console.log).toHaveBeenCalledWith('Updated test.md')
  })

  test('handle any errors', async () => {
    writeFile.mockRejectedValue({
      code: 'ERR',
    })

    await overwrite('test', 'test.md')

    expect(global.console.error).toHaveBeenCalledWith('Something went wrong', {
      code: 'ERR',
    })
  })
})

describe('#hasPkg', () => {
  test('returns true if package.json contains dependency', () => {
    expect(
      hasPkg('test', { dependencies: { test: '0.1.0' }, devDependencies: {} })
    ).toBe(true)
  })

  test('returns true if package.json contains dev dependency', () => {
    expect(
      hasPkg('test', { dependencies: {}, devDependencies: { test: '0.1.0' } })
    ).toBe(true)
  })

  test('returns false if package.json does not contain either normal or dev dependency', () => {
    expect(hasPkg('test', { dependencies: {}, devDependencies: {} })).toBe(
      false
    )
  })

  test('returns false if no dependencies', () => {
    expect(hasPkg('test', {})).toBe(false)
  })
})

describe('#installPkg', () => {
  test('installs package if it does not already exist', async () => {
    await installPkg('test', {})

    expect(global.console.log).toHaveBeenCalledWith('Installing test')
    expect(execa).toHaveBeenCalledWith('npm', ['install', '--save-dev', 'test'])
  })

  test('does nothing if package is installed', async () => {
    await installPkg('jest', { dependencies: { jest: '0.1.0' } })

    expect(global.console.log).not.toHaveBeenCalledWith('Installing test')
    expect(execa).not.toHaveBeenCalledWith('npm', [
      'install',
      '--save-dev',
      'test',
    ])
  })
})
