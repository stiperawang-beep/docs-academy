import { defineConfig, s } from 'velite';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:8].[ext]',
    clean: true,
  },
  collections: {
    tutorials: {
      name: 'Tutorial',
      pattern: 'tutorials/**/*.mdx',
      schema: s
        .object({
          title: s.string().max(99),
          description: s.string().optional(),
          icon: s.string().default('Book'),
          order: s.number().default(0),
          status: s.enum(['draft', 'published']).default('published'),
          metadata: s.metadata(),
          toc: s.toc(),
          content: s.mdx(),
        })
        .transform((data, { meta }) => {
          const normalizedPath = meta.path.replace(/\\/g, '/');
          const slugMatch = normalizedPath.match(/tutorials\/(.+)\.mdx?$/);
          const cleanSlug = slugMatch ? slugMatch[1] : normalizedPath.replace(/\.mdx?$/, '');
          return {
            ...data,
            slug: cleanSlug,
            permalink: `/tutorial/${cleanSlug}`
          };
        }),
    },
  },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode as any, { theme: 'github-dark' }]
    ]
  }
});
