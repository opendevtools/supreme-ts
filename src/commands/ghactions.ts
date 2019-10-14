import { create, createFolder, folderExists } from '../utils/file'
import chalk from 'chalk'

export const ghactions = async () => {
  const githubFolder = folderExists('.github')
  const workflowsFolder = folderExists('.github/workflows')

  if (!githubFolder) {
    await createFolder('.github')
  }

  if (!workflowsFolder) {
    await createFolder('.github/workflows')
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
