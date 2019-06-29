var SimpleCrypto = require("simple-crypto-js").default;
const key = require("./variables").key;

var simpleCrypto = new SimpleCrypto(key);

var crypt = (module.exports.crypt = data => {
  return simpleCrypto.encrypt(data);
});
var dcrypt = (module.exports.dcrypt = data => {
  return simpleCrypto.decrypt(data, true);
});
