import { z } from "zod";

export const MetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publishedAt: z.date().min(1, "Published date is required"),
  public: z.boolean().optional().default(false),
});

export type Metadata = z.infer<typeof MetadataSchema>;

export type ContentModule = {
  htmlContent: string;
  metadata: Metadata;
};
