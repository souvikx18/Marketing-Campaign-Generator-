'use client'

import { useState } from 'react'
import type { Session } from 'next-auth'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import CommandPalette from './CommandPalette'

interface Props {
  children: React.ReactNode
  session: Session
}

export default function AppShell({ children, session }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        user={session.user!}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 260 : 72 }}
      >
        {/* Top Bar */}
        <TopBar
          user={session.user!}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(s => !s)}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCmdOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  )
}
