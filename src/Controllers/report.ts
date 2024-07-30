import { NextFunction, Response } from "express";
import { CreateReportSchema } from "../Validation/report";
import { prisma } from "..";
import { NotFound } from "../Execeptions/NotFound";
import { ErrorCode } from "../Execeptions/root";

export class Report {
    static async createReport(req: any, res: Response) {
        return await prisma.$transaction(async (ts) => {
            const post = await ts.post.findUnique({
                where: {
                    id: +req.params.postId
                },
            });
            if (!post) {
                throw new NotFound("No post found", ErrorCode.POST_NOT_FOUND, null);
            }
            const validatedData = CreateReportSchema.parse(req.body);
            await ts.report.create({
                data: {
                    content: validatedData.content,
                    user_id: req.user.id,
                    post_id: post.id,
                }
            });
            return res.status(201).json({
                msg: "report created successfuly"
            });
        });
    }
    static async getAllReports(req: any, res: Response) {
        const reports = await prisma.report.findMany({
            take : 5
        });
        //if reports is null
        if (reports.length === 0) {
            throw new NotFound("no reports found", ErrorCode.NO_REPORTS_FOUND, null);
        }
        return res.status(200).json({
            reports: reports
        });
    }
    static async getFiltredWithStauts(req: any, res: Response) {
        const reports = await prisma.report.findMany({
            where: {
                status: req.params.status
            }
        });
        //if reports is null
        if (reports.length === 0) {
            throw new NotFound("no reports found", ErrorCode.NO_REPORTS_FOUND, null);
        }
        return res.status(200).json({
            reports: reports
        });
    }
    static async getReportById(req: any, res: Response) {
        const report = await prisma.report.findUnique({
            where: {
                id: +req.params.id
            }
        });
        //if report is null
        if (!report) {
            throw new NotFound("report not found", ErrorCode.REPORT_NOT_FOUND, null);
        }
        return res.status(200).json({
            report: report
        });
    }
    static async updateReportStatus(req: any, res: Response, next: NextFunction) {
        return await prisma.$transaction(async (ts) => {
            const report = await ts.report.findUnique({
                where: {
                    id: +req.params.id
                }
            });
            //if report is null
            if (!report) {
                throw new NotFound("report not found", ErrorCode.REPORT_NOT_FOUND, null);
            }
            await ts.report.delete({
                where : {
                    id : report.id,
                }
            });
            if(req.params.status === "INVALID") {
                return res.status(400).json({
                    msg : "report deleted (invalid report)",
                })
            }else{
                req.params.id = report.post_id;
                next();
            }
        });
    }
}