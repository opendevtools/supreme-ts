import { init } from '../../src/commands/init'
import {
  config,
  gitignore,
  jest as jestCreate,
  prettierrc,
  nvmrc,
  husky,
} from '../../src/tools'

jest.mock('../../src/tools')

describe('#init', () => {
  test('should create config', async () => {
    await init()

    expect(config).toHaveBeenCalled()
  })

  test('should create gitignore', async () => {
    await init()

    expect(gitignore).toHaveBeenCalled()
  })

  test('should install prettier', async () => {
    await init()

    expect(prettierrc).toHaveBeenCalled()
  })

  test('should install jest', async () => {
    await init()

    expect(jestCreate).toHaveBeenCalled()
  })

  test('should create nvmrc', async () => {
    await init()

    expect(nvmrc).toHaveBeenCalled()
  })

  test('should init husky', async () => {
    await init()

    expect(husky).toHaveBeenCalled()
  })
})
