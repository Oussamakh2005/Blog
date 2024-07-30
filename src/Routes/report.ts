import { Router } from "express";
import { Authenticated } from "../Middlewares/authiticated";
import { Report } from "../Controllers/report";
import { Role } from "../Middlewares/role";
import { Post } from "../Controllers/post";
import { ErrorHandler } from "../Services/errorsHandler";

export const reportRouter = Router();

//Create report :
reportRouter.post('/:postId',Authenticated.main,ErrorHandler.main(Report.createReport));
//Get all reports :
reportRouter.get('/',Authenticated.main,Role.admin,ErrorHandler.main(Report.getAllReports));
//Get report by id :
reportRouter.get('/:id',Authenticated.main,Role.admin,ErrorHandler.main(Report.getReportById));
//Get reports by status :
reportRouter.get('/status/:status',Authenticated.main,Role.admin,ErrorHandler.main(Report.getFiltredWithStauts));
//Update report status :
reportRouter.get('/:id/:status',Authenticated.main,Role.admin,ErrorHandler.main(Report.updateReportStatus),ErrorHandler.main(Post.deletePost));