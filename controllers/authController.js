const db = require("../config/db")
const jwt = require("jsonwebtoken")
const { generateUsername, generatePassword } = require("../utils/generator")
const { sendMail } = require("../config/mail")

exports.signup = (req, res) => {

const { first_name, last_name, email, contact, country, state, account_type } = req.body

const username = generateUsername(first_name)

const password = generatePassword()

const sql = `INSERT INTO users
(first_name,last_name,username,email,password,contact,country,state,account_type)
VALUES (?,?,?,?,?,?,?,?,?)`

db.query(sql, [first_name, last_name, username, email, password, contact, country, state, account_type], async (err, result) => {

if (err) {
return res.json({ message: "Signup error", error: err })
}

const userMessage = `
Hello ${first_name}

Your account created successfully

Username: ${username}
Password: ${password}
`

const adminMessage=`

New user registered

Name: ${first_name} ${last_name}
Email: ${email}
Username: ${username}
Password: ${password}

`

try {

// user ko mail
await sendMail(email, "Account Created", userMessage)

// admin ko mail
await sendMail("adminkashish@yopmail.com", "New User Registered", adminMessage)

} catch (error) {
console.log("Mail Error:", error)
}

res.json({
message: "Signup successful",
username,
password
})

})

}


exports.login = (req, res) => {

const { username, password } = req.body

const sql = "SELECT * FROM users WHERE username=? AND password=?"

db.query(sql, [username, password], (err, result) => {

if (err) {
return res.json({ message: "Login error" })
}

if (result.length === 0) {
return res.json({ message: "Invalid credentials" })
}

const user = result[0]

const token = jwt.sign(
{ id: user.id, username: user.username, role: user.role },
process.env.JWT_SECRET,
{ expiresIn: "1h" }
)

res.json({
message: "Login successful",
token: token,
user: user
})

})

}