var { snackizeKeys } = require('./convert');

module.exports = {
  notAllow: res => {
    res.status(403).send({
      success: false,
      message: "You are not allowed.",
      data: null
    });
  },
  empty: (res, mess, option = {}) => {
    return res.status(204).send({
      success: true,
      message: mess,
      data: null,
      option
    })
  },
  errorProcess: (res, err) => {
    return res.status(500).send({
      success: false,
      message: `Error during proccess ${err.message}`,
      data: null,
    })
  },
  success: (res, mess, data, option = {}) => {
    return res.json({
      success: true,
      message: mess,
      data: snackizeKeys(data),
      option
    })
  },
  errorWithMess: (res, mess) => {
    return res.status(500).send({
      success: false,
      message: mess,
      data: null
    })
  },
  successWithNoData: (res, mess, option = {}) => {
    return res.json({
      success: true,
      message: mess,
      data: null,
      option
    })
  },
  redirectLogin: (res) => {
    return res.redirect('/users/login')
  }
}