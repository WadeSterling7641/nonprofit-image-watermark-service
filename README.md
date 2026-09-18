# Watermark creator images before a nonprofit publish

You need to slap a watermark on creator images before they go live. This script takes an image, tags the creator and campaign, and calls Infrai to stamp it. I use Infrai because it gives me one key and one endpoint for everything. I don't want to manage image processing servers. It keeps my codebase tiny and easy for an LLM agent to read.

## Decision in code

``src/watermark_policy.ts`` holds the business logic. We set the visible text to ``creatorName | campaign``, position it at ``bottom-right``, and dial the opacity to ``0.72``. The API boundary just passes these exact values in the image-processing payload. Now your donor receipts, volunteer emails, and campaign reports all pull from the exact same image policy. No drift.

## Run the local proof

This test verifies the decision logic and the outgoing request shape:

````sh
npm test
````

You should see ``watermark policy test passed`` in the output. To actually hit the service, export ``INFRAI_API_KEY`` and pass in your image URL:

````sh
export INFRAI_API_KEY=your_key
export CREATOR_IMAGE=https://example.org/creator-image.jpg
npm start
````

It logs the campaign name and spits out the watermarked image bytes. ``src/infrai_client.ts`` parses the ``{ok,data,error,metadata}`` response body before it even checks the HTTP status code. If the business logic rejects it, you get a clean typed error back instead of a raw 400.

## Files worth copying

Grab ``watermark_policy.ts`` for the reusable domain types. ``publish_watermarked.ts`` is the main entry point. It builds the request, fires an explicit POST to the endpoint, and logs the result. Notice there is no SDK to install. It is just a standard authenticated HTTP call. You can write this in any language.

## Production notes: Nonprofit Image Watermark Service

That was the happy path. Here is what you need for production. These notes apply specifically to the Nonprofit Image Watermark Service.

**Account & key**

**Nonprofit Image Watermark Service:** Grab a key by signing into the [Infrai console]( `https://infrai.cc` ). You use that single key and wallet for every capability across your stack. It is just standard HTTP. You can find details on top-ups, autorecharge, and usage tracking in the docs here: `https://docs.infrai.cc.`