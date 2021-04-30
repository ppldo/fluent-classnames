const re = /\s+\w+$/

export function cltf(strings, ...exprs) {
  const last = strings.length - 1
  let res = ''
  for (let i = 0; i < last; i++) {
    const str = strings[i]
    if (exprs[i]) {
      res += str
    } else
      res += str.replace(re, '')

  }
  return res + strings[last]
}

function assert(actual, expected) {
  if (actual !== expected)
    throw new Error(`Actual: '${actual}', expected: '${expected}`)
}

assert(cltf`active${1} simple    disabled${0}`, 'active simple')

assert(cltf`active${1} simple disabled${1} `, 'active simple disabled ')
