"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.validator = exports.upload = void 0;
var multer_1 = __importDefault(require("multer"));
var express_validator_1 = require("express-validator");
exports.upload = multer_1.default({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + "/../Public/image");
        },
        filename: function (req, file, cb) {
            var name = Date.now() + "-" + file.originalname;
            cb(null, name);
        },
    }),
    fileFilter: function (req, file, cb) {
        return file.mimetype !== "image/png" ? cb(null, false) : cb(null, true);
    },
});
exports.validator = [
    express_validator_1.body("username")
        .isEmail()
        .withMessage("We need your email for create account"),
    express_validator_1.body("password")
        .isLength({ min: 4, max: 20 })
        .withMessage("password must be between 4,20"),
];
exports.loginValidator = [
    express_validator_1.check("username").notEmpty().withMessage("we need a username for login"),
    express_validator_1.check("password").notEmpty().withMessage("we need your password for login"),
];
