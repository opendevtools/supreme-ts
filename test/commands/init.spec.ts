import { init } from '../../src/commands/init'
import {
  gitignore,
  jest as jestCreate,
  prettierrc,
  nvmrc,
} from '../../src/tools'

jest.mock('../../src/tools')

describe('#init', () => {
  test('should create gitignore', () => {
    init()

    expect(gitignore).toHaveBeenCalled()
  })

  test('should install prettier', () => {
    init()

    expect(prettierrc).toHaveBeenCalled()
  })

  test('should install jest', () => {
    init()

    expect(jestCreate).toHaveBeenCalled()
  })

  test('should create nvmrc', () => {
    init()

    expect(nvmrc).toHaveBeenCalled()
  })
})
