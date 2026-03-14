// Allow TypeScript to import CSS files (handled by Next.js bundler at runtime)
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
