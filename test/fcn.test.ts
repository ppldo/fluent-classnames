import { fcn } from "../src/fcn"

const S = {
  root: 'r',
  active: 'a',
  someClass: 's'
}

describe("fluent", () => {
  it("fluent static", () => {
    expect(fcn(S, s => s.root.active.someClass)).toBe('r a s')
  })
  it("fluent condition true", () => {
    expect(fcn(S, s => s.root.active(true).someClass)).toBe('r a s')
  })
  it("fluent condition false", () => {
    expect(fcn(S, s => s.root.active(false).someClass)).toBe('r s')
  })
  it("already terminated fluent object", () => {
    let r: any
    const t = fcn(S, s => {
      r = s
      return s.root.active
    })
    expect(t).toBe('r a')
    expect(() => r.someClass).toThrowError('Using already terminated fluent object')
  })
  it("return fluent object", () => {
    expect(() => fcn(S, s => {
      s.root.active(false)
      return undefined as any
    })).toThrowError('Selector function should always return fluent object')
  })
})
