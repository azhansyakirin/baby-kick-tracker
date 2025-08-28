export const Header = ({ handleToggleAddLog }) => {
  return (
    <>
      <div className="w-full flex flex-col gap-4 md:flex-row items-start justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl mb-2">Baby Poop Logs</h1>
          <p>Track your baby poop time and behaviour. For more information, you can read more <a className="underline" href="/TAP-Baby-Poop-Colour-Guide.webp" target="_blank">here</a>.</p>
        </div>
        <button className="text-[var(--text-primary)] inline-flex items-center gap-1 text-sm font-medium border px-4 py-2 rounded-lg hover:bg-[var(--primary)]" onClick={handleToggleAddLog}>
          Add New Log
        </button>
      </div>
    </>
  )
}
