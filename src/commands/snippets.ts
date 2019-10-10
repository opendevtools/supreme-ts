import clipboardy from 'clipboardy'
import { readSnippet } from '../utils/file'

export type SnippetLanguage =
  | 'ts'
  | 'typescript'
  | 'reason'
  | 'reasonml'
  | 'js'
  | 'javascript'

export type SnippetIDE = 'vim'

interface SnippetsProps {
  language: SnippetLanguage
  ide: SnippetIDE
}

interface CopySnippetProps {
  template: string
  message: string
}

const copySnippet = async ({ template, message }: CopySnippetProps) => {
  const snippet = await readSnippet(template)
  clipboardy.writeSync(snippet)
  console.log(message)
}

const handleVim = async (language: SnippetLanguage) => {
  switch (language) {
    case 'js':
    case 'javascript':
      copySnippet({
        template: 'javascript.vim',
        message:
          'JavaScript snippets for VIM (UltiSnips) have been copied to the clipboard',
      })
      break

    case 'ts':
    case 'typescript':
      copySnippet({
        template: 'typescript.vim',
        message:
          'Typescript snippets for VIM (UltiSnips) have been copied to the clipboard',
      })
      break

    case 'reason':
    case 'reasonml':
      copySnippet({
        template: 'reason.vim',
        message:
          'ReasonML snippets for VIM (UltiSnips) have been copied to the clipboard',
      })
      break

    default:
      console.log(`I don't have any snippets for that language (${language})`)
  }
}

export const snippets = async ({ language, ide }: SnippetsProps) => {
  if (!ide) {
    console.log('--ide flag is missing')
    return
  }

  if (!language) {
    console.log('--language flag is missing')
    return
  }

  switch (ide) {
    case 'vim':
      handleVim(language)
      break
    default:
      console.log(`I don't have any snippets for that IDE (${ide})`)
  }
}
