import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { assetNeedMap, defaultNeeds } from "@/lib/categoryStrategy";
import { CheckCircle2, Crown, Download, Layers3, Loader2, Sparkles, Tags } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

type PackageType = "individual" | "bundle" | "one_time_app" | "subscription_monthly" | "subscription_annual";

type Plan = {
  slug: string;
  name: string;
  eyebrow: string;
  packageType: PackageType;
  priceCents: number;
  cadence: string;
  description: string;
  bestFor: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    slug: "profession-prompt-pack",
    name: "One-Off Prompt Pack",
    eyebrow: "Entry download",
    packageType: "individual",
    priceCents: 1900,
    cadence: "one download",
    description: "A focused profession or industry prompt system for buyers who need one practical asset immediately.",
    bestFor: "New buyers, lead magnets, low-friction checkout, and niche problem solving.",
    features: ["Copy-ready prompts", "Profession or industry focus", "Quality checklist", "Commercial use license"],
    cta: "Buy one-off pack",
  },
  {
    slug: "industry-platform-skill-pack",
    name: "Industry Platform Skill Package",
    eyebrow: "Premium download",
    packageType: "individual",
    priceCents: 3900,
    cadence: "one download",
    description: "A platform-ready skill package with SKILL.md, manifest, usage guide, examples, and category fit notes.",
    bestFor: "Professionals who want a practical AI platform tool rather than a generic prompt list.",
    features: ["SKILL.md included", "Manifest and usage guide", "Category asset map", "PDF-ready documentation"],
    cta: "Buy skill package",
    highlighted: true,
  },
  {
    slug: "workflow-automation-blueprint",
    name: "Workflow Blueprint",
    eyebrow: "Operations download",
    packageType: "individual",
    priceCents: 4900,
    cadence: "one download",
    description: "A professional workflow system with triggers, inputs, decision points, QA rules, and escalation steps.",
    bestFor: "Service businesses that need repeatable delivery, intake, follow-up, or operations workflows.",
    features: ["SOP structure", "Decision and QA rules", "Handoff checklist", "Implementation notes"],
    cta: "Buy workflow",
  },
  {
    slug: "multi-platform-master-operating-system",
    name: "Multi-Platform Master Operating System",
    eyebrow: "Premium operating system",
    packageType: "individual",
    priceCents: 14900,
    cadence: "one download",
    description: "A complete Master Operating System for one profession, industry, business type, or custom niche, adapted for Claude, ChatGPT, Manus, Grok/Groq, general AI, or a custom platform.",
    bestFor: "Consultants, creators, agencies, and operators who want a complete category-specific implementation system rather than a single prompt or skill.",
    features: ["Category map", "Skills + prompts + workflows", "SOPs and QA rules", "Platform adaptation guide"],
    cta: "Buy Master OS",
    highlighted: true,
  },
  {
    slug: "profession-business-bundle",
    name: "Profession Business Bundle",
    eyebrow: "Best package value",
    packageType: "bundle",
    priceCents: 9900,
    cadence: "one bundle",
    description: "A packaged set of skills, prompts, workflows, listing copy, and license-ready templates for a specific profession.",
    bestFor: "Creators selling niche AI asset kits or operators buying a complete implementation package.",
    features: ["Skill + prompt + workflow set", "Sales-page copy", "License template", "Bundle index and asset map"],
    cta: "Buy bundle",
  },
  {
    slug: "skills-magic-ai-lifetime",
    name: "Lifetime App Access",
    eyebrow: "One-time app fee",
    packageType: "one_time_app",
    priceCents: 14900,
    cadence: "one-time",
    description: "A one-time app access option for solo creators who want category generation, local library, and export tools without recurring billing.",
    bestFor: "Buyers who dislike subscriptions and want to own the creation workflow upfront.",
    features: ["Generator access", "Local resource library", "Markdown/PDF exports", "Platform-ready ZIP packaging"],
    cta: "Buy lifetime access",
  },
  {
    slug: "skills-magic-pro-monthly",
    name: "Pro Monthly",
    eyebrow: "Subscription",
    packageType: "subscription_monthly",
    priceCents: 2900,
    cadence: "per month",
    description: "Recurring access for creators and small teams building profession-specific and custom-category AI assets over time.",
    bestFor: "Users who generate assets every week and want ongoing improvements and category templates.",
    features: ["Monthly generator access", "Category template library", "Marketplace packaging", "New playbooks as released"],
    cta: "Start monthly",
    highlighted: true,
  },
  {
    slug: "skills-magic-pro-annual",
    name: "Pro Annual",
    eyebrow: "Subscription value",
    packageType: "subscription_annual",
    priceCents: 29000,
    cadence: "per year",
    description: "Annual access priced at roughly two months free versus monthly billing, for committed creators and teams.",
    bestFor: "Higher-intent buyers, agencies, consultants, and operators building a repeatable AI asset library.",
    features: ["Annual generator access", "Priority template library", "Commercial packaging support", "Lower effective monthly cost"],
    cta: "Start annual",
  },
];

function formatPrice(cents: number, cadence: string) {
  return `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100)} ${cadence}`;
}

export default function Pricing() {
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

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Tags className="mr-2 h-4 w-4" /> Competitive pricing model</Badge>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Sell the app, sell subscriptions, and sell one-off downloads.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
              Skills Magic AI uses a hybrid monetization model: affordable one-off downloads for quick purchases, a higher-value bundle tier, a one-time app access offer for subscription-resistant buyers, and monthly or annual subscriptions for recurring creation.
            </p>
          </div>
          <Card className="rounded-3xl border-red-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-red-600" /> Recommended anchor</CardTitle>
              <CardDescription className="leading-6">Lead with Pro Monthly at $29/month, use the $149 Master Operating System as the premium one-off anchor, then present $149 lifetime access and $19–$99 downloads as flexible conversion options.</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map(plan => (
            <Card key={plan.slug} className={`flex rounded-3xl bg-white shadow-sm ${plan.highlighted ? "border-red-300 ring-2 ring-red-100" : ""}`}>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  {plan.packageType === "bundle" ? <Layers3 className="h-6 w-6" /> : plan.packageType === "individual" ? <Download className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                </div>
                <Badge className="w-fit rounded-full bg-red-100 text-red-700 hover:bg-red-100">{plan.eyebrow}</Badge>
                <CardTitle className="mt-3 text-2xl">{plan.name}</CardTitle>
                <CardDescription className="leading-6">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex grow flex-col">
                <div className="mb-4 text-4xl font-black tracking-[-0.04em] text-zinc-950">{formatPrice(plan.priceCents, plan.cadence)}</div>
                <p className="mb-5 rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700"><strong className="text-zinc-950">Best for:</strong> {plan.bestFor}</p>
                <div className="mb-6 grid gap-2 text-sm text-zinc-600">
                  {plan.features.map(feature => <p key={feature} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" /> {feature}</p>)}
                </div>
                <Button className="mt-auto rounded-full bg-red-600 text-white hover:bg-red-700" disabled={checkout.isPending} onClick={() => checkout.mutate({ slug: plan.slug, title: plan.name, priceCents: plan.priceCents, packageType: plan.packageType, description: plan.description })}>
                  {checkout.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="rounded-3xl bg-zinc-950 text-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Pricing logic</CardTitle>
              <CardDescription className="text-zinc-300">The model creates a ladder from low-risk downloads to higher-retention subscriptions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-6 text-zinc-200">
              <p><strong className="text-white">$19</strong> prompt packs reduce purchase friction and work well for paid ads, email offers, and marketplace entry products.</p>
              <p><strong className="text-white">$39–$49</strong> skills and workflows feel more premium because they save setup time and provide implementation structure.</p>
              <p><strong className="text-white">$99</strong> bundles improve average order value by packaging a complete professional system.</p>
              <p><strong className="text-white">$149</strong> Master Operating Systems create a premium one-off offer for custom category maps, SOPs, prompts, skills, workflows, QA rules, and platform adaptation guidance.</p>
              <p><strong className="text-white">$29/month or $290/year</strong> positions the app as a practical creator tool rather than a high-risk enterprise platform.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Category-based download price guide</CardTitle>
              <CardDescription>Higher-compliance or higher-value professions can support higher one-off pricing because the assets map directly to revenue, risk reduction, or time savings. Custom professions, industries, platforms, and asset categories use the default guide until enough context is entered for a premium strategy.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {Object.entries({ ...assetNeedMap, "Other / Custom Manual Category": defaultNeeds, "Default Professional Category": defaultNeeds }).map(([category, profile]) => (
                <div key={category} className="rounded-2xl border bg-zinc-50 p-4">
                  <div className="font-bold text-zinc-950">{category}</div>
                  <div className="mt-1 text-sm text-zinc-600">Suggested one-off skill price: ${(profile.individualPriceCents / 100).toFixed(0)}</div>
                  <div className="mt-2 text-xs leading-5 text-zinc-500">Bundle floor: ${Math.max(9900, profile.individualPriceCents * 2) / 100}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-zinc-950">Build priced assets from the generator.</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">Choose a preset profession and industry or enter custom category context, generate a platform-ready asset, then package it as a marketplace listing with suggested price metadata.</p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-zinc-950 text-white hover:bg-red-700"><Link href="/generator">Open generator</Link></Button>
          </div>
        </section>
      </div>
    </div>
  );
}
