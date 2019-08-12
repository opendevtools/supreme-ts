import { reason } from '../../src/commands/reason'
import execa from 'execa'
import { create, overwrite } from '../../src/utils/file'

jest.mock('execa')
jest.mock('../../src/utils/file')

jest.spyOn(global.console, 'log').mockImplementation(() => {})

test('creates bucklescript app', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith(
    'bsb -init test -theme react-hooks'
  )
})

test('overwrites base files', async () => {
  await reason({ name: 'test', flags: {} })

  expect(overwrite).toHaveBeenCalledWith(
    'reason/package.json',
    'test/package.json',
    {
      name: 'test',
    }
  )
  expect(overwrite).toHaveBeenCalledWith(
    'reason/bsconfig.json',
    'test/bsconfig.json',
    {
      name: 'test',
    }
  )
  expect(overwrite).toHaveBeenCalledWith(
    'reason/webpack.config.js',
    'test/webpack.config.js'
  )
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

  expect(create).toHaveBeenCalledWith(
    'reason/postcss.config.js',
    'test/postcss.config.js'
  )
  expect(create).toHaveBeenCalledWith('reason/index.css', 'test/src/index.css')
  expect(create).toHaveBeenCalledWith('reason/index.js', 'test/src/index.js')
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

  expect(overwrite).toHaveBeenCalledWith(
    'reason/index.html',
    'test/public/index.html',
    {
      name: 'test',
    }
  )
})

test('replace default components', async () => {
  await reason({ name: 'test', flags: {} })

  expect(execa.command).toHaveBeenCalledWith('rm Component1.re', {
    cwd: expect.stringMatching(/test/),
  })
  expect(execa.command).toHaveBeenCalledWith('rm Component2.re', {
    cwd: expect.stringMatching(/test/),
  })

  expect(overwrite).toHaveBeenCalledWith('reason/Index.re', 'test/src/Index.re')
  expect(create).toHaveBeenCalledWith('reason/App.re', 'test/src/App.re')
})
