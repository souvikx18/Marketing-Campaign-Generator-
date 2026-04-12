import type { Metadata } from 'next'
import CampaignWizard from './CampaignWizard'

export const metadata: Metadata = {
  title: 'New Campaign',
  description: 'Create a new AI-powered marketing campaign.',
}

export default function NewCampaignPage() {
  return <CampaignWizard />
}
