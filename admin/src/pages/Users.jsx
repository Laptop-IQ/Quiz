import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Trash2, Users as UsersIcon, X, BadgeCheck } from "lucide-react";
import { api } from "../services/api/api";
import { useToast } from "../components/Toast";
import { Badge, Card, ConfirmDialog, EmptyState, ErrorState, PageHeader, Skeleton, buttonStyles, cx, inputStyles } from "../components/ui";
import { formatDate, initials, timeAgo } from "../lib/format";

const Users = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // wait for the admin to stop typing before searching
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      setData(await api.get(`/admin/users?page=${page}&search=${encodeURIComponent(debounced)}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, debounced]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const r = await api.del(`/admin/users/${toDelete._id}`);
      toast(`User deleted${r.resultsDeleted ? ` along with ${r.resultsDeleted} result${r.resultsDeleted === 1 ? "" : "s"}` : ""}`);
      setToDelete(null);
      load();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Users" subtitle={data ? `${data.total} ${debounced ? "matching" : "registered"} user${data.total === 1 ? "" : "s"}` : "Everyone who has signed up."} />

      <Card className="mb-5 p-4">
        <div className="relative max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" aria-label="Search users" className={cx(inputStyles, "pl-9 pr-9")} />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><X size={14} /></button>
          )}
        </div>
      </Card>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : data.users.length === 0 ? (
        <EmptyState icon={UsersIcon} title={debounced ? "No users match your search" : "No users yet"} text={debounced ? "Check the spelling or try part of the email." : "Users will appear here once they sign up."} />
      ) : (
        <Card className={cx("overflow-hidden transition-opacity", loading && "opacity-60")}>
          <div className="hidden grid-cols-[2fr_1.4fr_0.8fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 md:grid">
            <span>User</span><span>Joined</span><span>Attempts</span><span>Last active</span><span className="w-9" />
          </div>
          <ul className="divide-y divide-slate-100">
            {data.users.map((u) => (
              <li key={u._id} className="grid items-center gap-3 px-5 py-3.5 md:grid-cols-[2fr_1.4fr_0.8fr_1fr_auto] md:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {u.profilePic ? (
                    <img src={u.profilePic} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">{initials(u.name)}</div>
                  )}
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-bold text-slate-900">
                      {u.name}
                      {u.isVerified && <BadgeCheck size={15} className="shrink-0 text-sky-500" aria-label="Verified" />}
                    </p>
                    <p className="truncate text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{formatDate(u.createdAt)}</p>
                <p className="text-sm font-bold text-slate-800">{u.attempts}</p>
                <p className="text-sm text-slate-600">{u.lastActive ? timeAgo(u.lastActive) : <Badge className="bg-slate-50 text-slate-500 ring-slate-200">No tests yet</Badge>}</p>
                <button onClick={() => setToDelete(u)} className={cx(buttonStyles.icon, "justify-self-start hover:bg-rose-50 hover:text-rose-600 md:justify-self-end")} aria-label={`Delete ${u.name}`} title="Delete user">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>

          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">Page {data.page} of {data.pages}</p>
              <div className="flex gap-2">
                <button className={buttonStyles.secondary} disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={15} /> Prev</button>
                <button className={buttonStyles.secondary} disabled={page >= data.pages || loading} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight size={15} /></button>
              </div>
            </div>
          )}
        </Card>
      )}

      <ConfirmDialog open={!!toDelete} danger busy={deleting} title="Delete this user?" confirmLabel="Delete user" onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p><b className="text-slate-800">{toDelete?.name}</b> ({toDelete?.email}) and all of their saved results ({toDelete?.attempts} attempt{toDelete?.attempts === 1 ? "" : "s"}) will be permanently removed. This cannot be undone.</p>
      </ConfirmDialog>
    </>
  );
};

export default Users;
