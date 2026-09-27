import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--surface)] focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="content" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
