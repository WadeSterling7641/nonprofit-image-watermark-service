import assert from "node:assert/strict";
import { processRequest, watermarkText } from "./watermark_policy.ts";

const job = { image: "img_123", creatorName: "Maya", campaign: "Meal kits" };
assert.equal(watermarkText(job), "Maya | Meal kits");
assert.deepEqual(processRequest(job), {
  image: "img_123",
  ops: { text: "Maya | Meal kits", position: "bottom-right", opacity: 0.72 }
});
console.log("watermark policy test passed");
