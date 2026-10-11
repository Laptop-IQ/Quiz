// Does this text need the Markdown/LaTeX renderer? Plain text (every older question)
// skips it entirely, so it renders instantly and "$5 and $6" is never mistaken for maths.
export const looksRich = (s = "") =>
  /\$\$|\$[^\s$][^$\n]*[^\s$]\$|\$[^\s$]\$/.test(s) || // maths: $x^2$  $$...$$
  /\\\(|\\\[|\\begin\{/.test(s) || // \( \) \[ \] \begin{...}
  /!\[[^\]]*\]\([^)]+\)/.test(s) || // image
  /^\s*\|.+\|\s*$/m.test(s) || // table row
  /\*\*[^*\n]+\*\*|`[^`\n]+`|^\s*[-*] .+/m.test(s); // bold, code, list

// Short single-line preview for lists: figures/tables become tags, maths still renders
export const previewText = (s = "") =>
  String(s)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "[figure]")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim() || "[table]";

export const TYPE_LABEL = {
  mcq: "Multiple Choice Question (MCQ)",
  msq: "Multiple Select Question (MSQ)",
  nat: "Numerical Answer Type (NAT)",
};
