"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (err, req, res, next) {
    if (err) {
        return res.status(400).send({
            Status: "Error",
            msg: err.message
        });
    }
});
