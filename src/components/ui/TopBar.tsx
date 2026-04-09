'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const titles: Record<string, string> = {
  '/': 'Inicio',
  '/students': 'Alumnas',
  '/exercises': 'Ejercicios',
  '/routines': 'Rutinas',
  '/turnos': 'Turnos',
  '/payments': 'Pagos',
  '/reports': 'Reportes',
}

export default function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Match prefix for nested routes (e.g. /turnos/[id] → 'Turnos')
  const title = titles[pathname]
    ?? Object.entries(titles).find(([k]) => k !== '/' && pathname.startsWith(k))?.[1]
    ?? 'TDC'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:pl-60">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        Salir
      </button>
    </header>
  )
}
