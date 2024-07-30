import z from "zod";

export const CreateReportSchema = z.object({
    content : z.string().min(20).max(100)
});