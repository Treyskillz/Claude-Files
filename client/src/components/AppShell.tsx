import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Menu, ShieldCheck, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex w-max items-center gap-2" aria-label="Skillz Magic AI Studio">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm shadow-red-600/20">
        <Sparkles className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="whitespace-nowrap text-base font-black tracking-[-0.04em] text-zinc-950">Skillz Magic</div>
          <div className="whitespace-nowrap text-[0.65rem] font-bold uppercase tracking-[0.18em] text-red-600">AI Studio</div>
        </div>
      )}
    </div>
  );
}

const desktopNavItems = [
  { href: "/generator", label: "Builder" },
  { href: "/instructions", label: "Instructions" },
  { href: "/library", label: "Library" },
  { href: "/upload", label: "Upload" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/pricing", label: "Pricing" },
];

const mobileNavItems = [{ href: "/", label: "Home" }, ...desktopNavItems];

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const [location] = useLocation();
  return (
    <nav className={mobile ? "grid gap-2" : "hidden min-w-0 items-center justify-center gap-1 2xl:flex"}>
      {(mobile ? mobileNavItems : desktopNavItems).map(item => {
        const active = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition 2xl:px-4 ${
              active ? "bg-red-600 text-white shadow-sm" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-white/88 backdrop-blur-xl">
        <div className="container flex min-h-20 items-center gap-5 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Skillz Magic AI Studio home">
            <BrandMark />
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center 2xl:flex">
            <NavLinks />
          </div>
          <div className="hidden shrink-0 items-center gap-3 2xl:flex">
            {isAdmin ? (
              <>
                <Link href="/admin" className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700 hover:bg-red-100">
                  <LayoutDashboard className="mr-1.5 h-4 w-4" /> Admin dashboard
                </Link>
                <Badge variant="outline" className="rounded-full border-red-200 bg-red-50 px-3 py-1.5 text-red-700">
                  <ShieldCheck className="mr-1.5 h-4 w-4" /> Admin access
                </Badge>
              </>
            ) : null}
            {isAuthenticated ? (
              <>
                <Link href="/account" className="text-sm font-semibold text-zinc-700 hover:text-red-600">
                  Account
                </Link>
                <Button variant="outline" onClick={() => logout()} className="rounded-full bg-white">
                  Sign out
                </Button>
              </>
            ) : (
              <Button className="rounded-full bg-zinc-950 text-white hover:bg-red-700" onClick={() => (window.location.href = getLoginUrl())}>
                Sign in
              </Button>
            )}
            <Button asChild className="rounded-full bg-red-600 text-white hover:bg-red-700">
              <Link href="/generator">
                  <Sparkles className="mr-2 h-4 w-4" /> Build an asset
              </Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto bg-white 2xl:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white p-6">
              <div className="mb-8">
                <BrandMark />
              </div>
              <NavLinks mobile />
              <div className="mt-8 grid gap-3">
                {isAdmin ? (
                  <>
                    <Button asChild variant="outline" className="justify-start rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
                      <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin dashboard</Link>
                    </Button>
                    <Badge variant="outline" className="w-fit rounded-full border-red-200 bg-red-50 px-3 py-1.5 text-red-700">
                      <ShieldCheck className="mr-1.5 h-4 w-4" /> Admin access enabled
                    </Badge>
                  </>
                ) : null}
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/generator">Build an asset</Link>
                </Button>
                {isAuthenticated ? (
                  <Button variant="outline" onClick={() => logout()} className="bg-white">
                    Sign out
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => (window.location.href = getLoginUrl())} className="bg-white">
                    Sign in
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-white">
        <div className="container grid gap-6 py-10 text-sm text-zinc-600 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="mb-4"><BrandMark /></div>
            <p className="max-w-xl leading-6">
              Skillz Magic AI Studio helps creators, consultants, agencies, and teams generate multi-platform AI operating assets, prompt systems, workflows, PDF exports, and marketplace-ready bundles with clear instructions and a clean professional brand system.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-zinc-950">Build</h3>
            <p>Multi-platform Master Operating Systems, autonomous generator, assisted forms, custom categories, uploads, instructions, and resource library.</p>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-zinc-950">Sell</h3>
            <p>Bundle assets, compare one-time app access, subscriptions, and one-off downloads, then route purchases through Stripe Checkout.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
