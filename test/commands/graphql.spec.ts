import {
  createFolder,
  create,
  overwrite,
  installPkg,
} from '../../src/utils/file'
import ora from 'ora'
import { graphql } from '../../src/commands/graphql'
import execa from 'execa'
import {
  prettierrc,
  jest as jestFn,
  nvmrc,
  husky,
  eslint,
} from '../../src/tools'

jest.mock('execa')
jest.mock('../../src/utils/file')
jest.mock('../../src/tools')

jest.spyOn(global.console, 'log').mockImplementation(() => {})

afterEach(jest.clearAllMocks)

test('should setup a spinner', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(ora).toHaveBeenCalledWith({
    text: 'Creating folder',
    color: 'blue',
  })
})

test('displays error if no name is provided', async () => {
  await graphql({ flags: {} })

  expect(createFolder).not.toHaveBeenCalled()
})

test('should create a project folder', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(createFolder).toHaveBeenCalledWith('test')
})

test('should setup git', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('git init', {
    cwd: expect.stringMatching(/test/),
  })

  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'graphql/gitignore',
    output: 'test/.gitignore',
  })
})

test('should add package.json', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/package.json',
    output: 'test/package.json',
    templateData: {
      name: 'test',
    },
  })
})

test('should install dependencies', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('npm install --silent', {
    cwd: expect.stringMatching(/test/),
  })
})

test('should use tools to create files', async () => {
  await graphql({ name: 'test', flags: {} })

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
  expect(eslint).toHaveBeenCalledWith({
    cwd: 'test',
    node: true,
    spinner: expect.any(Object),
  })
})

test('should add tsconfig', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'typescript/tsconfig.json',
    output: 'test/tsconfig.json',
  })
})

test('should add lib folder', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(createFolder).toHaveBeenCalledWith('test/lib')
})

test('should add server', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/server.ts',
    output: 'test/lib/server.ts',
  })
})

test('should add server with examples', async () => {
  await graphql({ name: 'test', flags: { examples: true } })

  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/serverExample.ts',
    output: 'test/lib/server.ts',
  })
})

test('should add resolvers with examples', async () => {
  await graphql({ name: 'test', flags: { examples: true } })

  expect(createFolder).toHaveBeenCalledWith('test/lib/resolvers')
  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/resolversExample.ts',
    output: 'test/lib/resolvers/queue.ts',
  })
})

test('should add generated types for examples', async () => {
  await graphql({ name: 'test', flags: { examples: true } })

  expect(createFolder).toHaveBeenCalledWith('test/lib/__generated__')
  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/graphqlExample.d.ts',
    output: 'test/lib/__generated__/graphql.d.ts',
  })
})

test('should add generated types', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(createFolder).toHaveBeenCalledWith('test/lib/__generated__')
  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/graphql.d.ts',
    output: 'test/lib/__generated__/graphql.d.ts',
  })
})

test('should add codegen configuration', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/codegen.yml',
    output: 'test/codegen.yml',
  })
})

describe('flags:auth', () => {
  test('should install additional dependencies', async () => {
    const name = 'test'
    await graphql({ name, flags: { auth: true } })

    expect(installPkg).toHaveBeenCalledWith(
      'graphql-directive-auth@0.3.2',
      expect.objectContaining({ cwd: name, dev: false })
    )
    expect(installPkg).toHaveBeenCalledWith(
      'graphql-tools@6.0.10',
      expect.objectContaining({ cwd: name, dev: false })
    )
  })

  test('should add generated types', async () => {
    await graphql({ name: 'test', flags: { auth: true } })

    expect(createFolder).toHaveBeenCalledWith('test/lib/__generated__')
    expect(create).toHaveBeenCalledWith({
      templateName: 'graphql/auth/graphql.d.ts',
      output: 'test/lib/__generated__/graphql.d.ts',
    })
  })

  test('should add server', async () => {
    await graphql({ name: 'test', flags: { auth: true } })

    expect(create).toHaveBeenCalledWith({
      templateName: 'graphql/auth/server.ts',
      output: 'test/lib/server.ts',
    })
  })

  test('should add global type declaration file', async () => {
    await graphql({ name: 'test', flags: { auth: true } })

    expect(create).toHaveBeenCalledWith({
      templateName: 'graphql/auth/index.d.ts',
      output: 'test/index.d.ts',
    })
  })

  test('should add tsconfig', async () => {
    await graphql({ name: 'test', flags: { auth: true } })

    expect(create).toHaveBeenCalledWith({
      templateName: 'graphql/auth/tsconfig.json',
      output: 'test/tsconfig.json',
    })
  })
})
