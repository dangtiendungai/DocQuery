import Link from "next/link";

const productLinks = [
  { label: "Overview", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "Roadmap", href: "/roadmap" },
];

const resourcesLinks = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/api" },
  { label: "Playground", href: "/playground" },
  { label: "Support", href: "/support" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pt-12 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center text-xl font-semibold text-white">
              Doc
              <span className="text-emerald-300">Query</span>
            </div>
            <p className="max-w-xs text-sm text-slate-400">
              Retrieval-augmented answers for every document your team trusts.
              Upload, ask, and share with grounded citations.
            </p>
          </div>
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Resources" links={resourcesLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DocQuery Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="transition hover:text-white" href="#">
              Privacy
            </Link>
            <Link className="transition hover:text-white" href="#">
              Terms
            </Link>
            <Link className="transition hover:text-white" href="#">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
        {title}
      </p>
      <ul className="space-y-2 text-slate-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
