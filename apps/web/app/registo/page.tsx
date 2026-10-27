import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

// Portuguese alias. It is NOT an Atlas Access SSO integration.
export const metadata: Metadata = { title: 'Registo | Atlas ClubOS', robots: { index: false, follow: false } }
export default function RegistoPage() { redirect('/signup') }
