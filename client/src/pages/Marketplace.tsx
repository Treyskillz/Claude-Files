import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Download, Loader2, Package, ShoppingCart, Store } from "lucide-react";
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
  const catalog = trpc.marketplace.catalog.useQuery();
  const purchases = trpc.marketplace.purchases.useQuery(undefined, { retry: false });
  const checkout = trpc.marketplace.checkout.useMutation({
    onSuccess(data) {
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

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Store className="mr-2 h-4 w-4" /> Stripe-ready digital asset marketplace</Badge>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Sell app access, one-off downloads, subscriptions, and bundles.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Browse preset pricing offers and generated listings. Checkout opens securely through Stripe, while purchase records track fulfillment and download readiness for one-time app access, subscriptions, and category-specific assets.</p>
          </div>
          <div className="rounded-3xl border bg-white p-4 text-sm text-zinc-600 shadow-sm"><strong className="text-zinc-950">Test card:</strong> 4242 4242 4242 4242</div>
        </div>

        <Tabs defaultValue="catalog">
          <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-2">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>
          <TabsContent value="catalog">
            {catalog.isLoading ? <Loader /> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map(product => <ProductCard key={product.slug} product={product} loading={checkout.isPending} onBuy={() => checkout.mutate({ slug: product.slug, title: product.title, priceCents: product.priceCents, packageType: product.packageType, description: product.description })} />)}</div>}
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

function ProductCard({ product, loading, onBuy }: { product: Product; loading: boolean; onBuy: () => void }) {
  return (
    <Card className="flex rounded-3xl bg-white shadow-sm">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white"><Package className="h-6 w-6" /></div>
        <div className="flex flex-wrap gap-2"><Badge className="rounded-full bg-red-100 text-red-700 hover:bg-red-100">{product.category}</Badge><Badge variant="outline" className="rounded-full bg-white">{product.packageType.replaceAll("_", " ")}</Badge></div>
        <CardTitle className="mt-3 text-2xl">{product.title}</CardTitle>
        <CardDescription className="leading-6">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="mb-5 text-4xl font-black tracking-[-0.04em] text-zinc-950">{formatPrice(product.priceCents, product.packageType)}</div>
        <div className="grid gap-2 text-sm text-zinc-600">
          {product.includedFiles.slice(0, 5).map(file => <p key={file} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /> {file}</p>)}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-full bg-red-600 hover:bg-red-700" disabled={loading} onClick={onBuy}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />} Buy now</Button>
      </CardFooter>
    </Card>
  );
}

function Loader() {
  return <div className="rounded-3xl border bg-white p-10 text-center text-zinc-600"><Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-red-600" /> Loading marketplace data...</div>;
}
