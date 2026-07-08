import { Link } from "react-router-dom";

const footerLinks = [
  {
    name: "Privacy",
    href: "/privacy",
  },
  {
    name: "Terms",
    href: "/terms",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white py-12 text-neutral-600">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <Link href="/" className="flex items-center gap-2 text-black">
          <span className="font-semibold">creatorLift</span>
        </Link>

        <nav className="flex flex-wrap gap-6 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} creatorLift.
        </p>
      </div>
    </footer>
  );
}