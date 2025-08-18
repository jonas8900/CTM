import Link from 'next/link';
import SwitchingThemes from '../theme/switchThemes';
import { NAVBAR_LINKS } from '@/data/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute pt-1 top-full left-0 right-0"
        >
          <div className="mx-auto max-w-5xl px-4">
            <div className="rounded-b-2xl border border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
              <ul className="flex flex-col py-2">
                {NAVBAR_LINKS.map((link) => (
                 <li key={link.href}>
                    <Link
                        href={link.href}
                        onClick={onClose}
                        className="
                        block px-4 py-3 rounded-md
                        text-zinc-700 dark:text-zinc-200
                        hover:bg-zinc-50 dark:hover:bg-zinc-800/70
                        active:bg-[linear-gradient(90deg,#ef4444_0%,#f97316_16.6%,#eab308_33.3%,#22c55e_50%,#3b82f6_66.6%,#6366f1_83.3%,#a855f7_100%)]
                        active:text-white
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700
                        "
                    >
                        {link.label}
                    </Link>
                </li>

                ))}
                <li className="px-4 py-3">
                  <SwitchingThemes />
                </li>
              </ul>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}