"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const authiticated_1 = require("../Middlewares/authiticated");
const errorsHandler_1 = require("../Services/errorsHandler");
const post_1 = require("../Controllers/post");
const role_1 = require("../Middlewares/role");
const uploader_1 = require("../Services/uploader");
exports.postRouter = (0, express_1.Router)();
//Create post :
exports.postRouter.post('/', authiticated_1.Authenticated.main, role_1.Role.adminModerator, uploader_1.upload.single("file"), errorsHandler_1.ErrorHandler.main(post_1.Post.createPost));
//get all posts :
exports.postRouter.get('/', errorsHandler_1.ErrorHandler.main(post_1.Post.getAllPosts));
//get post by id :
exports.postRouter.get('/:id', errorsHandler_1.ErrorHandler.main(post_1.Post.getPostById));
//delete post : 
exports.postRouter.delete('/:id', authiticated_1.Authenticated.main, role_1.Role.adminModerator, errorsHandler_1.ErrorHandler.main(post_1.Post.deletePost));
//like-dislike post :
exports.postRouter.get('/like/:id', authiticated_1.Authenticated.main, errorsHandler_1.ErrorHandler.main(post_1.Post.likeDislike));
//Add comment :
exports.postRouter.post('/comment/:postId', authiticated_1.Authenticated.main, errorsHandler_1.ErrorHandler.main(post_1.Post.addComment));
//delete comment : 
exports.postRouter.delete('/comment/:id', authiticated_1.Authenticated.main, errorsHandler_1.ErrorHandler.main(post_1.Post.deleteComment));
