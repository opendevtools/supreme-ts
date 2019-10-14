import {
  gitignore,
  prettierrc,
  jest as jestFn,
  nvmrc,
  config,
  husky,
  eslint,
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

    expect(installPkg).toHaveBeenCalledWith('prettier', {})
  })

  test('creates a prettier config', async () => {
    await prettierrc()

    expect(create).toHaveBeenCalledWith({
      templateName: 'prettierrc',
      output: '.prettierrc',
    })
  })

  test('creates a prettier config in subfolder', async () => {
    await prettierrc({ cwd: 'test' })

    expect(create).toHaveBeenCalledWith({
      templateName: 'prettierrc',
      output: 'test/.prettierrc',
    })
  })
})

describe('#jest', () => {
  test('installs jest', async () => {
    await jestFn({ cwd: 'test' })

    expect(installPkg).toHaveBeenCalledWith('jest', { cwd: 'test' })
  })

  test('installs jest typeahead', async () => {
    await jestFn({ cwd: 'test' })

    expect(installPkg).toHaveBeenCalledWith('jest-watch-typeahead', {
      cwd: 'test',
    })
  })

  test('creates a jest config', async () => {
    await jestFn()

    expect(create).toHaveBeenCalledWith({
      templateName: 'jest.config',
      output: 'jest.config.js',
    })
  })

  test('creates a jest config in subfolder', async () => {
    await jestFn({ cwd: 'test' })

    expect(create).toHaveBeenCalledWith({
      templateName: 'jest.config',
      output: 'test/jest.config.js',
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

  test('creates a nvmrc with current node version in sub folder', async () => {
    ;((execa as unknown) as jest.Mock).mockResolvedValue({
      stdout: 'v4.2.0',
    })

    await nvmrc({ cwd: 'test' })

    expect(create).toHaveBeenCalledWith({
      templateName: 'nvmrc',
      output: 'test/.nvmrc',
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
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)

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
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

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
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

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
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)

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

  test('if neither lib nor src exists, create src and src/config.js for typescript', async () => {
    ;(folderExists as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)

    await config({ javascript: false })

    expect(createFolder).toHaveBeenCalledWith('src')
    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.ts',
      output: 'src/config.ts',
    })
    expect(create).not.toHaveBeenCalledWith({
      templateName: 'config/config.js',
      output: 'src/config.js',
    })
  })

  test('creates a config override file', async () => {
    ;(folderExists as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)

    await config({ javascript: false })

    expect(create).toHaveBeenCalledWith({
      templateName: 'config/config.json',
      output: 'config.json',
    })
  })
})

describe('#husky', () => {
  test('installs husky', async () => {
    await husky({ cwd: 'test' })

    expect(installPkg).toHaveBeenCalledWith('husky', { cwd: 'test' })
  })

  test('installs pretty-quick', async () => {
    await husky({ cwd: 'test' })

    expect(installPkg).toHaveBeenCalledWith('pretty-quick', { cwd: 'test' })
  })

  test('creates a config', async () => {
    await husky()

    expect(create).toHaveBeenCalledWith({
      templateName: 'huskyrc',
      output: '.huskyrc',
    })
  })

  test('creates a config in a sub folder', async () => {
    await husky({ cwd: 'test' })

    expect(create).toHaveBeenCalledWith({
      templateName: 'huskyrc',
      output: 'test/.huskyrc',
    })
  })
})

describe('#eslint', () => {
  test('installs eslint', async () => {
    await eslint({ cwd: 'test' })

    expect(installPkg).toHaveBeenCalledWith('eslint', { cwd: 'test' })
  })

  test('install eslint without cwd', async () => {
    await eslint()

    expect(installPkg).toHaveBeenCalledWith('eslint', {})
  })

  describe('Node', () => {
    test('installs eslint node config', async () => {
      await eslint({ cwd: 'test', node: true })

      expect(installPkg).toHaveBeenCalledWith('@iteam/eslint-config-node', {
        cwd: 'test',
        node: true,
      })
    })

    test('creates a config', async () => {
      await eslint({ node: true })

      expect(create).toHaveBeenCalledWith({
        templateName: 'eslint/eslintrc.node',
        output: '.eslintrc',
      })
    })

    test('creates a config in a sub folder', async () => {
      await eslint({ cwd: 'test', node: true })

      expect(create).toHaveBeenCalledWith({
        templateName: 'eslint/eslintrc.node',
        output: 'test/.eslintrc',
      })
    })
  })

  describe('React', () => {
    test('installs eslint react config', async () => {
      await eslint({ cwd: 'test', react: true })

      expect(installPkg).toHaveBeenCalledWith('@iteam/eslint-config-react', {
        cwd: 'test',
        react: true,
      })
    })

    test('installs typescript eslint plugin', async () => {
      await eslint({ cwd: 'test', react: true })

      expect(installPkg).toHaveBeenCalledWith(
        '@typescript-eslint/eslint-plugin',
        {
          cwd: 'test',
          react: true,
        }
      )
    })

    test('creates a config', async () => {
      await eslint({ react: true })

      expect(create).toHaveBeenCalledWith({
        templateName: 'eslint/eslintrc.react',
        output: '.eslintrc',
      })
    })

    test('creates a config in a sub folder', async () => {
      await eslint({ cwd: 'test', react: true })

      expect(create).toHaveBeenCalledWith({
        templateName: 'eslint/eslintrc.react',
        output: 'test/.eslintrc',
      })
    })
  })
})
