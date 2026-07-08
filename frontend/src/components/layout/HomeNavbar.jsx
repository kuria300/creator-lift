import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";

const HomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV_LINKS = [
  { href: "/support", label: "How It Works" },
  { href: "/aboutus", label: "About Us" },
  { href: "/contactus", label: "Contact Us" },
];

  return (
    <header className="relative top-0 left-0 w-full z-50 transition-all duration-300 bg-transparent max-sm:bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-gray-900 font-semibold text-2xl">
          <motion.span initial={{y: -250}} animate={{y:0}} transition={{duration: 2, type: 'spring', bounce: 0.6, stiffness: 120}}>creatorLift</motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="transition hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
        <Link to="/login"
          className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-2 text-sm font-medium text-black transition hover:border-black"
        >
          Login
        </Link>

        <Link to="/choose-role"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
        >
          Get started
        </Link>
      </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="text-gray-700" size={28} />
          ) : (
            <Menu className="text-gray-700" size={28} />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="absolute top-16 w-full md:hidden border-t bg-white shadow-lg z-50">
          <div className="flex flex-col px-6 py-5 gap-5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-black transition"
              >
                {item.label}
              </Link>
            ))}

            <button className="mt-2 rounded-full bg-black px-5 py-3 text-white hover:bg-sky-500 transition">
              Join Now
            </button>
             <button className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-medium text-black transition hover:border-black">
              Login
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default HomeNavbar;