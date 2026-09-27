export default function AuthShell({ children }) {
  return (
    <div className="wrap grid items-stretch gap-8 py-12 lg:grid-cols-2">
      <aside className="hidden flex-col justify-between rounded-[28px] bg-[#10281f] p-10 text-[#f6f1e6] lg:flex">
        <p className="font-serif text-4xl leading-tight tracking-tight">Reserve the quiet hour before someone else takes the chair.</p>
        <p className="max-w-sm text-[#f6f1e6]/75">Your session stays in a secure cookie. Refreshing a private page will not send you back to login.</p>
      </aside>
      <div className="card p-6 sm:p-8">{children}</div>
    </div>
  )
}
