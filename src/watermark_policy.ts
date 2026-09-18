export type ImageJob = {
  image: string;
  creatorName: string;
  campaign: string;
};

export function watermarkText(job: ImageJob): string {
  return `${job.creatorName} | ${job.campaign}`;
}

export function processRequest(job: ImageJob) {
  return {
    image: job.image,
    ops: { text: watermarkText(job), position: "bottom-right", opacity: 0.72 }
  };
}
