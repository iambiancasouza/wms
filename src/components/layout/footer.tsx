export function Footer() {
  return (
    <footer className="w-full border-t border-[#e0e8dd] bg-white bg-opacity-70 backdrop-blur-sm z-10 py-3">
      <div className="container mx-auto px-4">
        <p className="text-xs text-center text-gray-500">
          &copy; {new Date().getFullYear()} Where&apos;s my skincare. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
