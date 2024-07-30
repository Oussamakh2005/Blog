"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const post_1 = require("./post");
const report_1 = require("./report");
exports.rootRouter = (0, express_1.Router)();
//auth :
exports.rootRouter.use('/auth', auth_1.authRouters);
//post :
exports.rootRouter.use('/post', post_1.postRouter);
//report :
exports.rootRouter.use('/report', report_1.reportRouter);
