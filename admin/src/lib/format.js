export const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const timeAgo = (d) => {
  if (!d) return "—";
  const s = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
};

export const formatTime = (seconds = 0) => {
  const s = Math.round(seconds);
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (!m) return `${r}s`;
  return r ? `${m}m ${r}s` : `${m}m`;
};

export const markingLabel = (marks = 1, neg = 0) => (neg > 0 ? `+${marks} / −${neg}` : `+${marks} / none`);

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

// "ssc-cgl" -> "Ssc Cgl" (fallback when a quiz has no display name)
export const prettySlug = (slug = "") =>
  String(slug).split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
