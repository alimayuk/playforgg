'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

interface MenuItem {
  title: string;
  link?: string;
  children?: MenuItem[];
}

interface DropdownProps {
  items: MenuItem[];
}

export default function Navbar() {
  const menuData: MenuItem[] = [
    {
      title: "Sana Özel",
      link: "/special",
    },
    {
    title: "Oyunlar",
    children: [
      { title: "Tüm Oyunlar", link: "/games" },
      { title: "Aksiyon", link: "/games/action" },
      { title: "RPG", link: "/games/rpg" },
      { title: "Strateji", link: "/games/strategy" },
    ],
  },
    {
      title: "E-spor",
      children: [
        { title: "Maçlar", link: "/esports/matches" },
        { title: "Turnuvalar", link: "/esports/tournaments" },
        { title: "Haberler", link: "/esports/news" },
        {
          title: "Takımlar",
        },
      ],
    },
    // {
    //   title: "Kanallar",
    //   children: [
    //     { title: "Twitch", link: "/streamers/twitch" },
    //     { title: "Kick", link: "/streamers/kick" },
    //     { title: "YouTube", link: "/streamers/youtube" },
    //   ],
    // },
    // { title: "Bloglar", link: "/blog" },
    {
      title: "Bloglar",
      children: [
        { title: "Tüm Bloglar", link: "/blogs" },
        { title: "Kılavuzlar", link: "/blogs/guides" },
        { title: "Oyun İpuçları", link: "/blogs/tips" },
      ],
    },
    {
      title: "Topluluk", link: "/community",
    },
  ];

  return (
    <header>
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between bg-gray-900 text-white shadow-xl rounded-xl my-5 relative">
        <Link href="/">
          <img
            src="/images/playforgg.png"
            alt="MySite Logo"
            className="aspect-[2/1] w-32 h-auto object-cover"
          />
        </Link>

        <div className="flex items-center space-x-4">
          <Menu items={menuData} />

          {/* Ayırıcı çizgi */}
          <div className="h-6 w-px bg-gray-600 hidden sm:block" />

          {/* Oturum Aç butonu - dolu arka plan */}
          <Link
            href="/login"
            className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-semibold hover:bg-orange-600 transition"
          >
            Oturum Aç
          </Link>
        </div>

      </nav>
    </header>
  );
}

function Menu({ items }: DropdownProps) {
  return (
    <>
      {items.map((item, idx) =>
        item.children ? (
          <DropdownMenu key={idx} item={item} />
        ) : (
          <Link
            key={idx}
            href={item.link || '#'}
            className="transition font-medium hover:text-orange-500 whitespace-nowrap"
          >
            {item.title}
          </Link>
        )
      )}
    </>
  );
}

function DropdownMenu({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        className="font-medium flex items-center gap-1 hover:text-orange-500 focus:outline-none whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        {item.title}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } z-50`}
        role="menu"
        aria-label={`${item.title} Menü`}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        {item.children?.map((child, idx) =>
          child.children ? (
            <SubDropdownMenu key={idx} item={child} />
          ) : (
            <Link
              key={idx}
              href={child.link || '#'}
              className="block px-4 py-2 text-sm hover:bg-orange-600 hover:text-white whitespace-nowrap"
              role="menuitem"
            >
              {child.title}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

function SubDropdownMenu({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        className="w-full text-left px-4 py-2 text-sm flex justify-between items-center hover:bg-orange-600 hover:text-white whitespace-nowrap"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        {item.title}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Alt dropdown */}
      <div
        className={`absolute top-0 left-full mt-0 ml-1 w-48 bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } z-50`}
        role="menu"
        aria-label={`${item.title} Alt Menü`}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        {item.children?.map((child, idx) => (
          <Link
            key={idx}
            href={child.link || '#'}
            className="block px-4 py-2 text-sm hover:bg-orange-600 hover:text-white whitespace-nowrap"
            role="menuitem"
          >
            {child.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
