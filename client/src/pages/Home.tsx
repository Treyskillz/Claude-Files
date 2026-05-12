import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Download,
  FileArchive,
  Layers3,
  LibraryBig,
  PackageCheck,
  PlugZap,
  Sparkles,
  Store,
  Wand2,
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: Wand2,
    title: "Custom category generation",
    text: "Create structured prompts, workflows, skills, and operating-system packages from clear business context, preset categories, or a custom niche instead of starting from a blank page.",
  },
  {
    icon: PlugZap,
    title: "Multi-platform output",
    text: "Prepare assets for Claude, ChatGPT, Manus, Grok/Groq, general AI tools, or a custom platform workflow.",
  },
  {
    icon: LibraryBig,
    title: "Saved resource library",
    text: "Keep generated and uploaded resources organized so creators, consultants, and teams can return to useful assets quickly.",
  },
  {
    icon: Download,
    title: "Copy, Markdown, PDF, and ZIP",
    text: "Move finished work into documents, AI workspaces, client folders, marketplace listings, or buyer-ready download packages.",
  },
  {
    icon: Store,
    title: "Marketplace packaging",
    text: "Draft product titles, descriptions, included-file lists, usage notes, license language, and checkout-ready offers.",
  },
  {
    icon: PackageCheck,
    title: "Retail-ready structure",
    text: "Package assets with instructions, quality-control checkpoints, and clear customer value instead of isolated prompt snippets.",
  },
];

const workflow = [
  ["01", "Choose the use case", "Select a platform, profession, industry, business type, asset format, or enter a custom niche."],
  ["02", "Generate the package", "Build a structured AI operating asset with prompts, workflows, usage guidance, and monetization notes."],
  ["03", "Package and sell", "Export Markdown, PDF, ZIP, and listing copy so the result can be used, delivered, or sold."],
];

const packageItems = [
  "Web app source package in GitHub",
  "Generator, library, upload, marketplace, pricing, and instructions pages",
  "Stripe-ready checkout foundation for paid offers",
  "Markdown, PDF, ZIP, copy, and buyer-ready asset export paths",
  "Owner marketing package and viability assessment delivered separately",
  "Deployment handoff guide for Manus publishing and future migration",
];

function ProductPreview() {
  const rows = [
    ["Platform", "Claude, ChatGPT, Manus, or custom"],
    ["Asset", "Master Operating System package"],
    ["Output", "Prompts, SOPs, workflows, guide, listing"],
  ];

  return (
    <div className="mx-auto w-full max-w-[500px] rounded-[1.75rem] border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-950/8 lg:mx-0 lg:justify-self-end xl:max-w-[540px]">
      <div className="rounded-[1.35rem] border border-zinc-200 bg-zinc-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm shadow-red-600/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black tracking-[-0.02em] text-zinc-950">Skills Magic AI</p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Product builder</p>
            </div>
          </div>
          <Badge className="rounded-full bg-white text-zinc-700 shadow-sm hover:bg-white">Draft ready</Badge>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[0.82fr_1.18fr] lg:grid-cols-1 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="grid gap-3">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-zinc-950">{value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Included deliverables</p>
            <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-zinc-950">A complete AI asset package, not a loose prompt.</h3>
            <div className="mt-5 grid gap-3">
              {["Category strategy", "Core instructions", "Prompt system", "Workflow SOP", "QA checklist", "Marketplace listing"].map(item => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 text-sm font-semibold text-zinc-800">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-red-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white text-zinc-950">
      <section className="site-hero relative overflow-hidden border-b border-zinc-200">
        <div className="container grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div className="max-w-2xl">
            <Badge className="mb-6 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 shadow-sm hover:bg-white">
              <Sparkles className="mr-2 h-4 w-4" /> Professional AI asset packaging system
            </Badge>
            <h1 className="max-w-xl text-4xl font-black leading-[1.12] tracking-[-0.03em] text-zinc-950 sm:text-[2.75rem] lg:text-[2.95rem] xl:text-[3.1rem]">
              Build structured AI products, workflow kits, and sellable asset bundles from one clean workspace.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600 sm:text-lg">
              <strong>Skills Magic AI</strong> helps creators, consultants, agencies, and operators generate practical AI assets for real business use: prompts, skills, workflows, Master Operating Systems, usage guides, marketplace copy, and export-ready files.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 rounded-full bg-red-600 px-7 text-base font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">
                <Link href="/generator">
                  Start building <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-zinc-300 bg-white px-7 text-base font-bold text-zinc-950 hover:bg-zinc-50">
                <Link href="/pricing">View packages</Link>
              </Button>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {[
                ["Use", "Deploy assets inside real AI workflows."],
                ["Sell", "Package assets as digital products."],
                ["Scale", "Repeat the process across niches."],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-red-600">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section id="features" className="py-18 lg:py-22">
        <div className="container">
          <div className="max-w-3xl">
            <Badge className="mb-5 rounded-full bg-zinc-950 px-4 py-2 text-white hover:bg-zinc-950">Clean product workflow</Badge>
            <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-zinc-950 md:text-5xl">
              Modern tools for turning AI ideas into organized, usable, and sellable assets.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              The app is designed to reduce blank-page friction, improve output structure, and make generated assets easier to deliver to clients, buyers, or internal teams.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <Card key={feature.title} className="premium-card rounded-[1.5rem] border-zinc-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/8">
                <CardContent className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-[-0.02em] text-zinc-950">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-600">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-18 lg:py-22">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge className="mb-5 rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-100">
              <Layers3 className="mr-2 h-4 w-4" /> Simple production workflow
            </Badge>
            <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-zinc-950 md:text-5xl">From niche idea to packaged product in three clear steps.</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Skills Magic AI keeps the experience focused: define the use case, generate the asset package, then export or prepare it for sale.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 rounded-full bg-red-600 px-7 font-bold text-white hover:bg-red-700">
              <Link href="/instructions">See how it works</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {workflow.map(([number, title, text]) => (
              <div key={number} className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-sm sm:grid-cols-[auto_1fr]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-black text-white">{number}</div>
                <div>
                  <h3 className="text-xl font-black tracking-[-0.02em] text-zinc-950">{title}</h3>
                  <p className="mt-2 leading-7 text-zinc-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-18 lg:py-22">
        <div className="container">
          <div className="grid gap-10 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/6 md:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <Badge className="mb-5 rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-100">
                <Boxes className="mr-2 h-4 w-4" /> Packaged for sale and handoff
              </Badge>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-zinc-950 md:text-5xl">A cleaner product site plus a sellable app package.</h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                The app is being prepared as a retail-ready software product with a modern public website, working generator flow, checkout foundation, documentation, GitHub source package, and separate owner-facing marketing and viability materials.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-red-600 px-7 font-bold text-white hover:bg-red-700">
                  <Link href="/generator">Open generator</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-zinc-300 bg-white px-7 font-bold text-zinc-950 hover:bg-zinc-50">
                  <Link href="/marketplace">Review marketplace</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                  <FileArchive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-[-0.02em] text-zinc-950">Package contents</p>
                  <p className="text-sm text-zinc-600">Owner-facing handoff and buyer-ready app structure</p>
                </div>
              </div>
              <div className="grid gap-3">
                {packageItems.map(item => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <p className="text-sm font-semibold leading-6 text-zinc-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
