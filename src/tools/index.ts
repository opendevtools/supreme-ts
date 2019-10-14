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
    const libFolder = folderExists('lib')

    if (libFolder && javascript) {
      await create({
        templateName: 'config/config.js',
        output: 'lib/config.js',
      })

      return
    }

    if (libFolder && !javascript) {
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
    const srcFolder = folderExists('src')

    if (srcFolder && javascript) {
      await create({
        templateName: 'config/config.js',
        output: 'src/config.js',
      })

      return
    }

    if (srcFolder && !javascript) {
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

interface EslintFlags extends ToolProps {
  node?: boolean
  react?: boolean
}

export const eslint = async (options: EslintFlags = {}) => {
  await installPkg('eslint', options)

  if (options.node) {
    await installPkg('@iteam/eslint-config-node', options)

    await create({
      templateName: 'eslint/eslintrc.node',
      output: options.cwd ? `${options.cwd}/.eslintrc` : '.eslintrc',
    })
  }

  if (options.react) {
    await installPkg('@iteam/eslint-config-react', options)
    await installPkg('@typescript-eslint/eslint-plugin', options)

    await create({
      templateName: 'eslint/eslintrc.react',
      output: options.cwd ? `${options.cwd}/.eslintrc` : '.eslintrc',
    })
  }
}
