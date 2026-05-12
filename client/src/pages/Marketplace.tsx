import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportClaudePluginZip, exportToMarkdown, exportToPDF } from "@/lib/export";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle2, Download, FileArchive, FileDown, Loader2, Package, ShieldCheck, ShoppingCart, Store } from "lucide-react";
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
};

function formatPrice(cents: number, packageType?: Product["packageType"]) {
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
  if (packageType === "subscription_monthly") return `${amount}/mo`;
  if (packageType === "subscription_annual") return `${amount}/yr`;
  return amount;
}

export default function Marketplace() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const catalog = trpc.marketplace.catalog.useQuery();
  const purchases = trpc.marketplace.purchases.useQuery(undefined, { retry: false });
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
  })) as Product[];
  const products = [...presets, ...saved];

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

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Store className="mr-2 h-4 w-4" /> Stripe-ready digital asset marketplace</Badge>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Sell app access, one-off downloads, subscriptions, and bundles.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Browse preset pricing offers and generated listings. Checkout opens securely through Stripe, while purchase records track fulfillment and download readiness for one-time app access, subscriptions, and category-specific assets.</p>
            <div className="mt-5 max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <p className="flex gap-2 font-bold"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Seller payout status</p>
              <p className="mt-2">Customer-created marketplace listings can be saved for admin review, but automatic customer-seller payouts are not enabled yet. Today, Stripe Checkout routes payments to the platform account. To pay outside sellers automatically, the app needs Stripe Connect onboarding, seller connected-account IDs, and transfer/destination-charge logic.</p>
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
          <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-2">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}

function ProductCard({ product, loading, isAdmin, onBuy, onAdminDownload }: { product: Product; loading: boolean; isAdmin: boolean; onBuy: () => void; onAdminDownload: (format: "markdown" | "pdf" | "zip") => void }) {
  return (
    <Card className="flex rounded-3xl bg-white shadow-sm">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white"><Package className="h-6 w-6" /></div>
        <div className="flex flex-wrap gap-2"><Badge className="rounded-full bg-red-100 text-red-700 hover:bg-red-100">{product.category}</Badge><Badge variant="outline" className="rounded-full bg-white">{product.packageType.replaceAll("_", " ")}</Badge></div>
        <CardTitle className="mt-3 text-2xl">{product.title}</CardTitle>
        <CardDescription className="leading-6">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="mb-5 text-4xl font-black tracking-[-0.04em] text-zinc-950">{isAdmin ? "Admin included" : formatPrice(product.priceCents, product.packageType)}</div>
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
