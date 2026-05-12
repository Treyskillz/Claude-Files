import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, CreditCard, LibraryBig, LogIn, LogOut, UserCircle } from "lucide-react";
import { Link } from "wouter";

export default function Account() {
  const { isAuthenticated, logout } = useAuth();
  const purchases = trpc.marketplace.purchases.useQuery(undefined, { retry: false, enabled: isAuthenticated });
  const mine = trpc.generator.listMine.useQuery(undefined, { retry: false, enabled: isAuthenticated });

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8">
          <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><UserCircle className="mr-2 h-4 w-4" /> Creator account</Badge>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Manage your Skillz Magic AI Studio workspace.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Sign in to sync server-saved assets, save marketplace listings, start Stripe Checkout, and view completed purchases.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="premium-card rounded-3xl">
            <CardHeader>
              <CardTitle>{isAuthenticated ? "Account workspace active" : "Sign in to unlock synced features"}</CardTitle>
              <CardDescription>{isAuthenticated ? "Your private account tools, library access, and checkout-enabled features are available." : "Local generation still works, but marketplace saves and checkout require login."}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {isAuthenticated ? (
                <Button variant="outline" className="w-fit rounded-full bg-white" onClick={() => logout()}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
              ) : (
                <Button className="w-fit rounded-full bg-red-600 hover:bg-red-700" onClick={() => (window.location.href = getLoginUrl())}><LogIn className="mr-2 h-4 w-4" /> Sign in</Button>
              )}
              <div className="grid gap-3 pt-3 text-sm text-zinc-600">
                <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /> Local browser library for saved and uploaded resources.</p>
                <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /> Server-backed generated assets after login.</p>
                <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /> Stripe Checkout for marketplace purchases.</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <MetricCard icon={LibraryBig} label="Saved server assets" value={isAuthenticated ? String(mine.data?.length ?? 0) : "Sign in"} href="/library" />
            <MetricCard icon={CreditCard} label="Purchase records" value={isAuthenticated ? String(purchases.data?.length ?? 0) : "Sign in"} href="/marketplace" />
            <WorkflowCard title="Generate" text="Create a new skill, prompt, workflow, or bundle." href="/generator" />
            <WorkflowCard title="Upload" text="Add your own notes and Claude resources." href="/upload" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, href }: { icon: typeof LibraryBig; label: string; value: string; href: string }) {
  return <Card className="rounded-3xl bg-white shadow-sm"><CardContent className="p-6"><Icon className="mb-5 h-8 w-8 text-red-600" /><p className="text-sm font-semibold text-zinc-500">{label}</p><p className="mt-2 text-4xl font-black text-zinc-950">{value}</p><Button asChild variant="outline" className="mt-5 rounded-full bg-white"><Link href={href}>Open</Link></Button></CardContent></Card>;
}

function WorkflowCard({ title, text, href }: { title: string; text: string; href: string }) {
  return <Card className="rounded-3xl bg-zinc-950 text-white shadow-sm"><CardContent className="p-6"><h3 className="text-2xl font-black">{title}</h3><p className="mt-2 leading-7 text-zinc-300">{text}</p><Button asChild className="mt-5 rounded-full bg-red-600 hover:bg-red-700"><Link href={href}>Continue</Link></Button></CardContent></Card>;
}
