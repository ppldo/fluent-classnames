import ch from "../src/ch-cns"

const S = {
  root: 'r',
  active: 'a',
  someClass: 's'
}

describe("chain", () => {
  it("chains static", () => {
    expect(ch(S, s => s.root.active.someClass)).toBe('r a s')
  })
  it("chains condition true", () => {
    expect(ch(S, s => s.root.active(true).someClass)).toBe('r a s')
  })
  it("chains condition false", () => {
    expect(ch(S, s => s.root.active(false).someClass)).toBe('r s')
  })
  it("already terminated chain", () => {
    let r: any
    const t = ch(S, s => {
      r = s
      return s.root.active
    })
    expect(t).toBe('r a')
    expect(() => r.someClass).toThrowError('Using already terminated chain')
  })
  it("return chained object", () => {
    expect(() => ch(S, s => {
      s.root.active(false)
      return undefined as any
    })).toThrowError('Chaining function should always return chained object')
  })
})
