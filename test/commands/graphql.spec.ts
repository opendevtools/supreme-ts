import { createFolder, create, overwrite } from '../../src/utils/file'
import ora from 'ora'
import { graphql } from '../../src/commands/graphql'
import execa from 'execa'
import { prettierrc, jest as jestFn, nvmrc, husky } from '../../src/tools'

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

  expect(prettierrc).toHaveBeenCalledWith({ cwd: 'test' })
  expect(jestFn).toHaveBeenCalledWith({ cwd: 'test' })
  expect(nvmrc).toHaveBeenCalledWith({ cwd: 'test' })
  expect(husky).toHaveBeenCalledWith({ cwd: 'test' })
})

test('should add tsconfig', async () => {
  await graphql({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/tsconfig.json',
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

test('should add generated types', async () => {
  await graphql({ name: 'test', flags: { examples: true } })

  expect(createFolder).toHaveBeenCalledWith('test/lib/__generated__')
  expect(create).toHaveBeenCalledWith({
    templateName: 'graphql/graphql.d.ts',
    output: 'test/lib/__generated__/graphql.d.ts',
  })
})
