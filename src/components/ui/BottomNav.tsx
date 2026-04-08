'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Dumbbell,
  CalendarDays,
  CreditCard,
  BarChart2,
} from 'lucide-react'

const navItems = [
  { href: '/',          label: 'Inicio',     icon: Home },
  { href: '/students',  label: 'Alumnas',    icon: Users },
  { href: '/exercises', label: 'Ejercicios', icon: Dumbbell },
  { href: '/classes',   label: 'Clases',     icon: CalendarDays },
  { href: '/payments',  label: 'Pagos',      icon: CreditCard },
  { href: '/reports',   label: 'Reportes',   icon: BarChart2 },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile: bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 flex md:hidden">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
                active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop: left sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200 flex-col pt-6 pb-4 z-20">
        <div className="px-5 mb-6">
          <span className="text-xl font-bold text-gray-900">TDC</span>
          <p className="text-xs text-gray-400 mt-0.5">Gestión de clases</p>
        </div>
        <nav className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
