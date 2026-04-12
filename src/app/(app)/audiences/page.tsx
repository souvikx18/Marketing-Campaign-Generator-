import type { Metadata } from 'next'
import { Users, Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Audiences', description: 'Manage your targeting audiences and segments.' }

export default function AudiencesPage() {
  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-primary" />
          <h1 className="text-h1 text-text-primary">Audiences</h1>
        </div>
        <button className="btn-primary btn-sm gap-2"><Plus className="w-4 h-4" /> New Audience</button>
      </div>
      <div className="card p-12 text-center">
        <Users className="w-12 h-12 text-primary/30 mx-auto mb-4" />
        <h2 className="text-h3 text-text-primary mb-2">Build Your Audience Library</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto mb-5">
          Save audience segments and reuse them across campaigns. Import from CRM or build with targeting parameters.
        </p>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Create Audience</button>
      </div>
    </div>
  )
}
