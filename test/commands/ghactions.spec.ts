import { ghactions } from '../../src/commands/ghactions'
import { create, createFolder, folderExists } from '../../src/utils/file'

jest.mock('../../src/utils/file')

beforeEach(() => {
  jest.clearAllMocks()
  ;(folderExists as jest.Mock).mockResolvedValueOnce({
    isDirectory: jest.fn().mockReturnValue(false),
  })
})

test('should create workflows folders', async () => {
  await ghactions()

  expect(folderExists).toHaveBeenCalledWith('.github')
  expect(createFolder).toHaveBeenCalledWith('.github')
  expect(createFolder).toHaveBeenCalledWith('.github/workflows')
})

test('should not create folders if they exist', async () => {
  ;(folderExists as jest.Mock).mockReset()
  ;(folderExists as jest.Mock).mockResolvedValueOnce({
    isDirectory: jest.fn().mockReturnValue(true),
  })

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
