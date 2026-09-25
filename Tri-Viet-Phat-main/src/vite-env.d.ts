/// <reference types="vite/client" />

declare module 'virtual:news-index' {
  const index: {
    id: string;
    order: number;
    title: string;
    date: string;
    image: string;
    excerpt: string;
    categorySlug?: string;
  }[];
  export default index;
}
