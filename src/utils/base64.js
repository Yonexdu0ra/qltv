function encodeBase64(str) {
  return Buffer.from(encodeURIComponent(str), "utf-8").toString("base64")
}



module.exports = encodeBase64;