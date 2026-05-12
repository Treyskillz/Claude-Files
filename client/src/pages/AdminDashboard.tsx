import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, BarChart3, CheckCircle2, Loader2, Lock, PackageCheck, ShieldCheck, Store, UploadCloud } from "lucide-react";
import { Link } from "wouter";

function formatMoney(cents = 0) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const dashboard = trpc.admin.dashboard.useQuery(undefined, { enabled: isAdmin, retry: false });

  if (loading) {
    return <div className="min-h-screen bg-zinc-50 py-16"><div className="container"><StatusCard icon={<Loader2 className="h-6 w-6 animate-spin" />} title="Checking admin access" text="Verifying your owner/admin session before loading publishing controls." /></div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container max-w-3xl">
          <StatusCard icon={<Lock className="h-6 w-6" />} title="Sign in required" text="The admin dashboard is not a public customer page. Sign in with the project owner/admin account to continue." />
          <Button className="mt-6 rounded-full bg-red-600 hover:bg-red-700" onClick={() => (window.location.href = getLoginUrl())}>Sign in as admin</Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container max-w-3xl">
          <StatusCard icon={<ShieldCheck className="h-6 w-6" />} title="Admin access only" text="This route is protected in the browser and on the server. Customer accounts cannot view dashboard data or publish marketplace packages by typing the URL." />
          <Button asChild variant="outline" className="mt-6 rounded-full bg-white"><Link href="/marketplace">Return to marketplace</Link></Button>
        </div>
      </div>
    );
  }

  if (dashboard.isLoading) {
    return <div className="min-h-screen bg-zinc-50 py-16"><div className="container"><StatusCard icon={<Loader2 className="h-6 w-6 animate-spin" />} title="Loading admin dashboard" text="Collecting package, purchase, and Builder activity." /></div></div>;
  }

  if (dashboard.error) {
    return <div className="min-h-screen bg-zinc-50 py-16"><div className="container"><StatusCard icon={<AlertTriangle className="h-6 w-6" />} title="Dashboard unavailable" text={dashboard.error.message} /></div></div>;
  }

  const data = dashboard.data;

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-100"><ShieldCheck className="mr-2 h-4 w-4" /> Owner/admin dashboard</Badge>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Control marketplace packages, publishing, and seller-readiness.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">This page is visible only to owner/admin accounts. It summarizes saved marketplace products, recent purchase records, generated assets, and the current payout model so customer-facing commerce remains separated from admin operations.</p>
          </div>
          <Button asChild className="rounded-full bg-red-600 hover:bg-red-700"><Link href="/generator"><UploadCloud className="mr-2 h-4 w-4" /> Generate and publish package</Link></Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Metric title="Saved listings" value={data?.summary.savedProducts ?? 0} detail={`${data?.summary.presetProducts ?? 0} preset offers also shown`} icon={<Store className="h-5 w-5" />} />
          <Metric title="Recent purchases" value={data?.summary.recentPurchases ?? 0} detail={`${data?.summary.readyPurchases ?? 0} ready · ${data?.summary.pendingPurchases ?? 0} pending`} icon={<PackageCheck className="h-5 w-5" />} />
          <Metric title="Builder assets" value={data?.summary.generatedAssets ?? 0} detail="Latest generated assets in storage metadata" icon={<BarChart3 className="h-5 w-5" />} />
          <Metric title="Saved catalog value" value={formatMoney(data?.summary.catalogListValueCents ?? 0)} detail="List price total for saved listings" icon={<CheckCircle2 className="h-5 w-5" />} />
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle>How customer-seller payouts work today</CardTitle>
              <CardDescription>Use this guidance before allowing customers to sell their own packages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm leading-6 text-zinc-700">
              <p><strong className="text-zinc-950">Current status:</strong> {data?.payoutGuidance.currentStatus}</p>
              <p><strong className="text-zinc-950">What is required:</strong> {data?.payoutGuidance.requiredNextStep}</p>
              <p><strong className="text-zinc-950">Customer expectation:</strong> {data?.payoutGuidance.sellerExpectation}</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-red-100 bg-red-50/70 shadow-sm">
            <CardHeader>
              <CardTitle>One-click publish workflow</CardTitle>
              <CardDescription>Generate a package in the Builder, then use the admin-only “Publish package” button in the output toolbar.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-6 text-zinc-700">
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" /> The publish API rejects non-admin users even if they call it directly.</p>
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" /> Published packages appear in Marketplace as paid listings for customers.</p>
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" /> Admin accounts still receive included downloads without creating a customer purchase.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <ActivityList title="Recent saved marketplace listings" empty="No saved listings yet." items={(data?.products || []).map(product => ({ title: product.title, meta: `${product.packageType} · ${formatMoney(product.priceCents)}`, detail: product.category }))} />
          <ActivityList title="Recent purchase records" empty="No purchase records yet." items={(data?.purchases || []).map(purchase => ({ title: purchase.productTitle, meta: `${purchase.packageType} · ${purchase.fulfillmentStatus}`, detail: purchase.createdAt ? new Date(Number(purchase.createdAt)).toLocaleString() : "Recent" }))} />
          <ActivityList title="Recent Builder assets" empty="No generated assets yet." items={(data?.generatedAssets || []).map(asset => ({ title: asset.title, meta: `${asset.assetType} · ${asset.source}`, detail: asset.createdAt ? new Date(asset.createdAt).toLocaleString() : "Recent" }))} />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardContent className="p-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">{icon}</div>
        <h1 className="text-3xl font-black tracking-[-0.04em] text-zinc-950">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-zinc-600">{text}</p>
      </CardContent>
    </Card>
  );
}

function Metric({ title, value, detail, icon }: { title: string; value: string | number; detail: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">{icon}</div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</p>
        <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-zinc-950">{value}</p>
        <p className="mt-2 text-sm text-zinc-600">{detail}</p>
      </CardContent>
    </Card>
  );
}

function ActivityList({ title, empty, items }: { title: string; empty: string; items: Array<{ title: string; meta: string; detail: string }> }) {
  return (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length ? items.map(item => (
          <div key={`${item.title}-${item.meta}`} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="font-bold text-zinc-950">{item.title}</p>
            <p className="mt-1 text-sm text-zinc-600">{item.meta}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">{item.detail}</p>
          </div>
        )) : <p className="rounded-2xl border border-dashed bg-zinc-50 p-5 text-sm text-zinc-600">{empty}</p>}
      </CardContent>
    </Card>
  );
}
