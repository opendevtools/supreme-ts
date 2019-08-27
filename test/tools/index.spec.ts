import { gitignore, prettierrc, jest as jestFn, nvmrc } from '../../src/tools'
import { create, installPkg } from '../../src/utils/file'
import execa from 'execa'

jest.mock('../../src/utils/file')
jest.mock('execa')

describe('#gitignore', () => {
  test('creates a gitignore file', () => {
    gitignore()

    expect(create).toHaveBeenCalledWith({
      templateName: 'gitignore',
      output: '.gitignore',
    })
  })
})

describe('#prettierrc', () => {
  test('installs prettier', () => {
    prettierrc()

    expect(installPkg).toHaveBeenCalledWith('prettier')
  })

  test('creates a prettier config', () => {
    prettierrc()

    expect(create).toHaveBeenCalledWith({
      templateName: 'prettierrc',
      output: '.prettierrc',
    })
  })
})

describe('#jest', () => {
  test('installs jest', () => {
    jestFn()

    expect(installPkg).toHaveBeenCalledWith('jest')
  })

  test('installs jest typeahead', () => {
    jestFn()

    expect(installPkg).toHaveBeenCalledWith('jest-watch-typeahead')
  })

  test('creates a jest config', () => {
    jestFn()

    expect(create).toHaveBeenCalledWith({
      templateName: 'jest.config',
      output: 'jest.config.js',
    })
  })
})

describe('#nvmrc', () => {
  test('gets current node version', async () => {
    ;((execa as unknown) as jest.Mock).mockResolvedValue({
      stdout: 'v4.2.0',
    })

    await nvmrc()

    expect(execa).toHaveBeenCalledWith('node', ['-v'])
  })

  test('creates a nvmrc with current node version', async () => {
    ;((execa as unknown) as jest.Mock).mockResolvedValue({
      stdout: 'v4.2.0',
    })

    await nvmrc()

    expect(create).toHaveBeenCalledWith({
      templateName: 'nvmrc',
      output: '.nvmrc',
      templateData: {
        nodeVersion: 'v4.2.0',
      },
    })
  })
})
