import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Download, FileArchive, Library, PackagePlus, Sparkles, Tags, UploadCloud } from "lucide-react";

const workflowSteps = [
  {
    title: "Choose what you want to create",
    detail: "Start with a Master Operating System, skill, prompt system, workflow, or bundle. Master Operating Systems are best when you want a complete implementation package with SOPs, category maps, prompts, skills, workflows, QA rules, and a rollout plan.",
  },
  {
    title: "Select or type your category context",
    detail: "Use preset professions, industries, and platforms when they fit. If your niche is not listed, choose Other / Custom and type your own profession, industry, AI platform, buyer segment, department, compliance niche, or workflow family.",
  },
  {
    title: "Review the recommended category asset map",
    detail: "The generator shows recommended operating systems, skills, prompts, and workflows before generation. Use this as a quick validation step before creating the asset.",
  },
  {
    title: "Generate, refine, and export",
    detail: "Generate instantly from defaults or add detailed role, audience, goal, and constraint notes. Export finished content as Markdown, PDF, or a platform ZIP package for use in Claude, ChatGPT, Manus, Grok/Groq, general AI tools, or a custom platform.",
  },
];

const featureGuide = [
  {
    area: "CMOS Builder",
    icon: Sparkles,
    use: "Create multi-platform Master Operating Systems, skills, prompts, workflows, and bundles from preset or custom category context.",
    bestPractice: "Begin with the strongest commercial category: profession, industry, buyer segment, or business type. Add specific constraints for regulated or brand-sensitive work.",
  },
  {
    area: "Other / Custom categories",
    icon: Tags,
    use: "Manually input categories that are not in the preset lists, including unusual professions, industries, platforms, departments, niches, and asset types.",
    bestPractice: "Use plain-language specifics such as “mobile dog groomers,” “estate cleanout coordinators,” or “internal HR compliance chatbot” rather than broad labels.",
  },
  {
    area: "Upload",
    icon: UploadCloud,
    use: "Add existing prompts, skills, workflows, SOPs, or resource notes into your asset library for organization and reuse.",
    bestPractice: "Name uploaded resources by category and use case so they are easy to package later into bundles or marketplace listings.",
  },
  {
    area: "Library",
    icon: Library,
    use: "Store generated and uploaded assets, copy content, and export saved work when you need a clean deliverable.",
    bestPractice: "Save your best generated versions after each refinement pass so you can compare outputs and preserve reusable systems.",
  },
  {
    area: "Marketplace",
    icon: PackagePlus,
    use: "Package generated assets into sellable listings with a title, category, description, included files, and Stripe checkout preset.",
    bestPractice: "Write listings around buyer outcomes, not just file contents. Explain the workflow problem the asset solves and who it is for.",
  },
  {
    area: "Exports",
    icon: Download,
    use: "Download Markdown, print-ready PDF, or a ZIP package with manifest, usage guide, platform adaptation guide, prompts, workflows, and documentation.",
    bestPractice: "Use Markdown for editing, PDF for client delivery, and ZIP for complete implementation packages.",
  },
];

const packageGuide = [
  { offer: "Prompt pack", guidance: "Focused download", purpose: "Use when you need a targeted prompt system and quality checklist for one immediate use case." },
  { offer: "Skill or workflow", guidance: "Implementation asset", purpose: "Use when you need a practical tool with setup instructions, workflow structure, and usage guidance." },
  { offer: "Professional bundle", guidance: "Grouped toolkit", purpose: "Use when several prompts, skills, workflows, and guides solve one related problem together." },
  { offer: "Master Operating System", guidance: "Complete system", purpose: "Use for complete category-specific operating systems with SOPs, QA, roadmap, and platform guidance." },
  { offer: "Subscription", guidance: "Ongoing creation", purpose: "Use when you generate, package, and improve multiple assets over time." },
];

const qualityChecklist = [
  "The selected platform is correct, including any custom platform name.",
  "The profession, industry, business type, and custom category context describe a real buyer or operating environment.",
  "The generated output includes category maps, recommended skills, prompts, workflows, SOPs, QA rules, and implementation guidance when creating a Master Operating System.",
  "The export format matches the next use: Markdown for editing, PDF for delivery, or ZIP for a complete implementation package.",
  "Marketplace listings explain the outcome, intended user, included files, and package details before checkout is offered.",
];

export default function Instructions() {
  return (
    <div className="bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100">
              <FileArchive className="mr-2 h-4 w-4" /> User instructions
            </Badge>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">
              How to use Skillz Magic AI Studio from idea to sellable asset.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
              This guide explains the practical workflow for creating multi-platform Master Operating Systems, skills, prompts, workflows, and bundles. It is designed for users who want to work from preset categories or manually enter a custom profession, industry, platform, business type, department, niche, or asset category.
            </p>
          </div>
          <Card className="rounded-3xl border-red-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Fast start</CardTitle>
              <CardDescription className="leading-6">
                If you are new, start in the CMOS Builder, choose Master OS, select a platform, choose preset categories or Other / Custom, review the recommended asset map, then generate and export.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-red-600 text-white hover:bg-red-700">
                <Link href="/generator">Open CMOS Builder <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-white">
                <Link href="/pricing">View pricing guide</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <Card key={step.title} className="rounded-3xl bg-white shadow-sm">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 font-black text-red-700">{index + 1}</div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-zinc-600">{step.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mb-10">
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Feature-by-feature instructions</CardTitle>
              <CardDescription>
                Use this table to understand where each major feature fits in the asset creation workflow.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b text-zinc-950">
                    <th className="py-3 pr-4 font-black">Feature</th>
                    <th className="py-3 pr-4 font-black">What to use it for</th>
                    <th className="py-3 pr-4 font-black">Best practice</th>
                  </tr>
                </thead>
                <tbody>
                  {featureGuide.map(item => {
                    const Icon = item.icon;
                    return (
                      <tr key={item.area} className="border-b last:border-0">
                        <td className="py-4 pr-4 align-top font-bold text-zinc-950">
                          <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-red-600" /> {item.area}</span>
                        </td>
                        <td className="py-4 pr-4 align-top leading-6 text-zinc-600">{item.use}</td>
                        <td className="py-4 pr-4 align-top leading-6 text-zinc-600">{item.bestPractice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-3xl bg-zinc-950 text-white shadow-sm">
            <CardHeader>
              <CardTitle>How to use custom categories</CardTitle>
              <CardDescription className="text-zinc-300">
                Custom inputs are useful when the buyer, platform, market, or asset category is too specific for a preset list.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm leading-6 text-zinc-200">
              <p>
                Choose <strong className="text-white">Other / Custom</strong> wherever it appears, then type the missing context in the manual field. The generator uses that text in the recommendation map, generation prompt, saved library item, marketplace listing, PDF metadata, and ZIP manifest where applicable.
              </p>
              <p>
                Strong custom category entries are concrete. For example, “boutique estate sale coordinators,” “AI policy training for dental offices,” “Grok/Groq support desk playbook,” or “construction change-order workflow system” will usually produce more useful results than a broad label like “business.”
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Package and checkout guidance</CardTitle>
              <CardDescription>
                The app supports one-off downloads, Master Operating Systems, bundles, lifetime access, monthly subscriptions, and annual subscriptions.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b text-zinc-950">
                    <th className="py-3 pr-4 font-black">Offer</th>
                    <th className="py-3 pr-4 font-black">Package type</th>
                    <th className="py-3 pr-4 font-black">Best use</th>
                  </tr>
                </thead>
                <tbody>
                  {packageGuide.map(item => (
                    <tr key={item.offer} className="border-b last:border-0">
                      <td className="py-4 pr-4 align-top font-bold text-zinc-950">{item.offer}</td>
                      <td className="py-4 pr-4 align-top text-red-700 font-semibold">{item.guidance}</td>
                      <td className="py-4 pr-4 align-top leading-6 text-zinc-600">{item.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="rounded-3xl bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Quality checklist before exporting or selling</CardTitle>
              <CardDescription>
                Run this review before sharing a PDF, ZIP, or marketplace checkout link.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {qualityChecklist.map(item => (
                <div key={item} className="flex gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-red-100 bg-red-50 shadow-sm">
            <CardHeader>
              <CardTitle>Recommended workflow</CardTitle>
              <CardDescription className="leading-6">
                For paid assets, use the generator to create the first version, export Markdown for editing, save the polished version to the library, package it as a ZIP, then create a marketplace listing with a clear buyer outcome and price.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-red-700">
                <Link href="/generator">Generate an asset</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-white">
                <Link href="/marketplace">Create a marketplace listing</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-white">
                <Link href="/library">Open library</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
