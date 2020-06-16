import { create, createFolder, folderExists, installPkg } from '../utils/file'
import chalk from 'chalk'
import { CLIFlags } from '../'

interface GhActionsProps {
  flags: CLIFlags
}

export const ghactions = async ({ flags }: GhActionsProps) => {
  const githubFolder = folderExists('.github')
  const workflowsFolder = folderExists('.github/workflows')

  installPkg('@semantic-release/changelog')
  installPkg('@semantic-release/git')

  if (!githubFolder) {
    await createFolder('.github')
  }

  if (!workflowsFolder) {
    await createFolder('.github/workflows')
  }

  if (flags.npm) {
    await create({
      templateName: 'ghactions/releaserc',
      output: '.releaserc',
    })
  } else {
    await create({
      templateName: 'ghactions/releaserc.nonpm',
      output: '.releaserc',
    })
  }

  await create({
    templateName: 'ghactions/pr_check.yml',
    output: '.github/workflows/pr_check.yml',
  })

  await create({
    templateName: 'ghactions/release.yml',
    output: '.github/workflows/release.yml',
  })

  console.log(`Added GitHub actions in ${chalk.green(`.github/workflows`)}`)
}
