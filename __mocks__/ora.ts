export default jest.fn(({ text }) => ({
  start: jest.fn().mockReturnValue({ text, stop: jest.fn() }),
}))
