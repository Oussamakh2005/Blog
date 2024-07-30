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
exports.Post = void 0;
const post_1 = require("../Validation/post");
const __1 = require("..");
const BadRequest_1 = require("../Execeptions/BadRequest");
const root_1 = require("../Execeptions/root");
const NotFound_1 = require("../Execeptions/NotFound");
const Unauthrized_1 = require("../Execeptions/Unauthrized");
class Post {
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                if (req.fileValidatorError) {
                    throw new BadRequest_1.BadRequest(req.fileValidatorError, root_1.ErrorCode.BAD_REQUEST, null);
                }
                //create post :
                const validatedData = post_1.CreatePostSchema.parse(req.body);
                const post = yield ts.post.create({
                    data: {
                        content: validatedData.content,
                        user_id: req.user.id
                    },
                });
                //save image :
                if (req.file) {
                    yield ts.postImage.create({
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
            }));
        });
    }
    static getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield __1.prisma.post.findMany({
                    take: 3,
                    include: {
                        image: true
                    }
                });
                return res.status(200).json({
                    posts
                });
            }
            catch (err) {
                throw new NotFound_1.NotFound("No post found", root_1.ErrorCode.NO_POSTS_FOUND, null);
            }
        });
    }
    static getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield __1.prisma.post.findUnique({
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
            }
            catch (_a) {
                throw new NotFound_1.NotFound("No post found", root_1.ErrorCode.POST_NOT_FOUND, null);
            }
        });
    }
    static deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const post = yield ts.post.findUnique({
                    where: {
                        id: +req.params.id
                    },
                    /* include: {
                         image: {
                             select: {
                                 id: true
                             }
                         },
                         PostLikeEvent: {
                             select: {
                                 id: true
                             }
                         },
                         comments: {
                             select: {
                                 id: true
                             }
                         },
                         reports : {
                             select : {
                                 id : true
                             }
                         }
                     }*/
                });
                if (!post) {
                    throw new NotFound_1.NotFound("No post found", root_1.ErrorCode.POST_NOT_FOUND, null);
                }
                if ((post === null || post === void 0 ? void 0 : post.user_id) === req.user.id || req.user.role === "ADMIN") {
                    /* if (post?.image) {
                         for (const image of post?.image) {
                             await ts.postImage.delete({
                                 where: {
                                     id: image.id
                                 }
                             });
                         }
                     }
                     if (post?.comments) {
                         for (const comment of post?.comments) {
                             await ts.postImage.delete({
                                 where: {
                                     id: comment.id
                                 }
                             });
                         }
                     }
                     if (post?.PostLikeEvent) {
                         for (const like of post?.PostLikeEvent) {
                             await ts.postImage.delete({
                                 where: {
                                     id: like.id
                                 }
                             });
                         }
                     }
                     if (post?.reports) {
                         for (const report of post?.reports) {
                             await ts.postImage.delete({
                                 where: {
                                     id: report.id
                                 }
                             });
                         }
                     }*/
                    //----Delete post relations---///
                    yield ts.postImage.deleteMany({
                        where: {
                            post_id: post.id
                        }
                    });
                    yield ts.postLikeEvent.deleteMany({
                        where: {
                            post_id: post.id
                        }
                    });
                    yield ts.comment.deleteMany({
                        where: {
                            post_id: post.id
                        }
                    });
                    yield ts.report.deleteMany({
                        where: {
                            post_id: post.id
                        }
                    });
                    ////////////////////////////////
                    yield ts.post.delete({
                        where: {
                            id: post === null || post === void 0 ? void 0 : post.id
                        },
                    });
                    return res.status(200).json({
                        msg: "Post deleted successfuly",
                    });
                }
                else {
                    throw new Unauthrized_1.Unauthrized("Post not belong to user", root_1.ErrorCode.UNAUTHRIZED, null);
                }
            }));
        });
    }
    static likeDislike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const post = yield ts.post.findUnique({
                    where: {
                        id: +req.params.id
                    },
                });
                if (!post) {
                    throw new NotFound_1.NotFound("No post found", root_1.ErrorCode.POST_NOT_FOUND, null);
                }
                const postLikeEvent = yield ts.postLikeEvent.findFirst({
                    where: {
                        user_id: req.user.id,
                        post_id: post.id,
                    }
                });
                if (!postLikeEvent) {
                    yield ts.postLikeEvent.create({
                        data: {
                            user_id: req.user.id,
                            post_id: post.id
                        }
                    });
                    yield ts.post.update({
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
                }
                else {
                    yield ts.postLikeEvent.delete({
                        where: {
                            id: postLikeEvent.id
                        }
                    });
                    yield ts.post.update({
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
            }));
        });
    }
    static addComment(req, res) {
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
                const validatedData = post_1.AddCommentSchema.parse(req.body);
                yield ts.comment.create({
                    data: {
                        content: validatedData.content,
                        user_id: req.user.id,
                        post_id: +req.params.postId
                    }
                });
                return res.status(200).json({
                    msg: "comment added successfuly"
                });
            }));
        });
    }
    static deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __1.prisma.$transaction((ts) => __awaiter(this, void 0, void 0, function* () {
                const comment = yield ts.comment.findFirst({
                    where: {
                        id: +req.params.id
                    }
                });
                if (!comment) {
                    throw new NotFound_1.NotFound("comment not found", root_1.ErrorCode.COMMENT_NOT_FOUND, null);
                }
                if (comment.user_id === req.user.id || req.user.role == "ADMIN" || req.user.role == "MODERATOR") {
                    yield ts.comment.delete({
                        where: {
                            id: comment.id,
                        },
                    });
                    return res.status(200).json({
                        msg: "comment deleted successfuly"
                    });
                }
                else {
                    throw new Unauthrized_1.Unauthrized("Comment not belong to user", root_1.ErrorCode.COMMENT_NOT_BELONG_TO_USER, null);
                }
            }));
        });
    }
}
exports.Post = Post;
