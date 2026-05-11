import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Boxes, CheckCircle2, Download, LibraryBig, PackageCheck, PlugZap, Sparkles, Store } from "lucide-react";
import { Link } from "wouter";

const features = [
  { icon: Sparkles, title: "Custom category generation", text: "Generate complete Master Operating Systems, skills, prompts, workflows, and bundles for preset or manually entered professions, industries, platforms, and niches." },
  { icon: LibraryBig, title: "Resource library", text: "Browse platform guidance links alongside your generated and uploaded assets with clear source labels." },
  { icon: Download, title: "Copy, Markdown, PDF", text: "Copy every asset into your preferred AI workspace, download Markdown, print branded PDFs, or export a platform-ready ZIP package." },
  { icon: Store, title: "Marketplace packaging", text: "Package assets as individual downloads, premium Master Operating Systems, bundles, or subscription-style offers with Stripe Checkout support." },
  { icon: PlugZap, title: "Multi-platform mode", text: "Export manifest metadata and usage guides for Claude, ChatGPT, Manus, Grok/Groq, general AI, or any custom AI platform." },
  { icon: PackageCheck, title: "Retail-ready output", text: "Generate practical titles, descriptions, licenses, included-file lists, previews, category maps, and quality-control checklists." },
];

const stats = [
  ["5", "asset types"],
  ["4", "export paths"],
  ["Custom", "category inputs"],
  ["1-click", "autonomous mode"],
];

function ProductMockup() {
  return (
    <div className="rounded-[1.4rem] bg-zinc-950 p-5 text-white">
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-white p-4 text-zinc-950">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-[Sora] text-lg font-black tracking-[-0.04em]">Skills Magic AI</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">CMOS Builder</p>
          </div>
        </div>
        <Badge className="rounded-full bg-red-100 text-red-700 hover:bg-red-100">Live draft</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">Selected context</p>
          <div className="mt-4 grid gap-3 text-sm">
            {[
              ["Platform", "Custom AI workspace"],
              ["Profession", "Operations consultant"],
              ["Industry", "Professional services"],
              ["Asset", "Master Operating System"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="mt-1 font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 text-zinc-950">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Recommended asset map</p>
          <h3 className="mt-3 font-[Sora] text-2xl font-black tracking-[-0.04em]">Multi-platform operating system package</h3>
          <div className="mt-5 grid gap-3">
            {["Category map", "Core instructions", "Prompt library", "Workflow SOP", "QA checklist", "Marketplace listing"].map(item => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-red-600" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MagicIcon() {
  return (
    <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-red-600 shadow-xl shadow-black/20">
      <Sparkles className="h-9 w-9" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="brand-gradient">
      <section className="container grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
        <div>
          <Badge className="mb-6 rounded-full border-red-200 bg-white px-4 py-2 text-red-700 hover:bg-white">
              <Sparkles className="mr-2 h-4 w-4" /> Retail-ready multi-platform AI asset generation
          </Badge>
          <h1 className="max-w-4xl font-[Sora] text-5xl font-black leading-[0.94] tracking-[-0.06em] text-zinc-950 md:text-7xl">
            Create multi-platform Master Operating Systems, skills, prompts, workflows, and sellable bundles in minutes.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl">
            <strong>Skills Magic AI</strong> is a professional generator and storefront toolkit for building copy-ready AI assets for Claude, ChatGPT, Manus, Grok/Groq, general AI, or custom platforms, exporting them as Markdown or PDF, packaging them as ZIPs, and preparing marketplace downloads with Stripe.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-red-600 px-7 text-base text-white hover:bg-red-700">
              <Link href="/generator">
                Generate instantly <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-white px-7 text-base">
              <Link href="/marketplace">View marketplace</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border bg-white/90 p-4 shadow-sm">
                <div className="text-2xl font-black text-zinc-950">{value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-full bg-red-600/15 blur-2xl lg:block" />
          <Card className="overflow-hidden rounded-[2rem] border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10">
            <CardContent className="p-3">
              <ProductMockup />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-5 rounded-full bg-zinc-950 text-white hover:bg-zinc-950">Built for creators, consultants, and teams</Badge>
            <h2 className="font-[Sora] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950 md:text-5xl">
              A complete production line for custom AI operating systems and digital assets.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              The app combines autonomous generation, assisted strategy inputs, custom category entry, platform-aware exports, user imports, branded documents, and checkout-ready marketplace packaging in a single workflow.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <Card key={feature.title} className="premium-card rounded-3xl">
                <CardContent className="p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-950">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-600">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <MagicIcon />
            <h2 className="font-[Sora] text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">From idea to packaged product.</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              Skills Magic AI is designed for users who want output they can use, sell, or adapt immediately, with black-on-light readable
              documents and red-accented brand polish.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-red-600 hover:bg-red-700">
              <Link href="/generator">Open the generator</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {[
              "Choose one-click autonomous generation or add role, industry, audience, goals, constraints, and monetization details.",
              "Preview clean Markdown output, copy it into the chosen AI platform, save it to the library, or package it with manifest and usage guide files.",
              "Create marketplace listings for individual assets or curated bundles, then send buyers through Stripe Checkout.",
            ].map(step => (
              <div key={step} className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-red-400" />
                <p className="leading-7 text-zinc-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container rounded-[2rem] border bg-zinc-50 p-8 shadow-sm md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge className="mb-5 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Boxes className="mr-2 h-4 w-4" /> Marketplace-ready</Badge>
              <h2 className="font-[Sora] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950">Build, package, publish, and sell your custom AI asset catalog.</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
                Start with the generator, add preset or custom category context, browse resource references, and package finished assets into downloads with clear product metadata, licensing, and purchase history.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="rounded-full bg-red-600 hover:bg-red-700">
                <Link href="/generator">Generate an asset</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white">
                <Link href="/library">Browse library</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
