const jwt = require("jsonwebtoken")

exports.verifyToken = (req, res, next) => {

const authHeader = req.headers["authorization"]

if (!authHeader) {
return res.json({ message: "Token required" })
}

try {

// Bearer TOKEN format handle
const token = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader

const decoded = jwt.verify(token, process.env.JWT_SECRET)

req.user = decoded

next()

} catch (error) {

return res.json({ message: "Invalid token" })

}

}


exports.checkAdmin = (req, res, next) => {

if (!req.user || req.user.role !== "admin") {
return res.json({ message: "Admin access required" })
}

next()

}