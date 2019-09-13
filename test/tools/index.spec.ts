import {
  gitignore,
  prettierrc,
  jest as jestFn,
  nvmrc,
  config,
  husky,
} from '../../src/tools'
import {
  create,
  createFolder,
  folderExists,
  installPkg,
} from '../../src/utils/file'
import execa from 'execa'

jest.mock('../../src/utils/file')
jest.mock('execa')

beforeEach(jest.resetAllMocks)

describe('#gitignore', () => {
  test('creates a gitignore file', async () => {
    await gitignore()

    expect(create).toHaveBeenCalledWith({
      templateName: 'gitignore',
      output: '.gitignore',
    })
  })
})

describe('#prettierrc', () => {
  test('installs prettier', async () => {
    await prettierrc()

    expect(installPkg).toHaveBeenCalledWith('prettier')
  })

  test('creates a prettier config', async () => {
    await prettierrc()

    expect(create).toHaveBeenCalledWith({
      templateName: 'prettierrc',
      output: '.prettierrc',
    })
  })
})

describe('#jest', () => {
  test('installs jest', async () => {
    await jestFn()

    expect(installPkg).toHaveBeenCalledWith('jest')
  })

  test('installs jest typeahead', async () => {
    await jestFn()

    expect(installPkg).toHaveBeenCalledWith('jest-watch-typeahead')
  })

  test('creates a jest config', async () => {
    await jestFn()

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

describe('#config', () => {
  test('installs @iteam/config', async () => {
    ;(folderExists as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(true),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )
    await config({ javascript: false })

    expect(installPkg).toHaveBeenCalledWith('@iteam/config')
  })

  test('creates a config in lib folder', async () => {
    ;(folderExists as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(true),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )

    await config({ javascript: true })

    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'lib/config.js',
    })
    expect(create).not.toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'src/config.js',
    })
  })

  test('creates a typescript config in src folder', async () => {
    ;(folderExists as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(true),
        })
      )

    await config({ javascript: false })

    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.ts',
      output: 'src/config.ts',
    })
    expect(create).not.toHaveBeenCalledWith({
      templateName: 'config/config.ts',
      output: 'lib/config.ts',
    })
  })

  test('creates a javascript config in src folder', async () => {
    ;(folderExists as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(true),
        })
      )

    await config({ javascript: true })

    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'src/config.js',
    })
    expect(create).not.toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'lib/config.js',
    })
  })

  test('if neither lib nor src exists, create src and src/config.js', async () => {
    ;(folderExists as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )

    await config({ javascript: true })

    expect(createFolder).toHaveBeenCalledWith('src')
    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'src/config.js',
    })
    expect(create).not.toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'lib/config.js',
    })
  })

  test('creates a config override file', async () => {
    ;(folderExists as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(true),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          isDirectory: jest.fn().mockReturnValue(false),
        })
      )

    await config({ javascript: false })

    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.json',
      output: 'config.json',
    })
  })
})

describe('#husky', () => {
  test('installs husky', async () => {
    await husky()

    expect(installPkg).toHaveBeenCalledWith('husky')
  })

  test('installs pretty-quick', async () => {
    await husky()

    expect(installPkg).toHaveBeenCalledWith('pretty-quick')
  })

  test('creates a config', async () => {
    await husky()

    expect(create).toHaveBeenCalledWith({
      templateName: 'huskyrc',
      output: '.huskyrc',
    })
  })
})
