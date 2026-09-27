import { Link } from 'react-router-dom'
import Logo from './Logo'

function IconLink({ href, label, children }) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="wrap grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="text-[#f6f1e6]">
            <Logo className="!text-[#f6f1e6]" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#f6f1e6]/75">
            Quiet rooms in the library, booked by the hour and listed by the people who look after them.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#e2c48a]">Useful links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="text-[#f6f1e6] no-underline hover:underline" to="/">Home</Link></li>
            <li><Link className="text-[#f6f1e6] no-underline hover:underline" to="/rooms">Rooms</Link></li>
            <li><Link className="text-[#f6f1e6] no-underline hover:underline" to="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#e2c48a]">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="text-[#f6f1e6] no-underline hover:underline" href="mailto:desk@studynook.library">desk@studynook.library</a></li>
            <li><a className="text-[#f6f1e6] no-underline hover:underline" href="tel:+15550142200">(555) 014-2200</a></li>
          </ul>
          <div className="mt-5 flex gap-2">
            <IconLink href="https://www.facebook.com" label="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v8h3v-8h2.2l.8-3H13V9c0-.6.4-1 1-1z" /></svg>
            </IconLink>
            <IconLink href="https://x.com" label="X">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </IconLink>
            <IconLink href="https://www.linkedin.com" label="LinkedIn">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.1V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" /></svg>
            </IconLink>
            <IconLink href="https://www.instagram.com" label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" /></svg>
            </IconLink>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-4 text-sm text-[#f6f1e6]/70">© {new Date().getFullYear()} StudyNook. All rights reserved.</p>
      </div>
    </footer>
  )
}
