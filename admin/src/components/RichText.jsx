import { lazy, Suspense } from "react";
import { looksRich } from "../lib/richText";

const Impl = lazy(() => import("./RichTextImpl"));

// Renders Markdown / LaTeX / tables / figures exactly as students will see them.
const RichText = ({ children, className = "" }) => {
  const text = String(children ?? "");
  if (!looksRich(text)) return <span className={`whitespace-pre-line ${className}`}>{text}</span>;
  return (
    <Suspense fallback={<span className={`whitespace-pre-line ${className}`}>{text}</span>}>
      <Impl text={text} className={className} />
    </Suspense>
  );
};

export default RichText;
