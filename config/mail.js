require("dotenv").config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASS
}
})

const sendMail = (to, subject, text) => {
return transporter.sendMail({
from: process.env.MAIL_USER,
to: to,
subject: subject,
text: text
})
}

module.exports = { sendMail }