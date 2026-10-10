import { getCategory } from "../../config/examCategories";

const exams = [
  ["SSC CGL", "ssc"], ["SSC CHSL", "ssc"], ["GATE CSE", "gate"], ["IBPS PO", "banking"],
  ["SBI Clerk", "banking"], ["RRB NTPC", "railways"], ["UPSC CSAT", "upsc"], ["NDA", "defence"],
  ["CDS", "defence"], ["CTET", "teaching"], ["UGC NET", "teaching"], ["State PCS", "state-psc"],
];

const Row = ({ hidden = false }) => (
  <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
    {exams.map(([name, cat]) => {
      const c = getCategory(cat);
      const Icon = c.Icon;
      return (
        <li key={name} className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${c.iconWrap}`}>
            <Icon size={14} />
          </span>
          <span className="text-sm font-bold text-slate-700">{name}</span>
        </li>
      );
    })}
  </ul>
);

const ExamMarquee = () => (
  <section className="pb-14 pt-14" aria-label="Exams you can prepare for">
    <p className="mb-6 px-4 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">
      Prepare for the exams that shape your career
    </p>
    <div className="lp-marquee overflow-hidden">
      <div className="lp-marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  </section>
);

export default ExamMarquee;
