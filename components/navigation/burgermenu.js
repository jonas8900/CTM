
export default function BurgerMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <button
      type="button"
      aria-expanded={isMenuOpen}
      aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="relative inline-flex cursor-pointer h-10 w-10 items-center justify-center -m-1 select-none
                 text-zinc-800 dark:text-zinc-100 focus:outline-none"
    >
      <span
        className={`absolute block h-[3px] w-8 rounded-full bg-current 
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-2.5 rotate-0'}`}
      />
      <span
        className={`absolute block h-[3px] w-8 rounded-full bg-current 
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'}`}
      />
      <span
        className={`absolute block h-[3px] w-8 rounded-full bg-current 
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2.5 rotate-0'}`}
      />
    </button>
  );
}
