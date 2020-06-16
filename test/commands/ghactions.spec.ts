import { ghactions } from '../../src/commands/ghactions'
import {
  create,
  createFolder,
  folderExists,
  installPkg,
} from '../../src/utils/file'

jest.mock('../../src/utils/file')
jest.spyOn(global.console, 'log').mockImplementation(() => {})

let flags

beforeEach(() => {
  flags = {
    npm: true,
  }

  jest.clearAllMocks()
  ;(folderExists as jest.Mock)
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
})

test('should install dependencies', async () => {
  await ghactions({ flags })

  expect(installPkg).toHaveBeenCalledWith('@semantic-release/changelog')
  expect(installPkg).toHaveBeenCalledWith('@semantic-release/git')
})

test('should create workflows folders', async () => {
  await ghactions({ flags })

  expect(folderExists).toHaveBeenCalledWith('.github')
  expect(folderExists).toHaveBeenCalledWith('.github/workflows')

  expect(createFolder).toHaveBeenCalledWith('.github')
  expect(createFolder).toHaveBeenCalledWith('.github/workflows')
})

test('should not create folders if they exist', async () => {
  ;(folderExists as jest.Mock).mockReset()
  ;(folderExists as jest.Mock)
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)

  await ghactions({ flags })

  expect(createFolder).not.toHaveBeenCalled()
})

test('should create a .releaserc if npm flag is true', async () => {
  await ghactions({ flags })

  expect(create).toHaveBeenCalledWith({
    templateName: 'ghactions/releaserc',
    output: '.releaserc',
  })
})

test('should create a .releaserc without npm release if npm flag is false', async () => {
  flags.npm = false

  await ghactions({ flags })

  expect(create).toHaveBeenCalledWith({
    templateName: 'ghactions/releaserc.nonpm',
    output: '.releaserc',
  })
})

test('should create a PR check action', async () => {
  await ghactions({ flags })

  expect(create).toHaveBeenCalledWith({
    templateName: 'ghactions/pr_check.yml',
    output: '.github/workflows/pr_check.yml',
  })
})

test('should create a release action', async () => {
  await ghactions({ flags })

  expect(create).toHaveBeenCalledWith({
    templateName: 'ghactions/release.yml',
    output: '.github/workflows/release.yml',
    templateData: {
      npm: true,
    },
  })
})

test('should display a message', async () => {
  await ghactions({ flags })

  expect(global.console.log).toHaveBeenCalledWith(
    'Added GitHub actions in .github/workflows'
  )
})
