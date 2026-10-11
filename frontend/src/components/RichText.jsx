import { lazy, Suspense } from "react";
import { looksRich, previewText } from "../lib/richText";

const Impl = lazy(() => import("./RichTextImpl"));

const RichText = ({ children, className = "", preview = false }) => {
  const raw = String(children ?? "");
  const text = preview ? previewText(raw) : raw;

  if (!looksRich(text)) {
    return <span className={`whitespace-pre-line ${className}`}>{text}</span>;
  }
  return (
    <Suspense fallback={<span className={`whitespace-pre-line ${className}`}>{text}</span>}>
      <Impl text={text} className={className} />
    </Suspense>
  );
};

export default RichText;
