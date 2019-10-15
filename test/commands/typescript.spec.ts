import execa from 'execa'
import { typescript } from '../../src/commands/typescript'
import {
  eslint,
  gitignore,
  husky,
  jest as jestFn,
  nvmrc,
  prettierrc,
} from '../../src/tools'
import { create, createFolder } from '../../src/utils/file'

jest.mock('execa')
jest.mock('../../src/utils/file')
jest.mock('../../src/tools')

jest.spyOn(global.console, 'log').mockImplementation(() => {})

afterEach(jest.clearAllMocks)

test('does nothing if no name is provided', async () => {
  await typescript({ flags: {} })

  expect(createFolder).not.toHaveBeenCalled()
})

test('creates project folder', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(createFolder).toHaveBeenCalledWith('test')
})

test('creates package.json', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'typescript/package.json',
    output: 'test/package.json',
    templateData: {
      name: 'test',
    },
  })
})

test('should install dependencies', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('npm install --silent', {
    cwd: expect.stringMatching(/test/),
  })
})

test('should use tools to create files', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(prettierrc).toHaveBeenCalledWith({
    cwd: 'test',
    spinner: expect.any(Object),
  })
  expect(jestFn).toHaveBeenCalledWith({
    cwd: 'test',
    spinner: expect.any(Object),
  })
  expect(nvmrc).toHaveBeenCalledWith({
    cwd: 'test',
    spinner: expect.any(Object),
  })
  expect(husky).toHaveBeenCalledWith({
    cwd: 'test',
    spinner: expect.any(Object),
  })
  expect(gitignore).toHaveBeenCalledWith({
    cwd: 'test',
    spinner: expect.any(Object),
  })
  expect(eslint).toHaveBeenCalledWith({
    cwd: 'test',
    node: true,
    spinner: expect.any(Object),
  })
})

test('creates lib folder', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(createFolder).toHaveBeenCalledWith('test/lib')
})

test('creates tsconfig', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'typescript/tsconfig.json',
    output: 'test/tsconfig.json',
  })
})

test('creates index.ts', async () => {
  await typescript({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'typescript/index.ts',
    output: 'test/lib/index.ts',
  })
})
