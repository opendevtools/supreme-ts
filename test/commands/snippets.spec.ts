import { snippets } from '../../src/commands/snippets'
import clipboardy from 'clipboardy'
import ejs from 'ejs'

jest.mock('ejs')
jest.mock('clipboardy')
jest.spyOn(global.console, 'log').mockImplementation(() => {})

beforeEach(jest.resetAllMocks)

test('should handle undefined ide', async () => {
  await snippets({ language: 'typescript', ide: undefined })

  expect(global.console.log).toHaveBeenCalledWith('--ide flag is missing')
})

test('should handle undefined language', async () => {
  await snippets({ language: undefined, ide: 'vim' })

  expect(global.console.log).toHaveBeenCalledWith('--language flag is missing')
})

test('should handle vim and typescript snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('tssnippet')

  await snippets({ language: 'typescript', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'Typescript snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and typescript (ts) snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('tssnippet')

  await snippets({ language: 'ts', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'Typescript snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and reason snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('reasonsnippet')

  await snippets({ language: 'reason', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'ReasonML snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and reason (reasonml) snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('reasonsnippet')

  await snippets({ language: 'reasonml', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'ReasonML snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vscode and reason snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('reasonsnippet')

  await snippets({ language: 'reason', ide: 'vscode' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'ReasonML snippets for VSCode have been copied to the clipboard'
  )
})

test('should handle vscode and reason (reasonml) snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('reasonsnippet')

  await snippets({ language: 'reasonml', ide: 'vscode' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'ReasonML snippets for VSCode have been copied to the clipboard'
  )
})

test('should handle vim and javascript snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('javascriptsnippet')

  await snippets({ language: 'js', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'JavaScript snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should handle vim and javascript (javascript) snippets', async () => {
  ;(ejs as jest.Mock).renderFile.mockResolvedValue('javascriptsnippet')

  await snippets({ language: 'javascript', ide: 'vim' })

  expect((clipboardy.writeSync as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  expect(global.console.log).toHaveBeenCalledWith(
    'JavaScript snippets for VIM (UltiSnips) have been copied to the clipboard'
  )
})

test('should display error for unknown language', async () => {
  await snippets({ language: '__no_lang__', ide: 'vim' })

  expect(global.console.log).toHaveBeenCalledWith(
    "I don't have any snippets for that language (__no_lang__)"
  )
})

test('should display error for unknown language (vscode)', async () => {
  await snippets({ language: '__no_lang__', ide: 'vscode' })

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
