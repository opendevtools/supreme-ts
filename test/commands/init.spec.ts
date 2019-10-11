import { init } from '../../src/commands/init'
import {
  config,
  gitignore,
  jest as jestCreate,
  prettierrc,
  nvmrc,
  husky,
  eslint,
} from '../../src/tools'

jest.mock('../../src/tools')

const props = {
  flags: {},
}

describe('#init', () => {
  test('should create config with typescript', async () => {
    await init(props)

    expect(config).toHaveBeenCalledWith({ javascript: false })
  })

  test('should create config with javascript', async () => {
    await init({ flags: { javascript: true } })

    expect(config).toHaveBeenCalledWith({ javascript: true })
  })

  test('should create gitignore', async () => {
    await init(props)

    expect(gitignore).toHaveBeenCalled()
  })

  test('should install prettier', async () => {
    await init(props)

    expect(prettierrc).toHaveBeenCalled()
  })

  test('should install jest', async () => {
    await init(props)

    expect(jestCreate).toHaveBeenCalled()
  })

  test('should create nvmrc', async () => {
    await init(props)

    expect(nvmrc).toHaveBeenCalled()
  })

  test('should init husky', async () => {
    await init(props)

    expect(husky).toHaveBeenCalled()
  })

  test('should init eslint', async () => {
    await init({ flags: { node: true } })

    expect(eslint).toHaveBeenCalledWith({ node: true })
  })
})
