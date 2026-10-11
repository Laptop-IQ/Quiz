import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Only http(s), same-site and inline image data URLs are allowed (no javascript: etc.)
const urlTransform = (url) =>
  /^(https?:\/\/|\/(?!\/)|data:image\/(png|jpe?g|gif|webp|svg\+xml)[;,])/i.test(url) ? url : "";

/* eslint-disable no-unused-vars -- `node` is react-markdown's AST node, dropped on purpose */
const components = {
  img: ({ node, alt, ...props }) => (
    <img {...props} alt={alt || "figure"} loading="lazy" className="rich-img" />
  ),
  table: ({ node, ...props }) => (
    <div className="rich-table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

// Markdown + GitHub tables + LaTeX maths. Raw HTML is never rendered.
const RichTextImpl = ({ text, className = "" }) => (
  <div className={`rich ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
      urlTransform={urlTransform}
      components={components}
    >
      {text}
    </ReactMarkdown>
  </div>
);

export default RichTextImpl;
