import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/ui/BottomNav'
import TopBar from '@/components/ui/TopBar'
import CartProvider from '@/components/cart/CartProvider'
import CartSheet from '@/components/cart/CartSheet'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-20 md:pb-6 md:pl-56">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
        <BottomNav />
        <CartSheet />
      </div>
    </CartProvider>
  )
}
