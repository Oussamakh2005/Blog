import { Router } from "express";
import { Authenticated } from "../Middlewares/authiticated";
import { ErrorHandler } from "../Services/errorsHandler";
import { Post } from "../Controllers/post";
import { Role } from "../Middlewares/role";
import { upload } from "../Services/uploader";

export const postRouter = Router();
//Create post :
postRouter.post('/',Authenticated.main,Role.adminModerator,upload.single("file"),ErrorHandler.main(Post.createPost));
//get all posts :
postRouter.get('/',ErrorHandler.main(Post.getAllPosts));
//get post by id :
postRouter.get('/:id',ErrorHandler.main(Post.getPostById));
//delete post : 
postRouter.delete('/:id',Authenticated.main,Role.adminModerator,ErrorHandler.main(Post.deletePost));
//like-dislike post :
postRouter.get('/like/:id',Authenticated.main,ErrorHandler.main(Post.likeDislike));
//Add comment :
postRouter.post('/comment/:postId',Authenticated.main,ErrorHandler.main(Post.addComment));
//delete comment : 
postRouter.delete('/comment/:id',Authenticated.main,ErrorHandler.main(Post.deleteComment));