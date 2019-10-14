import { run } from '../src'
import { init } from '../src/commands/init'
import { react } from '../src/commands/react'
import { reason } from '../src/commands/reason'
import { add } from '../src/commands/add'
import { snippets } from '../src/commands/snippets'
import { graphql } from '../src/commands/graphql'
import { ghactions } from '../src/commands/ghactions'

jest.mock('chalk', () => ({
  blue: (param: string) => param,
  green: (param: string) => param,
  yellow: (param: string) => param,
  red: (param: string) => param,
  italic: {
    bgRed: (param: string) => param,
  },
}))
jest.mock('../src/commands/init')
jest.mock('../src/commands/react')
jest.mock('../src/commands/reason')
jest.mock('../src/commands/add')
jest.mock('../src/commands/snippets')
jest.mock('../src/commands/graphql')
jest.mock('../src/commands/ghactions')

jest.spyOn(global.console, 'log').mockImplementation(() => {})

test('handles init command', () => {
  run({ input: ['init'], flags: { javascript: false } })

  expect(init).toHaveBeenCalledWith({ flags: { javascript: false } })
})

test('handles init command with javascript', () => {
  run({ input: ['init'], flags: { javascript: true } })

  expect(init).toHaveBeenCalledWith({ flags: { javascript: true } })
})

test('handles react command', () => {
  run({ input: ['react', 'test'], flags: { typescript: true } })

  expect(react).toHaveBeenCalledWith({
    name: 'test',
    flags: { typescript: true },
  })
})

test('handles reason command', () => {
  run({ input: ['reason', 'test'], flags: {} })

  expect(reason).toHaveBeenCalledWith({ name: 'test', flags: {} })
})

test('handles add command', () => {
  run({ input: ['add', 'test'], flags: { javascript: false } })

  expect(add).toHaveBeenCalledWith({
    command: 'test',
    flags: { javascript: false },
  })
})

test('handles snippet command', () => {
  run({ input: ['snippets'], flags: { language: 'typescript', ide: 'vim' } })

  expect(snippets).toHaveBeenCalledWith({ language: 'typescript', ide: 'vim' })
})

test('handles graphql command', () => {
  run({ input: ['graphql', 'test'], flags: {} })

  expect(graphql).toHaveBeenCalledWith({ name: 'test', flags: {} })
})

test('handles github actions command', () => {
  run({ input: ['ghactions'], flags: {} })

  expect(ghactions).toHaveBeenCalled()
})

test('handles unknown command by displaying help', () => {
  run({ input: ['__not_valid__'], flags: {}, help: 'help' })

  expect(global.console.log).toHaveBeenCalledWith('help')
})
