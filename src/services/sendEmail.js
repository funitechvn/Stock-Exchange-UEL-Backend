var nodemailer = require('nodemailer');

module.exports = {
  /**
   * Hàm gửi mail
   * @param {String} sendTo Địa chỉ mail cần gửi tới
   * @param {String} subject Tiêu đề mail
   * @param {String} content Nội dung mail
   */
  Send: function (sendTo, subject, content) {
    var mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      // SMTPAuth: true,
      secure: true,
      auth: {
        user: 'noreplysystem@webdevstudios.org', // generated ethereal user
        pass: 'noReplySystemWDS_Pass123' // generated ethereal password
      }
    });
    mailOpts = {
      from: 'noreplysystem@webdevstudios.org',
      to: sendTo,
      subject: subject,
      generateTextFromHTML: true,
      text: content,
      html: content
    };
    smtpTrans.sendMail(mailOpts, (err, info) => {
      if (err) {
        console.log("Gui that bai", err);
      } else {
        console.log("Gui thanh cong");
      }
    });
  }
};
