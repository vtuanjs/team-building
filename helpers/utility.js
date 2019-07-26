const PORT = 3000
const HOST = 'localhost'
const allowAccessIP = '*'
const nodemailer = require('nodemailer')
const sendEmail = async (receiverEmail, secretKey) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dr7@amavi.asia',
                pass: '12345678'
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
