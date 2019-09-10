import { snippets } from '../../src/commands/snippets'
import clipboardy from 'clipboardy'

jest.mock('clipboardy')
jest.spyOn(global.console, 'log').mockImplementation(() => {})

beforeEach(jest.clearAllMocks)

test('should handle undefined ide', async () => {
  await snippets({ language: 'typescript', ide: undefined })

  expect(global.console.log).toHaveBeenCalledWith('--ide flag is missing')
})

test('should handle undefined language', async () => {
  await snippets({ language: undefined, ide: 'vim' })

  expect(global.console.log).toHaveBeenCalledWith('--language flag is missing')
})

test('should handle vim and typescript snippets', async () => {
  await snippets({ language: 'typescript', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'Typescript snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and typescript (ts) snippets', async () => {
  await snippets({ language: 'ts', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'Typescript snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and reason snippets', async () => {
  await snippets({ language: 'reason', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'ReasonML snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and reason (reasonml) snippets', async () => {
  await snippets({ language: 'reasonml', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'ReasonML snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should display error for unknown language', async () => {
  await snippets({ language: '__no_lang__', ide: 'vim' })

  expect(global.console.log).toHaveBeenCalledWith(
    "I don't have any snippets for that language (__no_lang__)"
  )
})

test('should display error for unknown IDE', async () => {
  await snippets({ language: 'typescript', ide: '__not_valid__' })

  expect(global.console.log).toHaveBeenCalledWith(
    "I don't have any snippets for that IDE (__not_valid__)"
  )
})
