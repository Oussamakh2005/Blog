import { Response, Request } from "express";
import  fs from "fs";
import { AddCommentSchema, CreatePostSchema } from "../Validation/post";
import { prisma } from "..";
import { BadRequest } from "../Execeptions/BadRequest";
import { ErrorCode } from "../Execeptions/root";
import { NotFound } from "../Execeptions/NotFound";
import { Unauthrized } from "../Execeptions/Unauthrized";
import path from "path";
import { InternalException } from "../Execeptions/InternalException";
export class Post {
    static async createPost(req: any, res: Response) {
        return await prisma.$transaction(async (ts) => {
            if (req.fileValidatorError) {
                throw new BadRequest(req.fileValidatorError, ErrorCode.BAD_REQUEST, null);
            }
            //create post :
            const validatedData = CreatePostSchema.parse(req.body);
            const post = await ts.post.create({
                data: {
                    content: validatedData.content,
                    user_id: req.user.id
                },
            });
            //save image :
            if (req.file) {
                await ts.postImage.create({
                    data: {
                        image: req.file.filename,
                        post_id: post.id
                    },
                });
                //for debug
                return res.status(200).json({
                    message: "post create successfuly(with image)",
                });
            }
            return res.status(200).json({
                message: "post create successfuly(without image)"
            });
        });
    }

    static async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await prisma.post.findMany({
                take: 3,
                include: {
                    image: true
                }
            });
            return res.status(200).json({
                posts
            });
        } catch (err) {
            throw new NotFound("No post found", ErrorCode.NO_POSTS_FOUND, null)
        }
    }

    static async getPostById(req: Request, res: Response) {
        try {
            const post = await prisma.post.findUnique({
                where: {
                    id: +req.params.id,
                },
                include: {
                    image: {
                        select: {
                            image: true
                        }
                    }
                },
            });
            return res.status(200).json({
                post
            });
        } catch {
            throw new NotFound("No post found", ErrorCode.POST_NOT_FOUND, null)
        }
    }

    static async deletePost(req: any, res: Response) {

        return await prisma.$transaction(async (ts) => {
            const post = await ts.post.findUnique({
                where: {
                    id: +req.params.id
                },
                include : {
                    image : {
                        select : {
                            image : true
                        }
                    }
                }
            });
            if (!post) {
                throw new NotFound("No post found", ErrorCode.POST_NOT_FOUND, null);
            }
            if (post?.user_id === req.user.id || req.user.role === "ADMIN") {
              
                //----Delete post relations---///
                if(post.image){
                    const imagePath = path.join(__dirname,'../','uploads',post.image[0].image);
                    fs.unlink(imagePath,(err : any) => {
                        if(err){
                            throw new InternalException("Somthing went wrong (faild to delete iamge)",ErrorCode.INTERNAL_SERVER_ERROR,err);
                        }
                    });
                    await ts.postImage.deleteMany({
                        where: {
                            post_id: post.id
                        }
                    });
                }
                await ts.postLikeEvent.deleteMany({
                    where: {
                        post_id: post.id
                    }
                });
                await ts.comment.deleteMany({
                    where: {
                        post_id: post.id
                    }
                });
                await ts.report.deleteMany({
                    where: {
                        post_id: post.id
                    }
                });
                ////////////////////////////////
                await ts.post.delete({
                    where: {
                        id: post?.id
                    },
                });
                return res.status(200).json({
                    msg: "Post deleted successfuly",
                });
            } else {
                throw new Unauthrized("Post not belong to user", ErrorCode.UNAUTHRIZED, null);
            }
        });
    }

    static async likeDislike(req: any, res: Response) {
        return await prisma.$transaction(async (ts) => {
            const post = await ts.post.findUnique({
                where: {
                    id: +req.params.id
                },
            });
            if (!post) {
                throw new NotFound("No post found", ErrorCode.POST_NOT_FOUND, null);
            }
            const postLikeEvent = await ts.postLikeEvent.findFirst({
                where: {
                    user_id: req.user.id,
                    post_id: post.id,
                }
            });
            if (!postLikeEvent) {
                await ts.postLikeEvent.create({
                    data: {
                        user_id: req.user.id,
                        post_id: post.id
                    }
                });
                await ts.post.update({
                    where: {
                        id: post.id,
                    },
                    data: {
                        likes: (+(post.likes) + 1)
                    }
                });
                return res.status(200).json({
                    like: true
                });
            } else {
                await ts.postLikeEvent.delete({
                    where: {
                        id: postLikeEvent.id
                    }
                });
                await ts.post.update({
                    where: {
                        id: post.id,
                    },
                    data: {
                        likes: (+(post.likes) - 1)
                    }
                });
                return res.status(200).json({
                    dislike: true
                });
            }
        });
    }

    static async addComment(req: any, res: Response) {
        return await prisma.$transaction(async (ts) => {
            const post = await ts.post.findUnique({
                where: {
                    id: +req.params.postId
                },
            });
            if (!post) {
                throw new NotFound("No post found", ErrorCode.POST_NOT_FOUND, null);
            }
            const validatedData = AddCommentSchema.parse(req.body);
            await ts.comment.create({
                data: {
                    content: validatedData.content,
                    user_id: req.user.id,
                    post_id: +req.params.postId
                }
            });
            return res.status(200).json({
                msg: "comment added successfuly"
            });
        });
    }

    static async deleteComment(req: any, res: Response) {
        return await prisma.$transaction(async (ts) => {
            const comment = await ts.comment.findFirst({
                where: {
                    id: +req.params.id
                }
            });
            if (!comment) {
                throw new NotFound("comment not found", ErrorCode.COMMENT_NOT_FOUND, null);
            }
            if (comment.user_id === req.user.id || req.user.role == "ADMIN" || req.user.role == "MODERATOR") {
                await ts.comment.delete({
                    where: {
                        id: comment.id,
                    },
                });
                return res.status(200).json({
                    msg: "comment deleted successfuly"
                })
            } else {
                throw new Unauthrized("Comment not belong to user", ErrorCode.COMMENT_NOT_BELONG_TO_USER, null);
            }
        });
    }
}