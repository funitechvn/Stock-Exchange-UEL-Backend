var { camelCase, snakeCase, isEmpty } = require('lodash');

camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } else if (!isEmpty(obj) && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
},

snackizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => snackizeKeys(v));
  } else if (!isEmpty(obj) && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeCase(key)]: snackizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
}

module.exports = {
  camelizeKeys,
  snackizeKeys
}