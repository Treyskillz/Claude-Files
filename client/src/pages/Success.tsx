import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, LibraryBig, PackageCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Success() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container max-w-4xl">
        <Card className="rounded-[2rem] bg-white shadow-xl shadow-zinc-950/10">
          <CardContent className="p-10 text-center md:p-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-700"><CheckCircle2 className="h-11 w-11" /></div>
            <Badge className="mb-5 rounded-full bg-zinc-950 text-white hover:bg-zinc-950">Checkout status</Badge>
            <h1 className="font-[Sora] text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Payment flow completed.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">If Stripe confirmed your purchase, your product record will appear in purchase history after webhook processing. You can also keep creating or exporting Claude-compatible assets right away.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-red-600 hover:bg-red-700"><Link href="/marketplace"><PackageCheck className="mr-2 h-5 w-5" /> View purchases</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white"><Link href="/library"><LibraryBig className="mr-2 h-5 w-5" /> Open library</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white"><Link href="/generator"><Sparkles className="mr-2 h-5 w-5" /> Generate more</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
