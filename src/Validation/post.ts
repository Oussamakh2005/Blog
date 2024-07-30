import z from "zod";

export const CreatePostSchema = z.object({
    content : z.string().min(20).max(300)
});

export const PostImageSchema = z.object({
    originalname : z.string().refine((name) => {
        const ext  = name.split(".").pop();
        if(ext)
        return ["jpg","jpeg","gif","webp","png","avif"].includes(ext?.toLowerCase());
    }),
    mimetype : z.string().refine((type) => {
        return type.startsWith("image/")
    },{
        message : "Invalid Mimetype ,only images are allowed.",
    }),
}); 

export const AddCommentSchema = z.object({
    content : z.string().min(1).max(200),
});