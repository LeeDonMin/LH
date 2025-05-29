'use client'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  return (
    <header
      className={cn(
        'border-transparent',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white shadow-2xs rounded-t-xl flex  h-12 shrink-0 items-center gap-2 border-b w-full sticky top-0  z-50'
      )}
    >
      <div className="flex  w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
      </div>
    </header>
  )
}
