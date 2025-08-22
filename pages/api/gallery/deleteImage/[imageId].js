import dbConnect from "@/db/connect";
import Image from "@/db/models/Image";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION 
});

export default async function handler(req, res) {



    if(req.method === "DELETE") {    
        
        
        await dbConnect();

         try {
            const { imageId } = req.query; 
            const image = await Image.findById(imageId);

            if (!image) {
            return res.status(404).json({ error: "Image not found" });
            }

            if (image.url) {
            const key = image.url.startsWith("http")
                ? new URL(image.url).pathname.substring(1)
                : image.url;

            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            };

            await s3.deleteObject(params).promise();
            }

            await image.deleteOne();

            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
}