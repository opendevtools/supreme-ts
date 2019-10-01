import chalk from 'chalk'
import meow from 'meow'
import { react } from './commands/react'
import { add, Command } from './commands/add'
import { reason } from './commands/reason'
import { init } from './commands/init'
import { snippets, SnippetLanguage, SnippetIDE } from './commands/snippets'
import { graphql } from './commands/graphql'

export interface CLIFlags {
  javascript: boolean
  ide?: string
  language?: string
  examples?: boolean
}

export interface CLIProps {
  name?: string
  flags: CLIFlags
}

export const run = (cli: meow.Result) => {
  const { input, flags, help } = cli
  const [command, name] = input

  console.log(chalk.italic.bgRed(` SUPREME \n`))

  switch (command) {
    case 'init':
      init({ flags: flags as CLIFlags })
      break
    case 'react':
      react({ name, flags: flags as CLIFlags })
      break
    case 'reason':
      reason({ name, flags: flags as CLIFlags })
      break
    case 'add':
      add({ command: name as Command, flags: flags as CLIFlags })
      break
    case 'snippets':
      snippets({
        language: flags.language as SnippetLanguage,
        ide: flags.ide as SnippetIDE,
      })
      break
    case 'graphql':
      graphql({ name, flags: flags as CLIFlags })
      break
    default:
      console.log(help)
  }
}

const cli = meow(
  `
    Usage
    $ supreme [command]

    Commands
    $ init                      Create some configs and ignore files
    $ add <name>                Add a specific config
    $ react <name> [flags]      Creates a React app (CRA)
    $ reason <name>             Creates a ReasonReact app
    $ snippets [flags]          Copy snippets to clipboard
    $ graphql <name>            Create a GraphQL API

    Flags
    --javascript    JavaScript app (react)
    --ide           IDE for snippets (snippets) 
    --language      Language for snippets (snippets) 
    --examples      GraphQL examples (examples)
    `,
  {
    flags: {
      javascript: {
        type: 'boolean',
        default: false,
      },
      ide: {
        type: 'string',
      },
      language: {
        type: 'string',
      },
      examples: {
        type: 'boolean',
      },
    },
  }
)

run(cli)
