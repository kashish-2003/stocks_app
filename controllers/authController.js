//=====================================================
// 📌CODE BY : KASHISH RITHE
//=====================================================

const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { generateUsername, generatePassword } = require("../utils/generator");
const { sendMail } = require("../config/mail");

//SIGN UP -------------------------------------------------
exports.signup = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    contact,
    country,
    state,
    account_type,
  } = req.body;

  // 🔴 STEP 1 → CHECK REQUIRED FIELDS
  if (!first_name || !email || !contact) {
    return res.json({
      message: "Required fields missing",
    });
  }

  // 🔴 STEP 2 → CHECK CONTACT ALREADY EXISTS
  const checkContact = "SELECT * FROM users WHERE contact = ?";

  db.query(checkContact, [contact], (err, contactResult) => {
    if (err) {
      return res.json({ message: "DB error" });
    }

    if (contactResult.length > 0) {
      return res.json({
        message: "Contact number already registered",
      });
    }

    // 🔴 STEP 3 → CHECK EMAIL ALSO (BEST PRACTICE)
    const checkEmail = "SELECT * FROM users WHERE email = ?";

    db.query(checkEmail, [email], (err, emailResult) => {
      if (err) {
        return res.json({ message: "DB error" });
      }

      if (emailResult.length > 0) {
        return res.json({
          message: "Email already registered",
        });
      }

      // 🔥 STEP 4 → GENERATE USERNAME & PASSWORD
      const username = generateUsername(first_name);
      const password = generatePassword();

      const sql = `INSERT INTO users
(first_name,last_name,username,email,password,contact,country,state,account_type)
VALUES (?,?,?,?,?,?,?,?,?)`;

      db.query(
        sql,
        [
          first_name,
          last_name,
          username,
          email,
          password,
          contact,
          country,
          state,
          account_type,
        ],
        async (err, result) => {
          if (err) {
            return res.json({ message: "Signup error", error: err });
          }

          const userMessage = `
Hello ${first_name}

Your account created successfully

Username: ${username}
Password: ${password}
`;

          const adminMessage = `
New user registered

Name: ${first_name} ${last_name}
Email: ${email}
Username: ${username}
Password: ${password}
`;

          try {
            await sendMail(email, "Account Created", userMessage);
            await sendMail(
              "adminkashish@yopmail.com",
              "New User Registered",
              adminMessage
            );
          } catch (error) {
            console.log("Mail Error:", error);
          }

          res.json({
            message: "Signup successful",
            username,
            password,
          });
        }
      );
    });
  });
};

//LOGIN -------------------------------------------------

exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      return res.json({ message: "Login error" });
    }

    if (result.length === 0) {
      return res.json({ message: "Invalid credentials" });
    }

    const user = result[0];

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token: token,
      user: user,
    });
  });
};

const crypto = require("crypto");

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  // check if user exists
  const sql = "SELECT * FROM users WHERE email=?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.json({ message: "DB error", error: err });
    if (result.length === 0) return res.json({ message: "User not found" });

    const user = result[0];

    // generate temporary token valid for 10 minutes
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // 📧 Send Emails to uLINKED-USER
    const link = `http://localhost:5000/api/change-password?token=${token}`;

    const message = `
Hi ${user.first_name},

You requested to reset your password.

Click the link to change password:
${link}

This link will expire in 10 minutes.
`;

    try {
      await sendMail(user.email, "Password Reset Link", message);
      res.json({ message: "Reset link sent to your email" });
    } catch (error) {
      console.log(error);
      res.json({ message: "Mail sending failed" });
    }
  });
};
exports.changePassword = (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) return res.json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const sql = "UPDATE users SET password=? WHERE id=?";
    db.query(sql, [newPassword, userId], (err, result) => {
      if (err) return res.json({ message: "DB error", error: err });
      res.json({ message: "Password changed successfully" });
    });
  } catch (error) {
    return res.json({ message: "Invalid or expired token" });
  }
};
