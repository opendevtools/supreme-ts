import { gitignore, prettierrc, jest as jestFn, nvmrc } from '../../src/tools'
import { create, pkg } from '../../src/utils/file'
import execa from 'execa'

jest.mock('../../src/utils/file')
jest.mock('execa')

describe('#gitignore', () => {
  test('creates a gitignore file', () => {
    gitignore()

    expect(create).toHaveBeenCalledWith('gitignore', '.gitignore')
  })
})

describe('#prettierrc', () => {
  test('installs prettier', () => {
    prettierrc()

    expect(pkg).toHaveBeenCalledWith('prettier')
  })

  test('creates a prettier config', () => {
    prettierrc()

    expect(create).toHaveBeenCalledWith('prettierrc', '.prettierrc')
  })
})

describe('#jest', () => {
  test('installs jest', () => {
    jestFn()

    expect(pkg).toHaveBeenCalledWith('jest')
  })

  test('installs jest typeahead', () => {
    jestFn()

    expect(pkg).toHaveBeenCalledWith('jest-watch-typeahead')
  })

  test('creates a jest config', () => {
    jestFn()

    expect(create).toHaveBeenCalledWith('jest.config', 'jest.config.js')
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

    expect(create).toHaveBeenCalledWith('nvmrc', '.nvmrc', {
      nodeVersion: 'v4.2.0',
    })
  })
})
