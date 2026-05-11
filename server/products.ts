export type PackageType = "individual" | "bundle" | "one_time_app" | "subscription_monthly" | "subscription_annual";

export type CheckoutProduct = {
  slug: string;
  title: string;
  category: string;
  packageType: PackageType;
  priceCents: number;
  description: string;
  includedFiles: string[];
  licenseTerms: string;
};

export const DEFAULT_LICENSE =
  "Commercial use license for the buyer's own business operations and client delivery. Redistribution, resale, or public listing as a standalone competing product requires a separate seller license.";

export const MARKETPLACE_PRODUCTS: CheckoutProduct[] = [
  {
    slug: "skills-magic-ai-lifetime",
    title: "Skills Magic AI Lifetime App Access",
    category: "One-Time App Access",
    packageType: "one_time_app",
    priceCents: 14900,
    description: "A one-time access option for solo creators who want the generator, category strategy templates, local library, Markdown/PDF exports, and platform-ready ZIP packaging without a recurring subscription.",
    includedFiles: ["app-access-guide.md", "category-playbook.md", "export-guide.md", "marketplace-pricing-guide.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "multi-platform-master-operating-system",
    title: "Multi-Platform Master Operating System",
    category: "Master Operating System",
    packageType: "individual",
    priceCents: 14900,
    description: "A premium operating system package for one profession, industry, or business type, adapted for Claude, ChatGPT, Manus, Grok/Groq, and general AI use with SOPs, skills, prompts, workflows, QA rules, and rollout guidance.",
    includedFiles: ["MASTER-OS.md", "platform-adaptation-guide.md", "skills-library.md", "prompt-library.md", "workflow-sops.md", "qa-rules.md", "implementation-roadmap.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "profession-prompt-pack",
    title: "Profession Prompt Pack",
    category: "Prompt Pack",
    packageType: "individual",
    priceCents: 1900,
    description: "Copy-ready prompt systems for a selected profession, industry, AI platform, or business type, including intake, follow-up, offer explanation, content, and QA prompts.",
    includedFiles: ["prompt-system.md", "platform-variants.md", "prompt-variants.md", "quality-checklist.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "industry-platform-skill-pack",
    title: "Industry Platform Skill Package",
    category: "Skill",
    packageType: "individual",
    priceCents: 3900,
    description: "A single retail-ready AI skill package for a selected industry and platform with instructions, manifest, usage guide, examples, category fit, and workflow notes.",
    includedFiles: ["SKILL.md", "manifest.json", "platform-guide.md", "usage-guide.md", "category-fit.md", "examples.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "workflow-automation-blueprint",
    title: "Workflow Automation Blueprint",
    category: "Workflow",
    packageType: "individual",
    priceCents: 4900,
    description: "A practical AI-powered workflow blueprint for a specific professional use case with triggers, inputs, decisions, outputs, QA, and escalation rules.",
    includedFiles: ["workflow-blueprint.md", "sop.md", "platform-adaptation-guide.md", "handoff-checklist.md", "category-asset-map.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "profession-business-bundle",
    title: "Profession Business Bundle",
    category: "Bundle",
    packageType: "bundle",
    priceCents: 9900,
    description: "A curated professional bundle containing Master Operating System notes, skills, prompts, workflows, product listing copy, license-ready packaging templates, and a sellable asset map.",
    includedFiles: ["bundle-index.md", "MASTER-OS.md", "SKILL.md", "prompt-pack.md", "workflow-library.md", "sales-page-copy.md", "license.md", "category-asset-map.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "skills-magic-pro-monthly",
    title: "Skills Magic Pro Monthly",
    category: "Subscription",
    packageType: "subscription_monthly",
    priceCents: 2900,
    description: "Monthly access for recurring multi-platform asset creation, category recommendations, marketplace packaging, local library workflows, and export tools.",
    includedFiles: ["monthly-access-guide.md", "creator-library.md", "category-template-library.md", "platform-template-library.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
  {
    slug: "skills-magic-pro-annual",
    title: "Skills Magic Pro Annual",
    category: "Subscription",
    packageType: "subscription_annual",
    priceCents: 29000,
    description: "Annual access for creators and small teams building a line of Master Operating Systems, AI skills, prompt systems, workflow products, and bundle downloads. Priced as roughly two months free versus monthly billing.",
    includedFiles: ["annual-access-guide.md", "creator-library.md", "priority-templates.md", "category-template-library.md", "platform-template-library.md"],
    licenseTerms: DEFAULT_LICENSE,
  },
];

export function getProductBySlug(slug: string) {
  return MARKETPLACE_PRODUCTS.find(product => product.slug === slug);
}
