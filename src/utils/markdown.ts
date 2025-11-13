import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';
import generateSlug from './slug';

marked.setOptions({
  highlight: function(code: string, lang?: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (hljs.highlight(code, { language: lang }) as any).value;
      } catch (err) {
        return (hljs.highlightAuto(code) as any).value;
      }
    }
    return (hljs.highlightAuto(code) as any).value;
  },
  breaks: true,
  gfm: true
});

export function parseMarkdownSafe(md: string = ''): string {
  let html: string = marked.parse(md || '') as string;
  html = html.replace(/<pre><code class="language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">');
  html = html.replace(/<pre><code class="hljs language-(\w+)">/g, '<pre class="code-block"><code class="hljs language-$1">');
  html = html.replace(/<pre><code>/g, '<pre class="code-block"><code class="hljs">');

  html = html.replace(/<h([1-6])>(.*?)<\/h\1>/gi, (match: string, level: string, content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const id = generateSlug(textContent);
    return `<h${level} id="${id}">${content}</h${level}>`;
  });

  return html;
}

export default parseMarkdownSafe;
