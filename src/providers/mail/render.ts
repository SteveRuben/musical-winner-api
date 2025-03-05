import { config } from 'dotenv';
import marked, { MarkedOptions } from 'marked';
import { render as mustache } from 'mustache';

config();

/**
 * Renders a Mustache + Markdown string
 * @param markdown - Markdown string
 * @param view - The view to render the template with
 * @param partials - object that contains the names and templates of partials that are used in a template
 * @param tags - The tags to use
 * @param options - Options for Marked markdown renderer
 */
export const render = (
  markdown: string,
  view: any,

  partials?: Record<string, string> | ((partialName: string) => string | undefined),
  tags?: [string, string],
  options?: MarkedOptions
) => {
  const md = mustache(markdown, view || {}, partials, tags);
  return [md, marked.parse(md, options)];
};
