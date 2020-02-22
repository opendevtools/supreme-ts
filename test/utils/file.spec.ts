import {
  create,
  createFolder,
  folderExists,
  hasPkg,
  overwrite,
  installPkg,
} from '../../src/utils/file'
import ejs from 'ejs'
import util from 'util'
import execa from 'execa'
import readPkgUp from 'read-pkg-up'
import inquirer from 'inquirer'
import fs from 'fs'

jest.mock('ejs')
jest.mock('inquirer')
jest.mock('chalk', () => ({
  yellow: (param: string) => param,
  green: (param: string) => param,
  blue: (param: string) => param,
}))
jest.mock('fs')
jest.mock('util')
jest.mock('execa')
jest.mock('read-pkg-up')

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
    await create({ templateName: 'test', output: 'test.md' })

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      {}
    )
  })

  test('renders template with data', async () => {
    await create({
      templateName: 'test',
      output: 'test.md',
      templateData: { test: 'test' },
    })

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      { test: 'test' }
    )
  })

  test('creates a file', async () => {
    ejs.renderFile.mockResolvedValue('template')

    await create({ templateName: 'test', output: 'test.md' })

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('test'),
      'template',
      { flag: 'wx' }
    )
  })

  test('errors when file exists', async () => {
    writeFile.mockRejectedValue({
      code: 'EEXIST',
    })

    inquirer.prompt.mockResolvedValue({ isOverwrite: false })

    await create({ templateName: 'test', output: 'test.md' })

    expect(writeFile).not.toHaveBeenCalledWith(
      expect.stringContaining('test'),
      'template',
      { flag: 'w' }
    )
    expect(global.console.error).toHaveBeenCalledWith(
      'File already exists test.md'
    )
  })

  test('overwrites file if user requests it', async () => {
    writeFile.mockRejectedValue({
      code: 'EEXIST',
    })

    inquirer.prompt.mockResolvedValue({ isOverwrite: true })

    await create({ templateName: 'test', output: 'test.md' })

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('test'),
      'template',
      { flag: 'wx' }
    )
    expect(global.console.error).toHaveBeenCalledWith(
      'File already exists test.md'
    )
  })

  test('handle any other errors', async () => {
    writeFile.mockRejectedValue({
      code: 'ERR',
    })

    await create({ templateName: 'test', output: 'test.md' })

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
    await overwrite({ templateName: 'test', output: 'test.md' })

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      {}
    )
  })

  test('renders template with data', async () => {
    await overwrite({
      templateName: 'test',
      output: 'test.md',
      templateData: { test: 'test' },
    })

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test.ejs'),
      { test: 'test' }
    )
  })

  test('overwrites a file', async () => {
    ejs.renderFile.mockResolvedValue('template')

    await overwrite({ templateName: 'test', output: 'test.md' })

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('test'),
      'template',
      { flag: 'w' }
    )
  })

  test('handle any errors', async () => {
    writeFile.mockRejectedValue({
      code: 'ERR',
    })

    await overwrite({ templateName: 'test', output: 'test.md' })

    expect(global.console.error).toHaveBeenCalledWith('Something went wrong', {
      code: 'ERR',
    })
  })
})

describe('#createFolder', () => {
  let mkdir: jest.Mock

  beforeEach(() => {
    mkdir = jest.fn()
    util.promisify.mockReturnValue(mkdir)
  })

  test('creates a directory', async () => {
    await createFolder('/test/test')

    expect(mkdir).toHaveBeenCalledWith(expect.stringMatching(/test(\/|\\)test/))
  })

  test('handles errors', async () => {
    mkdir.mockRejectedValue('err')

    process.exit = jest.fn()

    await createFolder('/test/test')

    expect(process.exit).toHaveBeenCalledWith(1)
  })
})

describe('#folderExists', () => {
  test('checks if folder exists', async () => {
    await folderExists('/test/test')

    expect(fs.existsSync).toHaveBeenCalledWith(
      expect.stringMatching(/test(\/|\\)test/)
    )
  })
})

describe('#hasPkg', () => {
  test('returns true if package.json contains dependency', async () => {
    readPkgUp.mockReturnValue({
      packageJson: {
        dependencies: {
          test: '0.1.0',
        },
      },
    })

    await expect(hasPkg('test')).resolves.toBe(true)
  })

  test('returns true if package.json contains dev dependency', async () => {
    readPkgUp.mockReturnValue({
      packageJson: {
        devDependencies: {
          test: '0.1.0',
        },
      },
    })

    await expect(hasPkg('test')).resolves.toBe(true)
  })

  test('returns false if package.json does not contain either normal or dev dependency', async () => {
    readPkgUp.mockReturnValue({
      packageJson: {
        dependencies: {},
        devDependencies: {},
      },
    })

    await expect(hasPkg('test')).resolves.toBe(false)
  })

  test('returns false if no dependencies', async () => {
    readPkgUp.mockReturnValue(undefined)

    await expect(hasPkg('test')).resolves.toBe(false)
  })
})

describe('#installPkg', () => {
  test('installs package if it does not already exist', async () => {
    readPkgUp.mockReturnValue(undefined)

    await installPkg('jest')

    expect(global.console.log).toHaveBeenCalledWith('Installing jest')
    expect(execa.command).toHaveBeenCalledWith(
      'npm install --save-dev --save-exact jest',
      {}
    )
  })

  test('does nothing if package is installed', async () => {
    readPkgUp.mockReturnValue({
      packageJson: {
        devDependencies: {
          jest: '0.1.0',
        },
      },
    })

    await installPkg('jest')

    expect(global.console.log).not.toHaveBeenCalledWith('Installing jest')
    expect(execa.command).not.toHaveBeenCalledWith(
      'npm install --save-dev --save-exact jest',
      {}
    )
  })

  test('uses spinner for text if it exists', async () => {
    readPkgUp.mockReturnValue(undefined)

    const spinner = {}

    await installPkg('jest', { spinner })

    expect(global.console.log).not.toHaveBeenCalled()
    expect(spinner.text).toEqual('Installing jest')
  })

  test('handles sub folders', async () => {
    readPkgUp.mockReturnValue(undefined)

    await installPkg('jest', { cwd: 'test' })

    expect(global.console.log).toHaveBeenCalledWith('Installing jest')
    expect(execa.command).toHaveBeenCalledWith(
      'npm install --save-dev --save-exact jest',
      {
        cwd: expect.stringMatching(/test/),
      }
    )
  })
})
