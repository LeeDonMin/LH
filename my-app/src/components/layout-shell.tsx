export function LayoutShell({
  header,
  children
}: {
  header: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-rows-[60px_1fr] h-screen transition-all duration-300 ease-in-out">
      {header}
      <main>{children}</main>
    </div>
  )
}
