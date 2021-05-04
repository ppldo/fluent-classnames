const re = /\s+\w+\s+$/

const spc = ' '
const tab = '\t'
const nl = '\n'

/**
 * @param {string} str
 */
function proc(str, expr) {
  let res = ''
  let token = ''
  let space = false
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === spc || c === tab || c === nl) {
      if (!space) {
        if (token)
          token += ' '
        space = true
      }
    } else {
      if (space) {
        res += token
        token = c
        space = false
      }
      else
        token += c
    }
  }
  return res + (expr ? token : '')
}

assert(proc('', 1), '')
assert(proc('   ', 1), '')
assert(proc('   asd   ', 1), 'asd ')
assert(proc('   asd   ', 0), '')
assert(proc('   asd  as ', 1), 'asd as ')
assert(proc('   asd  as ', 0), 'asd ')

export function cltf(strings, ...exprs) {
  const last = strings.length - 1
  let res = ''
  for (let i = 0; i < last; i++) {
    const str = strings[i]
    res += ' ' + proc(str, exprs[i])
    // if (exprs[i]) {
    //   res += str
    // } else
    //   res += str.replace(re, '')

  }
  return res + ' ' + proc(strings[last], 1)
}

function assert(actual, expected) {
  if (actual !== expected)
    throw new Error(`Actual: '${actual}', expected: '${expected}'`)
}

assert(cltf`active simple`, ' active simple')

assert(cltf`active${1} simple   disabled   ${0}`, ' active simple  ')

assert(cltf`active${1} simple disabled${1}   `, ' active simple disabled ')
