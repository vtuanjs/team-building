const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const allowAccessIP = '*'
const nodemailer = require('nodemailer')
const sendEmail = async (receiverEmail, secretKey) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        })
        let mailOptions = {
            from: 'Nguyen Van Tuan: <dr7@amavi.asia>',
            to: receiverEmail,
            subject: 'Active email',
            html: `<h1>Please click here to acctive your account</h1> http://${HOST}:${PORT}/users/activateUser?secretKey=${secretKey}&email=${receiverEmail}`
        }
        let info = transporter.sendMail(mailOptions)
        console.log(`Message send : ${info.messageId}`)
    } catch (error) {
        throw error
    }
}

module.exports = { PORT, HOST, sendEmail, allowAccessIP }
