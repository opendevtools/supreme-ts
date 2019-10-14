import { create, createFolder, folderExists } from '../utils/file'

export const ghactions = async () => {
  const workflowsFolder = await folderExists('.github')

  if (!workflowsFolder.isDirectory()) {
    await createFolder('.github')
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
}
