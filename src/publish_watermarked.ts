import { processImage } from "./infrai_client.ts";
import { processRequest, type ImageJob } from "./watermark_policy.ts";

const sample: ImageJob = {
  image: process.env.CREATOR_IMAGE ?? "https://example.org/creator-image.jpg",
  creatorName: process.env.CREATOR_NAME ?? "Community Studio",
  campaign: process.env.CAMPAIGN ?? "Spring food drive"
};

const result = await processImage(processRequest(sample));
console.log(JSON.stringify({ campaign: sample.campaign, watermarkedImage: result }, null, 2));
