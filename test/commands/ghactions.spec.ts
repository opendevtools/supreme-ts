import { ghactions } from '../../src/commands/ghactions'
import { create, createFolder, folderExists } from '../../src/utils/file'

jest.mock('../../src/utils/file')
jest.spyOn(global.console, 'log').mockImplementation(() => {})

beforeEach(() => {
  jest.clearAllMocks()
  ;(folderExists as jest.Mock)
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
})

test('should create workflows folders', async () => {
  await ghactions()

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

  await ghactions()

  expect(createFolder).not.toHaveBeenCalled()
})

test('should create a PR check action', async () => {
  await ghactions()

  expect(create).toHaveBeenCalledWith({
    templateName: 'ghactions/pr_check.yml',
    output: '.github/workflows/pr_check.yml',
  })
})

test('should create a release action', async () => {
  await ghactions()

  expect(create).toHaveBeenCalledWith({
    templateName: 'ghactions/release.yml',
    output: '.github/workflows/release.yml',
  })
})

test('should display a message', async () => {
  await ghactions()

  expect(global.console.log).toHaveBeenCalledWith(
    'Added GitHub actions in .github/workflows'
  )
})
