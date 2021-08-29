"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var port = process.env.SERVERPORT || 5000;
var Upload_1 = require("./Middlewares/Upload");
var cache_1 = require("./Middlewares/cache");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var jalali_moment_1 = __importDefault(require("jalali-moment"));
var Hashing_1 = require("./Middlewares/Hashing");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/// User Model
var userModel_1 = require("./Models/userModel");
var app = express_1.default();
app.use(express_1.default.json());
app.set("view engine", "ejs");
app.use(express_1.default.static(__dirname + "/Public"));
app.set("views", __dirname + "/Views");
app.use(cookie_parser_1.default("secret"));
app.get("/signin", function (req, res) {
    res.render("signin", { data: "Hi" });
});
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/login", function (req, res) {
    // console.log(new Date(Date.now()+(60000*2)).toISOString())
    var m = jalali_moment_1.default();
    console.log(m.locale("fa").format("YYYY/M/D - hh:mm:ss"));
    res.cookie("jwt", "asdf4234", { httpOnly: true, secure: true });
    res.send("man");
});
app.post("/loginUser", Upload_1.loginValidator, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, user, passwordCompare, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).send({
                            Status: "Error",
                            Errors: errors.array(),
                        })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userModel_1.User.find({ username: req.body.username })];
            case 2:
                user = _a.sent();
                if (!user) {
                    throw new Error("This username not found");
                }
                return [4 /*yield*/, Hashing_1.Password.compare(user.password, req.body.password)];
            case 3:
                passwordCompare = _a.sent();
                if (!passwordCompare) {
                    throw new Error("Password is incurrect");
                }
                // Create cookie and send
                res.cookie("jwt", jsonwebtoken_1.default.sign({ username: user.username }, "secret", { expiresIn: "1h" }), { secure: true, httpOnly: true });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.send(err_1);
                return [3 /*break*/, 5];
            case 5:
                res.render("/dashboard");
                return [2 /*return*/];
        }
    });
}); });
app.get("/dashboard", function (req, res) {
    res.send(req.cookies);
});
app.post("/form", Upload_1.upload.single("avatar"), Upload_1.validator, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, pass, user, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty() || !((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename)) {
                    return [2 /*return*/, res.status(400).send({
                            Status: "Error",
                            msg: errors.isEmpty() ? "file is require" : errors.array(),
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Hashing_1.Password.toHash(req.body.password)];
            case 2:
                pass = _b.sent();
                return [4 /*yield*/, userModel_1.User.create({
                        username: req.body.username,
                        password: pass,
                        avatar: req.file.filename,
                    })];
            case 3:
                user = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                return [2 /*return*/, res.status(400).send({
                        Status: "Error",
                        msg: "user creation Failed",
                    })];
            case 5:
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
app.get("");
cache_1.mongoose
    .connect("mongodb://localhost:27017/ishia")
    .then(function (con) {
    console.log("connected to db");
})
    .catch(function (err) {
    console.log(err);
});
app.listen(port, function () {
    console.log("Listening on port " + port);
});
