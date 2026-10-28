import { Metadata } from 'next'
import React from 'react'
import ClientAdminLayout from './ClientAdminLayout'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_ATLAS_CLUBOS_BRAND === 'true' ? 'Atlas Club · Administração' : 'Atlas Club Dashboard',
}

async function DashboardLayout(
  props: {
    children: React.ReactNode
    params: Promise<any>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <>
      <ClientAdminLayout
        params={params}>
        {children}
      </ClientAdminLayout>
    </>
  )
}

export default DashboardLayout
