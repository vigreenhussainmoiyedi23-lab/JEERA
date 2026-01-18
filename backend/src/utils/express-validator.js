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
const TaskValidator = [
  // 🔹 Title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  // 🔹 Description
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  // 🔹 Issue Type
  body("issueType")
    .optional()
    .isIn(["task", "bug", "story", "epic"])
    .withMessage("Invalid issue type"),

  // 🔹 Priority
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical", "highest"])
    .withMessage("Invalid priority"),

  // 🔹 Task Status
  body("taskStatus")
    .optional()
    .isIn(["toDo", "Inprogress", "Inreview", "done", "Failed"])
    .withMessage("Invalid task status"),

  // 🔹 Category
  body("category")
    .optional()
    .isIn(["frontend", "backend", "devops", "debugging", "other"])
    .withMessage("Invalid category"),

  // 🔹 Story Points
  body("storyPoints")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Story points must be a positive number"),

  // 🔹 Labels
  body("labels")
    .optional()
    .isArray()
    .withMessage("Labels must be an array"),

  body("labels.*")
    .optional()
    .isString()
    .withMessage("Each label must be a string"),

  // 🔹 Assigned To (array of ObjectIds)
  body("assignedTo")
    .optional()
    .isArray()
    .withMessage("AssignedTo must be an array"),

  // 🔹 Due Date
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date format"),
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
  TaskValidator
};
