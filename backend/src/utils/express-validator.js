const { body, validationResult } = require("express-validator");

/* ======================================================
   🧩 AUTH VALIDATORS
====================================================== */

const RegisterValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ min: 8 })
    .withMessage("Email must be at least 8 characters long")
    .normalizeEmail(),

  body("username")
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
];

const LoginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

/* ======================================================
   🧩 PROJECT VALIDATOR (for create/edit routes)
====================================================== */

const ProjectValidator = [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
];


/* ======================================================
   🧩 CHAT VALIDATOR (for message sending)
====================================================== */

const ChatMessageValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Message must be between 1 and 500 characters")
    .matches(/^[a-zA-Z0-9\s.,!?'"-]+$/)
    .withMessage("Message contains invalid characters")
    .escape(),
];


/* ======================================================
   🧩 COMMON VALIDATE MIDDLEWARE
====================================================== */

function validate(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formatted = {};
      errors.array().forEach((err) => {
        formatted[err.path] = err.msg;
      });
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatted,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


/* ======================================================
   ✅ EXPORT ALL VALIDATORS
====================================================== */

module.exports = {
  RegisterValidator,
  LoginValidator,
  ProjectValidator,
  ChatMessageValidator,
  validate,
};
