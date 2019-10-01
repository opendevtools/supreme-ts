import { create, createFolder, folderExists, installPkg } from '../utils/file'
import execa from 'execa'

interface ToolProps {
  cwd?: string
}

export const gitignore = async () => {
  await create({
    templateName: 'gitignore',
    output: '.gitignore',
  })
}

export const prettierrc = async (options: ToolProps = {}) => {
  await installPkg('prettier', options)

  await create({
    templateName: 'prettierrc',
    output: options.cwd ? `${options.cwd}/.prettierrc` : '.prettierrc',
  })
}

export const jest = async (options: ToolProps = {}) => {
  await installPkg('jest', options)
  await installPkg('jest-watch-typeahead', options)

  await create({
    templateName: 'jest.config',
    output: options.cwd ? `${options.cwd}/jest.config.js` : 'jest.config.js',
  })
}

export const nvmrc = async (options: ToolProps = {}) => {
  const { stdout: nodeVersion } = await execa('node', ['-v'])

  await create({
    templateName: 'nvmrc',
    output: options.cwd ? `${options.cwd}/.nvmrc` : '.nvmrc',
    templateData: { nodeVersion },
  })
}

interface ConfigProps {
  javascript: boolean
}

export const config = async ({ javascript }: ConfigProps) => {
  await installPkg('@iteam/config')
  await create({
    templateName: 'config/config.json',
    output: 'config.json',
  })

  try {
    const libFolder = await folderExists('lib')

    if (libFolder.isDirectory() && javascript) {
      await create({
        templateName: 'config/config.js',
        output: 'lib/config.js',
      })

      return
    }

    if (libFolder.isDirectory() && !javascript) {
      await create({
        templateName: 'config/config.ts',
        output: 'lib/config.ts',
      })

      return
    }
  } catch (e) {
    // Swallow errors
  }

  try {
    const srcFolder = await folderExists('src')

    if (srcFolder.isDirectory() && javascript) {
      await create({
        templateName: 'config/config.js',
        output: 'src/config.js',
      })

      return
    }

    if (srcFolder.isDirectory() && !javascript) {
      await create({
        templateName: 'config/config.ts',
        output: 'src/config.ts',
      })

      return
    }
  } catch (e) {
    // Swallow errors
  }

  createFolder('src')

  if (javascript) {
    await create({
      templateName: 'config/config.js',
      output: 'src/config.js',
    })
  }

  if (!javascript) {
    await create({
      templateName: 'config/config.ts',
      output: 'src/config.ts',
    })
  }
}

export const husky = async (options: ToolProps = {}) => {
  await installPkg('husky', options)
  await installPkg('pretty-quick', options)

  await create({
    templateName: 'huskyrc',
    output: options.cwd ? `${options.cwd}/.huskyrc` : '.huskyrc',
  })
}
