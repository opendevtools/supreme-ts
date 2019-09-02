import { reason } from '../../src/commands/reason'
import execa from 'execa'
import ora from 'ora'
import { create, overwrite } from '../../src/utils/file'

jest.mock('execa')
jest.mock('chalk', () => ({
  blue: (param: string) => param,
  green: (param: string) => param,
}))
jest.mock('ora', () =>
  jest.fn(({ text }) => ({
    start: jest.fn().mockReturnValue({ text, stop: jest.fn() }),
  }))
)
jest.mock('../../src/utils/file')

jest.spyOn(global.console, 'log').mockImplementation(() => {})

test('should setup a spinner', async () => {
  await reason({ name: 'test', flags: {} })

  expect(ora).toHaveBeenCalledWith({
    text: 'Creating folder',
    color: 'blue',
  })
})

test('creates bucklescript app', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith(
    'bsb -init test -theme react-hooks'
  )
})

test('creates bucklescript app using default name', async () => {
  await reason({ flags: {} })

  expect(execa.command).toHaveBeenCalledWith(
    'bsb -init supreme-reason -theme react-hooks'
  )
})

test('overwrites base files', async () => {
  await reason({ name: 'test', flags: {} })

  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'reason/package.json',
    output: 'test/package.json',
    templateData: {
      name: 'test',
    },
  })
  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'reason/bsconfig.json',
    output: 'test/bsconfig.json',
    templateData: {
      name: 'test',
    },
  })
  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'reason/webpack.config.js',
    output: 'test/webpack.config.js',
  })
})

test('should setup git', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('git init', {
    cwd: expect.stringMatching(/test/),
  })

  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'reason/gitignore',
    output: 'test/.gitignore',
  })
})

test('installs app dependencies', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('npm install --silent', {
    cwd: expect.stringMatching(/test/),
  })
})

test('setup for tailwind', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa).toHaveBeenCalledWith('npx', ['tailwind', 'init'], {
    cwd: expect.stringMatching(/test/),
  })
})

test('create tailwind config', async () => {
  await reason({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'reason/postcss.config.js',
    output: 'test/postcss.config.js',
  })
  expect(create).toHaveBeenCalledWith({
    templateName: 'reason/index.css',
    output: 'test/src/index.css',
  })
  expect(create).toHaveBeenCalledWith({
    templateName: 'reason/index.js',
    output: 'test/src/index.js',
  })
})

test('creates releaserc for semantic release', async () => {
  await reason({ name: 'test', flags: {} })

  expect(create).toHaveBeenCalledWith({
    templateName: 'reason/releaserc',
    output: 'test/.releaserc',
  })
})

test('move and replace index.html', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('mkdir public', {
    cwd: expect.stringMatching(/test/),
  })
  expect(execa).toHaveBeenCalledWith(
    'mv',
    ['src/index.html', 'public/index.html'],
    {
      cwd: expect.stringMatching(/test/),
    }
  )

  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'reason/index.html',
    output: 'test/public/index.html',
    templateData: {
      name: 'test',
    },
  })
})

test('replace default components', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('rm Component1.re', {
    cwd: expect.stringMatching(/test/),
  })
  expect(execa.command).toHaveBeenCalledWith('rm Component2.re', {
    cwd: expect.stringMatching(/test/),
  })

  expect(overwrite).toHaveBeenCalledWith({
    templateName: 'reason/Index.re',
    output: 'test/src/Index.re',
  })
  expect(create).toHaveBeenCalledWith({
    templateName: 'reason/App.re',
    output: 'test/src/App.re',
  })
})
