'use client';

import { UsersService } from '@/customServices/users.service';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X as CloseIcon } from 'lucide-react';

interface MenuItem {
  title: string;
  link?: string;
  children?: MenuItem[];
}

export default function Navbar() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password_confirmation, setpassword_confirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'login' | 'register' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuData: MenuItem[] = [
    {
      title: "Oyunlar",
      link: "/games",
    },
    {
      title: "E-spor",
      children: [
        { title: "Haberler", link: "/esports/news" },
      ],
    },
    {
      title: "Bloglar",
      link: "/blogs",
    },
    {
      title: "Forumlar", 
      link: "/forums",
    },
    {
      title: "Topluluk", 
      link: "/community",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password_confirmation) {
      setError("Şifreler eşleşmiyor!");
      return;
    }
    try {
      const res = await UsersService.register({
        username,
        email,
        password,
        password_confirmation,
      });
      console.log("Kayıt başarılı:", res);
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      setEmail('');
      setPassword('');
      setUsername('');
      setpassword_confirmation('');
      setModalType('login');
    } catch (error) {
      setError("Kayıt sırasında bir hata oluştu.");
    }
  };

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

        {/* Desktop Navigation */}
        {windowWidth >= 768 ? (
          <div className="flex items-center space-x-4">
            <DesktopMenu items={menuData} />

            <div className="h-6 w-px bg-gray-600" />

            <button
              onClick={() => setModalType('login')}
              className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-semibold hover:bg-orange-600 transition"
            >
              Oturum Aç
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {isMobileMenuOpen && (
              <MobileMenu 
                items={menuData} 
                onClose={() => setIsMobileMenuOpen(false)} 
                onLoginClick={() => {
                  setIsMobileMenuOpen(false);
                  setModalType('login');
                }}
              />
            )}
          </>
        )}
      </nav>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative mx-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setModalType(null)}
            >
              ✕
            </button>

            {modalType === 'login' ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center text-black">Giriş Yap</h2>
                <form className="space-y-4 text-black">
                  <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Şifre"
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
                  >
                    Giriş Yap
                  </button>
                </form>
                <p className="text-center mt-4 text-sm text-black">
                  Hesabın yok mu?{' '}
                  <button
                    onClick={() => setModalType('register')}
                    className="text-orange-500 hover:underline"
                  >
                    Kayıt ol
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center text-black">Kayıt Ol</h2>
                <form className="space-y-4 text-black">
                  <input
                    name='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Kullanıcı Adı"
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <input
                    type="email"
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta"
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <input
                    type="password"
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <input
                    type="password"
                    name='password_confirmation'
                    value={password_confirmation}
                    onChange={(e) => setpassword_confirmation(e.target.value)}
                    placeholder="Şifre Tekrar"
                    className="w-full border border-gray-300 p-2 rounded"
                  />
                  <button
                    type="button"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded" 
                    onClick={handleSubmit}
                  >
                    Kayıt Ol
                  </button>
                </form>
                <p className="text-center mt-4 text-sm text-black">
                  Zaten hesabın var mı?{' '}
                  <button
                    onClick={() => setModalType('login')}
                    className="text-orange-500 hover:underline"
                  >
                    Giriş yap
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function DesktopMenu({ items }: { items: MenuItem[] }) {
  return (
    <div className="hidden md:flex space-x-6">
      {items.map((item, idx) =>
        item.children ? (
          <DesktopDropdownMenu key={idx} item={item} />
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
    </div>
  );
}

function DesktopDropdownMenu({ item }: { item: MenuItem }) {
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
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        role="menu"
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

function MobileMenu({ items, onClose, onLoginClick }: { 
  items: MenuItem[], 
  onClose: () => void,
  onLoginClick: () => void
}) {
  return (
    <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-100 overflow-y-auto">
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close menu"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="px-4 pt-2 pb-12">
        <nav className="flex flex-col space-y-4">
          {items.map((item, idx) => (
            <MobileMenuItem 
              key={idx} 
              item={item} 
              onClose={onClose}
            />
          ))}
          
          <button
            onClick={() => {
              onLoginClick();
              onClose();
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-semibold hover:bg-orange-600 transition mt-6"
          >
            Oturum Aç
          </button>
        </nav>
      </div>
    </div>
  );
}

function MobileMenuItem({ item, onClose }: { item: MenuItem, onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  if (item.children) {
    return (
      <div className="border-b border-gray-700 pb-4">
        <button
          onClick={toggleMenu}
          className="flex justify-between items-center w-full text-left text-lg font-medium text-white py-2"
        >
          {item.title}
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`pl-4 ${isOpen ? 'block' : 'hidden'}`}>
          {item.children.map((child, idx) => (
            <Link
              key={idx}
              href={child.link || '#'}
              onClick={onClose}
              className="block py-2 text-gray-300 hover:text-white"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.link || '#'}
      onClick={onClose}
      className="border-b border-gray-700 text-lg font-medium text-white py-2 hover:text-orange-500 transition"
    >
      {item.title}
    </Link>
  );
}