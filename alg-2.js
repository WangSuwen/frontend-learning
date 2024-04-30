// 郑翼的分治策略
function filterB(a, b) {
  return b.filter(c => c.items.some(it => a.includes(it)))
}

function splitAB(a, b) {
  const ret = []
  for (const bItem of b) {
    let retItem = ret.find(it => bItem.items.some(it1 => it.a.has(it1)))
    if (!retItem) {
      retItem = { a : new Set(), b : new Set() }
      ret.push(retItem)
    }
    retItem.b.add(bItem)
    bItem.items.forEach(bii => a.includes(bii) && retItem.a.add(bii))
    for (let i = 0; i < ret.length; i++) {
      const ri = ret[i]
      if (ri===retItem) continue
      if (Array.from(ri.a).some(it => retItem.a.has(it))) {
        ri.a.forEach(it => retItem.a.add(it))
        ri.b.forEach(it => retItem.b.add(it))
        ret.splice(i--, 1)
      }
    }
  }
  ret.forEach(it => {
    it.a = Array.from(it.a)
    it.b = Array.from(it.b)
  })
  return ret
}

function calc(a, b, dp = {}) {
  const dpKey = `${a.sort().join('_')}|${b.sort().join('_')}`
  if (dp[dpKey]) return dp[dpKey]
  dp[dpKey] = { value : Infinity, b }
  for (const bItem of b) {
    const theA  = a.filter(it => !bItem.items.includes(it))
    const theB  = b.filter(it => it!==bItem)
    const r     = theA.length===0 || theB.length===0 ? { value : 0, b : [] } : calc(theA, filterB(theA, theB), dp)
    const value = bItem.value+r.value
    if (value < dp[dpKey].value) dp[dpKey] = { value, b : [bItem, ...r.b] }
  }
  return dp[dpKey]
}

function alg(a, b) {
  const arr = splitAB(a, filterB(a, b))
  const ret = { value : 0, b : new Set() }
  const dp  = {}
  for (const item of arr) {
    const subResult = calc(item.a, item.b, dp)
    Object.keys(dp).forEach(key => delete dp[key])
    ret.value += subResult.value
    subResult.b.forEach(it => ret.b.add(it))
  }
  ret.b = Array.from(ret.b)
  return ret
}

exports.alg = alg

function test() {
  const a = [1,2,3,4,7,8,9]
  //const a = [2,3,4,5,6,8,9]
  //const a = [4,5,8,9]
  const b  = [
    { id : 'Z1', value : 3, items : [1] },
    { id : 'Z2', value : 5, items : [2] },
    { id : 'Z3', value : 4, items : [3] },
    { id : 'Z4', value : 5, items : [4] },
    { id : 'Z5', value : 8, items : [5] },
    { id : 'Z6', value : 6, items : [6] },
    { id : 'Z7', value : 15, items : [7] },
    { id : 'Z8', value : 15, items : [8] },
    { id : 'Z9', value : 15, items : [9] },
    { id : 'D', value : 10.5, items : [1, 2, 3] },
    { id : 'C', value : 6.5, items : [1, 3] },
    { id : 'B', value : 8, items : [2, 3] },
    { id : 'A', value : 7, items : [1, 2] },
    { id : 'E', value : 12, items : [4, 5] },
    { id : 'F', value : 12.5, items : [5, 6] },
    { id : 'G', value : 27, items : [7, 8] },
    { id : 'H', value : 17, items : [4, 5, 6] },
    //{ id : 'I', value : 40, items : [7, 8,9] },
  ]
  //b.sort((i,j)=>i.id<j.id?-1:1)
  console.log(JSON.stringify(alg(a, b), null, 2))
}

test()
