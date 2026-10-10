import { Link } from "react-router-dom";

const explore = [
  { label: "Test Series", to: "/test-series" },
  { label: "Contact Us", to: "/contact" },
];
const account = [
  { label: "Login", to: "/login" },
  { label: "Sign Up", to: "/signup" },
];

const FooterLinks = ({ title, links }) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
    <ul className="mt-4 space-y-2.5">
      {links.map((l) => (
        <li key={l.label}>
          <Link to={l.to} className="text-sm font-medium text-slate-300 transition hover:text-white">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-gray-300">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="text-xl font-extrabold text-white">
              <span className="text-emerald-400">Tech</span> Quiz Master
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Level-wise mock tests, timed practice and instant analysis to help you prepare for SSC, GATE, Banking, Railways and other competitive exams.
            </p>
          </div>
          <FooterLinks title="Explore" links={explore} />
          <FooterLinks title="Account" links={account} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">
          <p>Copyright © 2026 Tech Quiz Master. All rights reserved</p>
          <div className="flex gap-6">
            <span>User Policy</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
