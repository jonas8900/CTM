import Image from 'next/image';
import BurgerMenu from '../navigation/burgermenu';
import Navbar from '../navigation/navbar';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-zinc-200/60 mb-5 dark:border-zinc-800 bg-white/70  dark:bg-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-5xl min-h-[100px] flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/192x192.png"
            alt="CatchTheMoment"
            width={40}
            height={40}
            className="h-20 w-20 rounded-md shadow"
          />
 
        </div>

        <BurgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>

      <Navbar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}