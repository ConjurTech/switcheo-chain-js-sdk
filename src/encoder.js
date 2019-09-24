function sortObject(obj) {
  if (obj === null) return null
  if (typeof obj !== "object") return obj
  // arrays have typeof "object" in js!
  if (Array.isArray(obj))
    return obj.map(sortObject)
  const sortedKeys = Object.keys(obj).sort()
  const result = {}
  sortedKeys.forEach(key => {
    result[key] = sortObject(obj[key])
  })
  return result
}

function marshalJSON(json) {
  return Buffer.from(JSON.stringify(sortObject(json)))
}

module.exports = {
  marshalJSON,
}
