import { CollectionHeader } from '@/components/collection/CollectionHeader'

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <CollectionHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}