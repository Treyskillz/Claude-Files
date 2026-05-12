import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { exportClaudePluginZip, exportToMarkdown, exportToPDF } from "@/lib/export";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle2, Download, ExternalLink, FileArchive, FileDown, Loader2, Package, Send, ShieldCheck, ShoppingCart, Store } from "lucide-react";
import { toast } from "sonner";

type Product = {
  slug: string;
  title: string;
  category: string;
  packageType: "individual" | "bundle" | "one_time_app" | "subscription_monthly" | "subscription_annual";
  priceCents: number;
  description: string;
  includedFiles: string[];
  licenseTerms?: string;
  payoutMode?: string;
  platformFeeBps?: number;
  listingStatus?: string;
};

function formatPrice(cents: number, packageType?: Product["packageType"]) {
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  if (packageType === "subscription_monthly") return `${amount}/mo`;
  if (packageType === "subscription_annual") return `${amount}/yr`;
  return amount;
}

const emptyListing = {
  title: "",
  category: "AI Workflow",
  packageType: "bundle" as Product["packageType"],
  priceCents: 2900,
  description: "",
  includedFiles: "README.md\nskill.md\ninstall-guide.md",
  licenseTerms: "Commercial use license for one purchasing customer. Redistribution is not included unless separately approved.",
};

export default function Marketplace() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const [listing, setListing] = useState(emptyListing);
  const [onboardingFallbackUrl, setOnboardingFallbackUrl] = useState<string | null>(null);
  const catalog = trpc.marketplace.catalog.useQuery();
  const purchases = trpc.marketplace.purchases.useQuery(undefined, { retry: false });
  const sellerStatus = trpc.marketplace.sellerStatus.useQuery(undefined, { enabled: isAuthenticated && !isAdmin, retry: false });
  const connect = trpc.marketplace.startSellerOnboarding.useMutation({
    onSuccess(data: { onboardingUrl?: string; message?: string }) {
      if (data.onboardingUrl) {
        setOnboardingFallbackUrl(data.onboardingUrl);
        toast.success("Redirecting to secure Stripe Connect setup in this tab. Use the backup link if the redirect is blocked.");
        window.location.assign(data.onboardingUrl);
        return;
      }
      toast.success(data.message || "Stripe Connect onboarding is ready.");
      sellerStatus.refetch();
    },
    onError(error: { message?: string }) {
      toast.error(error.message || "Unable to start seller onboarding.");
    },
  });
  const refreshConnect = trpc.marketplace.refreshSellerOnboarding.useMutation({
    onSuccess(data) {
      toast.success(data.onboardingStatus === "complete" ? "Stripe Connect onboarding is complete." : "Stripe Connect status refreshed. Finish any remaining Stripe steps before submitting listings.");
      sellerStatus.refetch();
    },
    onError(error: { message?: string }) {
      toast.error(error.message || "Unable to refresh Stripe Connect status.");
    },
  });
  const submitListing = trpc.marketplace.saveProduct.useMutation({
    onSuccess(_data) {
      toast.success("Listing submitted for admin review.");
      setListing(emptyListing);
      utils.marketplace.catalog.invalidate();
      sellerStatus.refetch();
    },
    onError(error: { message?: string }) {
      toast.error(error.message || "Unable to submit listing.");
    },
  });
  const checkout = trpc.marketplace.checkout.useMutation({
    onSuccess(data) {
      if (data.adminFreeAccess) {
        toast.success(data.message || "Admin access confirmed. No checkout required.");
        return;
      }
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
        toast.success("Stripe Checkout opened in a new tab.");
      }
    },
    onError(error) {
      toast.error(error.message || "Please sign in before checkout.");
    },
  });

  const presets = (catalog.data?.presets || []) as Product[];
  const saved = (catalog.data?.saved || []).map(product => ({
    slug: product.slug,
    title: product.title,
    category: product.category,
    packageType: product.packageType,
    priceCents: product.priceCents,
    description: product.description,
    includedFiles: JSON.parse(product.includedFilesJson || "[]") as string[],
    licenseTerms: product.licenseTerms || undefined,
    payoutMode: product.payoutMode,
    platformFeeBps: product.platformFeeBps,
    listingStatus: product.listingStatus,
  })) as Product[];
  const products = [...presets, ...saved];
  const sellerReady = sellerStatus.data?.onboardingStatus === "complete" && sellerStatus.data?.payoutsEnabled;

  useEffect(() => {
    if (!isAuthenticated) return;
    const params = new URLSearchParams(window.location.search);
    const onboardingResult = params.get("seller_onboarding");
    if (onboardingResult !== "complete" && onboardingResult !== "refresh") return;

    refreshConnect.mutate();
    params.delete("seller_onboarding");
    const nextQuery = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
    // Run only once when the marketplace page is opened from Stripe's return or refresh URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const buildPackageContent = (product: Product) => `# ${product.title}\n\n## Package Summary\n${product.description}\n\n## Package Type\n${product.packageType.replaceAll("_", " ")}\n\n## Category\n${product.category}\n\n## Included Files\n${product.includedFiles.map(file => `- ${file}`).join("\n")}\n\n## License Terms\n${product.licenseTerms || "Commercial use license for the purchasing customer. Owner/admin access is included for internal use and packaging review."}\n\n## Admin Access Note\nThis package was downloaded from the owner/admin version of Skillz Magic AI Studio. Admin access does not create a Stripe checkout session or customer purchase record. Customer accounts continue to use the normal paid checkout flow.`;

  const downloadAdminPackage = (product: Product, format: "markdown" | "pdf" | "zip") => {
    const content = buildPackageContent(product);
    if (format === "markdown") {
      exportToMarkdown(content, product.title);
      return;
    }
    if (format === "pdf") {
      exportToPDF(content, product.title, "Admin Marketplace Package");
      return;
    }
    exportClaudePluginZip({
      title: product.title,
      content,
      assetType: product.packageType === "bundle" ? "bundle" : "skill",
      manifest: {
        productSlug: product.slug,
        packageType: product.packageType,
        category: product.category,
        adminAccess: true,
      },
    });
  };

  const handleListingSubmit = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    submitListing.mutate({
      ...listing,
      includedFiles: listing.includedFiles.split("\n").map(file => file.trim()).filter(Boolean),
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Store className="mr-2 h-4 w-4" /> Stripe-ready digital asset marketplace</Badge>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Sell app access, one-off downloads, subscriptions, and bundles.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Browse approved offers or submit a customer-seller listing for admin review. Connect-enabled approved listings can route the seller share to the seller’s Stripe connected account while the app owner keeps the platform fee.</p>
            <div className="mt-5 max-w-3xl rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              <p className="flex gap-2 font-bold"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Seller payout status</p>
              <p className="mt-2">Customer sellers must complete Stripe Connect onboarding before admin approval. Approved Connect listings are prepared for destination-charge payout routing; admin exports show gross sales, seller share, and app-owner platform fees.</p>
            </div>
            {isAdmin ? (
              <div className="mt-5 flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                <ShieldCheck className="h-4 w-4" /> Admin marketplace access: download package files without opening Stripe checkout.
              </div>
            ) : null}
          </div>
          <div className="rounded-3xl border bg-white p-4 text-sm text-zinc-600 shadow-sm"><strong className="text-zinc-950">Test card:</strong> 4242 4242 4242 4242</div>
        </div>

        <Tabs defaultValue="catalog">
          <TabsList className="mb-6 grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="sell">Sell assets</TabsTrigger>
          </TabsList>
          <TabsContent value="catalog">
            {catalog.isLoading ? <Loader /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map(product => <ProductCard key={product.slug} product={product} loading={checkout.isPending} isAdmin={isAdmin} onBuy={() => checkout.mutate({ slug: product.slug, title: product.title, priceCents: product.priceCents, packageType: product.packageType, description: product.description })} onAdminDownload={format => downloadAdminPackage(product, format)} />)}</div>}
          </TabsContent>
          <TabsContent value="purchases">
            {purchases.error ? <p className="rounded-3xl border bg-white p-8 text-zinc-600">Sign in to view purchase history and download-ready items.</p> : null}
            {purchases.isLoading ? <Loader /> : (
              <div className="grid gap-4">
                {(purchases.data || []).length ? purchases.data?.map(item => (
                  <Card key={item.id} className="rounded-3xl bg-white shadow-sm">
                    <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                      <div><h3 className="font-black text-zinc-950">{item.productTitle}</h3><p className="mt-1 text-sm text-zinc-600">{item.packageType} · {item.fulfillmentStatus} · {item.createdAt ? new Date(Number(item.createdAt)).toLocaleDateString() : "recent"}</p></div>
                      <Button variant="outline" className="rounded-full bg-white"><Download className="mr-2 h-4 w-4" /> Download info</Button>
                    </CardContent>
                  </Card>
                )) : <p className="rounded-3xl border bg-white p-8 text-zinc-600">No completed purchases yet. Buy a product from the catalog to see it here.</p>}
              </div>
            )}
          </TabsContent>
          <TabsContent value="sell">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-3xl bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Stripe Connect seller onboarding</CardTitle>
                  <CardDescription>Connect a seller Stripe account before submitting listings for approval and payout routing.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm leading-6 text-zinc-700">
                  {!isAuthenticated ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><AlertTriangle className="mr-2 inline h-4 w-4" /> Sign in before starting seller onboarding.</p> : null}
                  {sellerStatus.data ? (
                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p><strong className="text-zinc-950">Onboarding:</strong> {sellerStatus.data.onboardingStatus}</p>
                      <p><strong className="text-zinc-950">Charges enabled:</strong> {sellerStatus.data.chargesEnabled ? "Yes" : "No"}</p>
                      <p><strong className="text-zinc-950">Payouts enabled:</strong> {sellerStatus.data.payoutsEnabled ? "Yes" : "No"}</p>
                    </div>
                  ) : <p className="rounded-2xl bg-zinc-50 p-4">Seller onboarding status appears here after sign-in.</p>}
                  <Button className="rounded-full bg-red-600 hover:bg-red-700" disabled={connect.isPending || refreshConnect.isPending} onClick={() => isAuthenticated ? connect.mutate() : (window.location.href = getLoginUrl())}>{connect.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />} Continue in Stripe Connect</Button>
                  {onboardingFallbackUrl ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                      <p className="font-bold">If Stripe did not open, use this backup link.</p>
                      <a className="mt-2 inline-flex items-center gap-2 font-bold underline" href={onboardingFallbackUrl} rel="noreferrer">Open secure Stripe setup <ExternalLink className="h-4 w-4" /></a>
                    </div>
                  ) : null}
                  <p className="text-xs text-zinc-500">The Connect setup now opens in the current tab to avoid popup blocking. Admin approval is still required before a customer-submitted listing appears in the paid catalog.</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Submit listing for admin review</CardTitle>
                  <CardDescription>{sellerReady ? "Your account looks payout-ready. Submit a listing for review." : "Complete Connect onboarding so admins can approve payout-ready listings."}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <input className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Listing title" value={listing.title} onChange={event => setListing(current => ({ ...current, title: event.target.value }))} />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Category" value={listing.category} onChange={event => setListing(current => ({ ...current, category: event.target.value }))} />
                    <select className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" value={listing.packageType} onChange={event => setListing(current => ({ ...current, packageType: event.target.value as Product["packageType"] }))}>
                      <option value="individual">Individual</option>
                      <option value="bundle">Bundle</option>
                      <option value="one_time_app">One-time app</option>
                      <option value="subscription_monthly">Subscription monthly</option>
                      <option value="subscription_annual">Subscription annual</option>
                    </select>
                    <input className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" type="number" min={50} step={100} value={listing.priceCents} onChange={event => setListing(current => ({ ...current, priceCents: Number(event.target.value) }))} />
                  </div>
                  <textarea className="min-h-24 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Description" value={listing.description} onChange={event => setListing(current => ({ ...current, description: event.target.value }))} />
                  <textarea className="min-h-24 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Included files, one per line" value={listing.includedFiles} onChange={event => setListing(current => ({ ...current, includedFiles: event.target.value }))} />
                  <textarea className="min-h-20 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="License terms" value={listing.licenseTerms} onChange={event => setListing(current => ({ ...current, licenseTerms: event.target.value }))} />
                  <Button className="rounded-full bg-red-600 hover:bg-red-700" disabled={submitListing.isPending || !sellerReady} onClick={handleListingSubmit}>{submitListing.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Submit for admin approval</Button>
                  {!sellerReady ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Stripe Connect onboarding must be complete with payouts enabled before the app allows customer listing submission.</p> : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductCard({ product, loading, isAdmin, onBuy, onAdminDownload }: { product: Product; loading: boolean; isAdmin: boolean; onBuy: () => void; onAdminDownload: (format: "markdown" | "pdf" | "zip") => void }) {
  const platformFeePercent = product.platformFeeBps ? product.platformFeeBps / 100 : undefined;
  return (
    <Card className="flex rounded-3xl bg-white shadow-sm">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white"><Package className="h-6 w-6" /></div>
        <div className="flex flex-wrap gap-2"><Badge className="rounded-full bg-red-100 text-red-700 hover:bg-red-100">{product.category}</Badge><Badge variant="outline" className="rounded-full bg-white">{product.packageType.replaceAll("_", " ")}</Badge>{product.payoutMode === "connect_destination" ? <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Seller payout</Badge> : null}</div>
        <CardTitle className="mt-3 text-2xl">{product.title}</CardTitle>
        <CardDescription className="leading-6">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="mb-5 text-4xl font-black tracking-[-0.04em] text-zinc-950">{isAdmin ? "Admin included" : formatPrice(product.priceCents, product.packageType)}</div>
        {platformFeePercent ? <p className="mb-4 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold leading-6 text-emerald-700">Connect sale: seller receives the sale net of the {platformFeePercent}% app-owner platform fee.</p> : null}
        {isAdmin ? <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold leading-6 text-red-700">Owner/admin accounts can download this package for internal review without creating a customer purchase.</p> : null}
        <div className="grid gap-2 text-sm text-zinc-600">
          {product.includedFiles.slice(0, 5).map(file => <p key={file} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /> {file}</p>)}
        </div>
      </CardContent>
      <CardFooter className="grid gap-3">
        {isAdmin ? (
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="rounded-full bg-white text-xs" onClick={() => onAdminDownload("markdown")}><FileDown className="mr-1 h-3.5 w-3.5" /> MD</Button>
            <Button variant="outline" className="rounded-full bg-white text-xs" onClick={() => onAdminDownload("pdf")}><Download className="mr-1 h-3.5 w-3.5" /> PDF</Button>
            <Button variant="outline" className="rounded-full bg-white text-xs" onClick={() => onAdminDownload("zip")}><FileArchive className="mr-1 h-3.5 w-3.5" /> ZIP</Button>
          </div>
        ) : null}
        <Button className="w-full rounded-full bg-red-600 hover:bg-red-700" disabled={loading} onClick={onBuy}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isAdmin ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />} {isAdmin ? "Confirm admin access" : "Buy now"}</Button>
      </CardFooter>
    </Card>
  );
}

function Loader() {
  return <div className="rounded-3xl border bg-white p-10 text-center text-zinc-600"><Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-red-600" /> Loading marketplace data...</div>;
}
