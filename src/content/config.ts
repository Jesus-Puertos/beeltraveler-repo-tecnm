import { defineCollection, z } from 'astro:content';
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    ranking: z.number(),
    author: z.string(),
    authImage: z.string(),
    image: z.string(),
    summary: z.string(),
    type: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
};