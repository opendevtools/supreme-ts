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

export const config = async () => {
  await installPkg('@iteam/config')
  await create({
    templateName: 'config/config.json',
    output: 'config.json',
  })

  try {
    const libFolder = await folderExists('lib')

    if (libFolder.isDirectory()) {
      await create({
        templateName: 'config/config.js',
        output: 'lib/config.js',
      })

      return
    }
  } catch (e) {
    // Swallow errors
  }

  try {
    const srcFolder = await folderExists('src')

    if (srcFolder.isDirectory()) {
      await create({
        templateName: 'config/config.js',
        output: 'src/config.js',
      })

      return
    }
  } catch (e) {
    // Swallow errors
  }

  createFolder('src')

  await create({
    templateName: 'config/config.js',
    output: 'src/config.js',
  })
}

export const husky = async () => {
  await installPkg('husky')
  await installPkg('pretty-quick')

  await create({
    templateName: 'huskyrc',
    output: '.huskyrc',
  })
}
