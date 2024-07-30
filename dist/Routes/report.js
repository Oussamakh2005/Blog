"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("express");
const authiticated_1 = require("../Middlewares/authiticated");
const report_1 = require("../Controllers/report");
const role_1 = require("../Middlewares/role");
const post_1 = require("../Controllers/post");
const errorsHandler_1 = require("../Services/errorsHandler");
exports.reportRouter = (0, express_1.Router)();
//Create report :
exports.reportRouter.post('/:postId', authiticated_1.Authenticated.main, errorsHandler_1.ErrorHandler.main(report_1.Report.createReport));
//Get all reports :
exports.reportRouter.get('/', authiticated_1.Authenticated.main, role_1.Role.admin, errorsHandler_1.ErrorHandler.main(report_1.Report.getAllReports));
//Get report by id :
exports.reportRouter.get('/:id', authiticated_1.Authenticated.main, role_1.Role.admin, errorsHandler_1.ErrorHandler.main(report_1.Report.getReportById));
//Get reports by status :
exports.reportRouter.get('/status/:status', authiticated_1.Authenticated.main, role_1.Role.admin, errorsHandler_1.ErrorHandler.main(report_1.Report.getFiltredWithStauts));
//Update report status :
exports.reportRouter.get('/:id/:status', authiticated_1.Authenticated.main, role_1.Role.admin, errorsHandler_1.ErrorHandler.main(report_1.Report.updateReportStatus), errorsHandler_1.ErrorHandler.main(post_1.Post.deletePost));
