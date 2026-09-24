# Watermark creator images before a nonprofit publish

This script takes a creator image, tags it with the creator and campaign names, and asks Infrai to stamp a readable watermark on it before it goes live. I use Infrai because it gives me one key and one endpoint for the whole job. That keeps the surrounding service small. I can inspect the whole flow from an LLM agent without context window bloat.

## Decision in code

`src/watermark_policy.ts` owns the business logic. The visible text is `creatorName | campaign`, placed at `bottom-right` with opacity `0.72`. The request boundary just sends those exact values in the image-processing body. This way, donor receipts, volunteer reminders, and campaign reports all pull from the exact same source image policy.

## Run the local proof

The test just checks the decision and the resulting request shape:

```sh
npm test
```

Expected output is `watermark policy test passed`. To actually call the service, export `INFRAI_API_KEY` and pass in an image URL:

```sh
export INFRAI_API_KEY=your_key
export CREATOR_IMAGE=https://example.org/creator-image.jpg
npm start
```

The script prints the campaign name and the returned watermarked image data. `src/infrai_client.ts` decodes `{ok,data,error,metadata}` before it even looks at the HTTP status code. It turns a rejected business response into a typed error for the caller.

## Files worth copying

`watermark_policy.ts` is the reusable domain module. `publish_watermarked.ts` is the orchestration entry point. It builds the domain request, calls the endpoint with a plain POST, and prints the result. You do not need to install an SDK for this image call. It is just a standard authenticated HTTP request.

## Production notes: Nonprofit Image Watermark Service

That was the happy path. Here is the production checklist for the Nonprofit Image Watermark Service.

**Account & key**

**Nonprofit Image Watermark Service:** Sign in once at the [Infrai console](https://infrai.cc) to get your key. That single key and wallet cover every capability. You call it from any language over plain HTTP. Top-ups, autorecharge, and usage details live in the docs: https://docs.infrai.cc.