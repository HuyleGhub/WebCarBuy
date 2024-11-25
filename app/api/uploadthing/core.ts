import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();

const auth = (req: Request) => ({ id: "user1" });

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10} })
  .middleware(async ({ req }) => {
    // This code runs on your server before upload
    const user = await auth(req);
    // If you throw, the user will not be able to upload
    if (!user) throw new UploadThingError("Unauthorized");
    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return { userId: user.id };
  })
  .onUploadComplete(()=> {})
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
