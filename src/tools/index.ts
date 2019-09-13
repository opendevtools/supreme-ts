import { create, createFolder, folderExists, installPkg } from '../utils/file'
import execa from 'execa'

export const gitignore = async () => {
  await create({
    templateName: 'gitignore',
    output: '.gitignore',
  })
}

export const prettierrc = async () => {
  await installPkg('prettier')

  await create({
    templateName: 'prettierrc',
    output: '.prettierrc',
  })
}

export const jest = async () => {
  await installPkg('jest')
  await installPkg('jest-watch-typeahead')

  await create({
    templateName: 'jest.config',
    output: 'jest.config.js',
  })
}

export const nvmrc = async () => {
  const { stdout: nodeVersion } = await execa('node', ['-v'])

  await create({
    templateName: 'nvmrc',
    output: '.nvmrc',
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

export const husky = async () => {
  await installPkg('husky')
  await installPkg('pretty-quick')

  await create({
    templateName: 'huskyrc',
    output: '.huskyrc',
  })
}
