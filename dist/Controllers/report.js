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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const report_1 = require("../Validation/report");
const __1 = require("..");
const NotFound_1 = require("../Execeptions/NotFound");
const root_1 = require("../Execeptions/root");
class Report {
    static createReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const post = yield ts.post.findUnique({
                    where: {
                        id: +req.params.postId
                    },
                });
                if (!post) {
                    throw new NotFound_1.NotFound("No post found", root_1.ErrorCode.POST_NOT_FOUND, null);
                }
                const validatedData = report_1.CreateReportSchema.parse(req.body);
                yield ts.report.create({
                    data: {
                        content: validatedData.content,
                        user_id: req.user.id,
                        post_id: post.id,
                    }
                });
                return res.status(201).json({
                    msg: "report created successfuly"
                });
            }));
        });
    }
    static getAllReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield __1.prisma.report.findMany({
                take: 5
            });
            //if reports is null
            if (reports.length === 0) {
                throw new NotFound_1.NotFound("no reports found", root_1.ErrorCode.NO_REPORTS_FOUND, null);
            }
            return res.status(200).json({
                reports: reports
            });
        });
    }
    static getFiltredWithStauts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield __1.prisma.report.findMany({
                where: {
                    status: req.params.status
                }
            });
            //if reports is null
            if (reports.length === 0) {
                throw new NotFound_1.NotFound("no reports found", root_1.ErrorCode.NO_REPORTS_FOUND, null);
            }
            return res.status(200).json({
                reports: reports
            });
        });
    }
    static getReportById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield __1.prisma.report.findUnique({
                where: {
                    id: +req.params.id
                }
            });
            //if report is null
            if (!report) {
                throw new NotFound_1.NotFound("report not found", root_1.ErrorCode.REPORT_NOT_FOUND, null);
            }
            return res.status(200).json({
                report: report
            });
        });
    }
    static updateReportStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const report = yield ts.report.findUnique({
                    where: {
                        id: +req.params.id
                    }
                });
                //if report is null
                if (!report) {
                    throw new NotFound_1.NotFound("report not found", root_1.ErrorCode.REPORT_NOT_FOUND, null);
                }
                yield ts.report.delete({
                    where: {
                        id: report.id,
                    }
                });
                if (req.params.status === "INVALID") {
                    return res.status(400).json({
                        msg: "report deleted (invalid report)",
                    });
                }
                else {
                    req.params.id = report.post_id;
                    next();
                }
            }));
        });
    }
}
exports.Report = Report;
