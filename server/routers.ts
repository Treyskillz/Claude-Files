import { COOKIE_NAME } from "@shared/const";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createPurchaseRecord,
  listGeneratedAssets,
  listMarketplaceProducts,
  listRecentPurchases,
  listUserPurchases,
  saveGeneratedAsset,
  upsertMarketplaceProduct,
} from "./db";
import { DEFAULT_LICENSE, getProductBySlug, MARKETPLACE_PRODUCTS } from "./products";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const assetTypeSchema = z.enum(["master_os", "skill", "prompt", "workflow", "bundle"]);
const packageTypeSchema = z.enum(["individual", "bundle", "one_time_app", "subscription_monthly", "subscription_annual"]);

const generateInputSchema = z.object({
  assetType: assetTypeSchema.default("skill"),
  mode: z.enum(["autonomous", "assisted"]).default("autonomous"),
  title: z.string().optional(),
  role: z.string().optional(),
  industry: z.string().optional(),
  professionCategory: z.string().optional(),
  industryCategory: z.string().optional(),
  recommendedAssetFocus: z.string().optional(),
  targetPlatform: z.string().default("All Platforms"),
  businessType: z.string().optional(),
  customCategoryContext: z.string().optional(),
  audience: z.string().optional(),
  goal: z.string().optional(),
  constraints: z.string().optional(),
  monetization: z.string().optional(),
  tone: z.string().optional(),
});

type GenerateInput = z.infer<typeof generateInputSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

type CheckoutProductAccess = {
  slug: string;
  title: string;
  description: string;
  packageType: z.infer<typeof packageTypeSchema>;
  priceCents: number;
};

export function isAdminUser(user: { role?: string | null; openId?: string | null } | null | undefined) {
  return user?.role === "admin" || Boolean(process.env.OWNER_OPEN_ID && user?.openId === process.env.OWNER_OPEN_ID);
}

function withAdminRole<TUser extends { role?: string | null; openId?: string | null } | null | undefined>(user: TUser) {
  if (!user || !isAdminUser(user)) return user;
  return { ...user, role: "admin" as const };
}

function requireAdminAccess(user: { role?: string | null; openId?: string | null } | null | undefined) {
  if (!isAdminUser(user)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access is reserved for the project owner/admin account." });
  }
}

function inferCategoryFromAsset(assetType: z.infer<typeof assetTypeSchema>, title: string) {
  if (assetType === "skill") return "Claude Skills";
  if (assetType === "prompt") return "Prompt Systems";
  if (assetType === "workflow") return "Workflow Blueprints";
  if (assetType === "master_os") return "Master Operating Systems";
  if (title.toLowerCase().includes("bundle")) return "Bundles";
  return "Digital Asset Packages";
}

function buildIncludedFilesFromAsset(title: string, assetType: z.infer<typeof assetTypeSchema>) {
  const slug = slugify(title) || "ai-asset-package";
  if (assetType === "skill") return [`${slug}/SKILL.md`, `${slug}/usage-guide.md`, `${slug}/license.md`];
  if (assetType === "prompt") return [`${slug}/prompt-system.md`, `${slug}/variations.md`, `${slug}/license.md`];
  if (assetType === "workflow") return [`${slug}/workflow-blueprint.md`, `${slug}/sop.md`, `${slug}/license.md`];
  if (assetType === "master_os") return [`${slug}/master-operating-system.md`, `${slug}/skills-library.md`, `${slug}/prompt-library.md`, `${slug}/workflow-sops.md`, `${slug}/license.md`];
  return [`${slug}/bundle-index.md`, `${slug}/assets.md`, `${slug}/usage-guide.md`, `${slug}/license.md`];
}

export function buildAdminCheckoutBypass(product: CheckoutProductAccess) {
  return {
    checkoutUrl: null,
    sessionId: null,
    adminFreeAccess: true,
    productSlug: product.slug,
    productTitle: product.title,
    packageType: product.packageType,
    message: "Admin access included. No Stripe checkout or purchase record is required for this owner/admin account.",
  } as const;
}

export function buildPaidCheckoutResponse(session: Stripe.Checkout.Session, product: CheckoutProductAccess) {
  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    adminFreeAccess: false,
    productSlug: product.slug,
    productTitle: product.title,
    packageType: product.packageType,
    message: "Stripe Checkout session created for customer payment.",
  } as const;
}

export function buildFallbackAsset(input: GenerateInput) {
  const categoryContext = [input.professionCategory, input.industryCategory, input.businessType, input.industry, input.customCategoryContext].filter(Boolean).join(" / ") || "AI Automation";
  const platformContext = input.targetPlatform || "All Platforms";
  const title = input.title?.trim() || `${categoryContext} ${input.assetType === "master_os" ? "Master Operating System" : input.assetType === "skill" ? "AI Skill" : input.assetType === "prompt" ? "Prompt System" : input.assetType === "bundle" ? "Asset Bundle" : "Workflow Blueprint"}`;
  const audience = input.audience || `${input.professionCategory || "professionals"} working in ${input.industryCategory || input.industry || "service businesses"}`;
  const goal = input.goal || `create the most useful ${input.assetType} for ${categoryContext}, including the skills, prompts, and workflows those users repeatedly need`;
  const constraints = input.constraints || "keep outputs concise, verifiable, reusable, commercially practical, and easy to customize";
  const assetFocus = input.recommendedAssetFocus || "recommend the highest-value skills, prompts, and workflows for the selected profession and industry";

  if (input.assetType === "master_os") {
    return `# ${title}\n\n## Master Operating System Purpose\n\nThis Master Operating System helps ${audience} ${goal}. It is designed for ${platformContext} and can be adapted across Claude, ChatGPT, Manus, Grok/Groq, and general AI workspaces.\n\n## Category Fit\n\nPrioritize the professional, industry, and business needs represented by ${categoryContext}. Specifically, ${assetFocus}.\n\n## Category Map / Recommended Asset Map\n\n| Asset Layer | Recommended Focus |\n| --- | --- |\n| Master Operating System modules | Intake OS, Delivery OS, QA OS, Sales OS, and platform adaptation OS |\n| Skills | Intake diagnosis, client/customer communication, research synthesis, offer packaging, and QA review |\n| Prompts | Strategy prompt, intake prompt, execution prompt, revision prompt, and QA prompt |\n| Workflows | Lead/request intake, research and planning, asset production, review/approval, and packaging/delivery |\n| Monetization package | Markdown export, PDF-ready documentation, platform ZIP package, product listing copy, and usage guide |\n\n## Operating Principles\n\n1. Convert vague business requests into structured AI-ready work orders.\n2. Route work to the right skill, prompt, workflow, SOP, or human review path.\n3. Preserve brand voice, compliance constraints, and quality standards.\n4. Produce reusable outputs that can become digital products, internal SOPs, or client deliverables.\n\n## Core Skills Library\n\n- Intake and diagnosis skill\n- Client or customer communication skill\n- Research and synthesis skill\n- Offer/product packaging skill\n- QA and compliance review skill\n\n## Prompt Library\n\n- Strategy prompt\n- Intake prompt\n- Execution prompt\n- Revision prompt\n- QA prompt\n\n## Workflow Library\n\n- Lead or request intake workflow\n- Research and planning workflow\n- Asset production workflow\n- Review and approval workflow\n- Packaging and delivery workflow\n\n## SOPs\n\nDocument the trigger, owner, inputs, decision rules, output format, escalation points, and completion criteria for each workflow. Apply these constraints: ${constraints}.\n\n## Platform Adaptation Guide\n\n- Claude: use as Projects instructions, SKILL.md, artifacts, and reusable prompt blocks.\n- ChatGPT: use as Custom GPT instructions, project knowledge, prompt templates, and task checklists.\n- Manus: use as agent instructions, project requirements, task plans, and workflow runbooks.\n- Grok/Groq: use as concise system guidance, high-speed prompt patterns, and API workflow instructions.\n- General AI: preserve markdown, role, context, task, constraints, output format, and QA sections.\n\n## Implementation Roadmap\n\n1. Install the operating principles and platform instructions.\n2. Add the core prompt library.\n3. Test the three highest-value workflows.\n4. Create branded export files and product listing copy.\n5. Review outputs against the QA rules before client or customer use.\n\n## QA Rules\n\nOutputs must be specific, useful, safe, non-generic, brand-aware, and directly tied to ${categoryContext}.\n`;
  }

  if (input.assetType === "skill") {
    return `---\nname: ${slugify(title) || "claude-automation-skill"}\ndescription: Use this skill when the user needs ${goal}.\n---\n\n# ${title}\n\n## Purpose\n\nThis Claude skill helps ${audience} ${goal}. It is designed for practical business use, clear handoffs, and repeatable execution.\n\n## When To Use\n\nUse this skill when the user asks an AI platform to plan, automate, analyze, package, or improve a workflow related to ${categoryContext}. Target platform: ${platformContext}.

## Category Intelligence

Prioritize the professional and industry needs represented by ${categoryContext}. Specifically, ${assetFocus}.\n\n## Operating Instructions\n\n1. Clarify the user's desired outcome, audience, deadline, and constraints.\n2. Identify the current workflow stage: discovery, build, QA, publishing, or optimization.\n3. Produce a structured result with assumptions, steps, deliverables, risks, and next actions.\n4. Apply these constraints: ${constraints}.\n5. End with a short quality-control checklist.\n\n## Output Format\n\nReturn Markdown with sections for Objective, Inputs Needed, Execution Plan, Generated Asset, QA Checklist, and Next Step.\n\n## Quality Bar\n\nThe result should be specific enough for immediate use, but modular enough to adapt for another client, niche, or product package.\n`;
  }

  if (input.assetType === "prompt") {
    return `# ${title}\n\n## Role\n\nYou are an expert AI automation strategist helping ${audience}. Target platform: ${platformContext}.\n\n## Task\n\nCreate a complete, usable output that helps the user ${goal}.\n\n## Context To Ask For If Missing\n\nAsk for the industry, target user, desired outcome, required format, constraints, examples, and success criteria. If the user wants one-click generation, make reasonable assumptions and label them clearly.\n\n## Instructions\n\nConvert vague goals into a structured automation plan for ${categoryContext}. Include the most relevant professional skills, repeatable prompts, and workflow automations these users need. ${assetFocus}. Make the result commercially practical and easy to package. Follow these constraints: ${constraints}.\n\n## Output Format\n\nReturn: Summary, Assumptions, Main Output, Implementation Steps, QA Checklist, and Reusable Variations.\n`;
  }

  if (input.assetType === "workflow") {
    return `# ${title}\n\n## Workflow Goal\n\nHelp ${audience} ${goal}.\n\n## Trigger\n\nA user requests an automation asset, business workflow, or Claude-ready operating procedure.\n\n## Inputs\n\nProfession category, industry category, role, audience, offer, source materials, constraints, tone, quality requirements, and monetization goal.\n\n## Steps\n\n1. Intake and classify the user's request.\n2. Select the best asset type: skill, prompt, workflow, or bundle.\n3. Generate the asset using smart defaults when inputs are missing.\n4. Package the asset with a title, description, included files, license notes, and usage guide.\n5. Run QA for clarity, usability, specificity, and commercial readiness.\n6. Export as Markdown or PDF.\n\n## Decisions\n\nIf the output will be sold, include preview copy and license terms. If it is for internal use, include implementation SOPs and handoff notes.\n\n## Quality Controls\n\nEnsure outputs are practical, non-generic, correctly labeled, and compatible with ${platformContext} usage patterns, with notes for Claude, ChatGPT, Manus, Grok/Groq, and general AI adaptation when relevant.\n`;
  }

  return `# ${title}\n\nThis bundle includes a Master Operating System overview, AI skill, prompt system, workflow blueprint, profession and industry category recommendations, platform adaptation notes, product description, license terms, and usage guide for ${audience}.\n\n## Bundle Objective\n\n${goal}\n\n## Included Assets\n\n- SKILL.md\n- Prompt system\n- Workflow blueprint\n- Profession and industry category recommendations\n- Usage guide\n- Product listing copy\n- License terms\n\n## License\n\n${DEFAULT_LICENSE}\n`;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => withAdminRole(opts.ctx.user)),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  generator: router({
    create: publicProcedure.input(generateInputSchema).mutation(async ({ input, ctx }) => {
      const system = "You are Skillz Magic AI Studio, a senior AI automation product architect. Create retail-ready Master Operating Systems, AI skills, prompts, workflows, and bundles that are practical, specific, copy-ready, and adaptable for Claude, ChatGPT, Manus, Grok/Groq, and general AI platform usage. Return Markdown only.";
      const categoryContext = [input.professionCategory, input.industryCategory, input.businessType, input.industry, input.customCategoryContext].filter(Boolean).join(" / ") || "general business automation";
      const promptTitle = input.title || "Invent a commercially useful title";
      const professionCategory = input.professionCategory || "Auto-select a high-value profession";
      const industryCategory = input.industryCategory || "Auto-select a high-value industry";
      const recommendedAssetFocus = input.recommendedAssetFocus || "Recommend the Master Operating System, skills, prompts, and workflows this professional, industry, or business buyer needs most";
      const targetPlatform = input.targetPlatform || "All Platforms";
      const businessType = input.businessType || "Use the selected category context";
      const customCategoryContext = input.customCategoryContext || "None provided";
      const role = input.role || "AI automation strategist";
      const industry = input.industry || categoryContext;
      const audience = input.audience || "business owners, creators, and operators";
      const goal = input.goal || "generate a practical AI operating system or automation asset that can be used or sold";
      const constraints = input.constraints || "clear, non-generic, professional, practical, safe, and easy to customize";
      const monetization = input.monetization || "package as a downloadable digital product";
      const tone = input.tone || "professional, direct, premium";
      const userPrompt = `Create a ${input.assetType} in ${input.mode} mode.
Title: ${promptTitle}
Profession category: ${professionCategory}
Industry category: ${industryCategory}
Recommended asset focus: ${recommendedAssetFocus}
Target platform: ${targetPlatform}
Business type: ${businessType}
Other custom category context: ${customCategoryContext}
Role: ${role}
Industry: ${industry}
Audience: ${audience}
Goal: ${goal}
Constraints: ${constraints}
Monetization: ${monetization}
Tone: ${tone}

Before the main asset, include a brief "Category Fit" section explaining why this profession, industry, or business type needs the asset. Include a "Recommended Asset Map" section listing at least 3 operating system modules, 3 skills, 3 prompts, and 3 workflows relevant to the chosen category. If asset type is master_os, return a complete Master Operating System with operating principles, skills library, prompt library, workflow SOPs, QA rules, platform adaptation guide, and implementation roadmap. If asset type is skill, use a valid SKILL.md style with YAML front matter where appropriate, purpose, when-to-use, instructions, output format, QA, and platform adaptation notes. If prompt, return a complete reusable prompt system. If workflow, return trigger, inputs, steps, decisions, outputs, QA, and handoff. If bundle, include all assets and a package index. Always include adaptation notes for Claude, ChatGPT, Manus, Grok/Groq, and General AI if target platform is All Platforms.`;

      let content = buildFallbackAsset(input);
      let generatedBy = "template-fallback";
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: system },
            { role: "user", content: userPrompt },
          ],
        });
        const text = response.choices?.[0]?.message?.content;
        if (typeof text === "string" && text.trim().length > 200) {
          content = text.trim();
          generatedBy = "server-llm";
        }
      } catch (error) {
        console.warn("[Generator] LLM failed; using fallback template", error);
      }

      const title = input.title?.trim() || `${input.professionCategory || input.industryCategory || input.industry || "Autonomous"} ${input.assetType} ${new Date().toLocaleDateString("en-US")}`;
      const manifest = {
        name: slugify(title),
        title,
        assetType: input.assetType,
        mode: input.mode,
        generatedBy,
        createdAt: new Date().toISOString(),
        professionCategory: input.professionCategory || null,
        industryCategory: input.industryCategory || null,
        targetPlatform: input.targetPlatform || "All Platforms",
        businessType: input.businessType || null,
        customCategoryContext: input.customCategoryContext || null,
        recommendedAssetFocus: input.recommendedAssetFocus || null,
        license: DEFAULT_LICENSE,
      };

      if (ctx.user) {
        await saveGeneratedAsset({
          userId: ctx.user.id,
          title,
          assetType: input.assetType,
          source: input.mode,
          summary: `Generated ${input.assetType} for ${input.targetPlatform || "All Platforms"} / ${input.professionCategory || input.industryCategory || input.businessType || input.industry || input.customCategoryContext || "general automation"}`,
          content,
          manifestJson: JSON.stringify(manifest, null, 2),
          licenseTerms: DEFAULT_LICENSE,
        });
      }

      return { title, content, manifest, licenseTerms: DEFAULT_LICENSE, generatedBy };
    }),
    listMine: protectedProcedure.query(({ ctx }) => listGeneratedAssets(ctx.user.id)),
  }),

  marketplace: router({
    catalog: publicProcedure.query(async () => {
      const saved = await listMarketplaceProducts();
      return { presets: MARKETPLACE_PRODUCTS, saved };
    }),
    saveProduct: protectedProcedure
      .input(
        z.object({
          title: z.string().min(3),
          category: z.string().min(2),
          packageType: packageTypeSchema.default("individual"),
          priceCents: z.number().int().min(50).max(500000),
          description: z.string().min(10),
          includedFiles: z.array(z.string()).default([]),
          licenseTerms: z.string().optional(),
        }),
      )
      .mutation(({ input, ctx }) =>
        upsertMarketplaceProduct({
          ownerId: ctx.user.id,
          title: input.title,
          slug: `${slugify(input.title)}-${Date.now()}`,
          category: input.category,
          packageType: input.packageType,
          priceCents: input.priceCents,
          description: input.description,
          includedFilesJson: JSON.stringify(input.includedFiles),
          licenseTerms: input.licenseTerms || DEFAULT_LICENSE,
        }),
      ),
    checkout: protectedProcedure
      .input(
        z.object({
          slug: z.string().min(2),
          title: z.string().optional(),
          priceCents: z.number().int().min(50).max(500000).optional(),
          packageType: packageTypeSchema.optional(),
          description: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const preset = getProductBySlug(input.slug);
        const product = {
          slug: preset?.slug || slugify(input.slug),
          title: input.title || preset?.title || "Claude Studio Digital Asset",
          description: input.description || preset?.description || "Downloadable Claude skill, prompt, or workflow asset.",
          packageType: input.packageType || preset?.packageType || "individual",
          priceCents: input.priceCents || preset?.priceCents || 2900,
        } as const;

        if (isAdminUser(ctx.user)) {
          return buildAdminCheckoutBypass(product);
        }

        if (!stripe) throw new Error("Stripe is not configured yet. Please configure payments in Settings → Payment.");

        const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.headers.host}`;
        const isRecurring = product.packageType === "subscription_monthly" || product.packageType === "subscription_annual";
        const session = await stripe.checkout.sessions.create({
          mode: isRecurring ? "subscription" : "payment",
          allow_promotion_codes: true,
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            product_slug: product.slug,
            package_type: product.packageType,
          },
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: product.priceCents,
                recurring: isRecurring ? { interval: product.packageType === "subscription_annual" ? "year" : "month" } : undefined,
                product_data: {
                  name: product.title,
                  description: product.description,
                  metadata: { product_slug: product.slug, package_type: product.packageType },
                },
              },
            },
          ],
          success_url: `${origin}/?checkout=success&product=${encodeURIComponent(product.slug)}`,
          cancel_url: `${origin}/?checkout=cancelled&product=${encodeURIComponent(product.slug)}`,
        });

        await createPurchaseRecord({
          userId: ctx.user.id,
          productSlug: product.slug,
          productTitle: product.title,
          packageType: product.packageType,
          stripeCheckoutSessionId: session.id,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          fulfillmentStatus: "pending",
        });

        return buildPaidCheckoutResponse(session, product);
      }),
    purchases: protectedProcedure.query(({ ctx }) => listUserPurchases(ctx.user.id)),
  }),

  admin: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      requireAdminAccess(ctx.user);

      const [products, purchases, generatedAssets] = await Promise.all([
        listMarketplaceProducts(),
        listRecentPurchases(100),
        listGeneratedAssets(),
      ]);

      const readyPurchases = purchases.filter(purchase => purchase.fulfillmentStatus === "ready" || purchase.fulfillmentStatus === "fulfilled").length;
      const pendingPurchases = purchases.filter(purchase => purchase.fulfillmentStatus === "pending").length;
      const savedRevenueCents = products.reduce((total, product) => total + (product.priceCents || 0), 0);
      const packageTypeCounts = products.reduce<Record<string, number>>((counts, product) => {
        counts[product.packageType] = (counts[product.packageType] || 0) + 1;
        return counts;
      }, {});

      return {
        admin: withAdminRole(ctx.user),
        summary: {
          savedProducts: products.length,
          presetProducts: MARKETPLACE_PRODUCTS.length,
          recentPurchases: purchases.length,
          readyPurchases,
          pendingPurchases,
          generatedAssets: generatedAssets.length,
          catalogListValueCents: savedRevenueCents,
          packageTypeCounts,
        },
        products: products.slice(0, 12),
        purchases: purchases.slice(0, 12),
        generatedAssets: generatedAssets.slice(0, 12),
        payoutGuidance: {
          currentStatus: "Marketplace checkout currently sends customer payments to the platform Stripe account; automatic seller payouts are not enabled yet.",
          requiredNextStep: "To pay customer sellers automatically, add Stripe Connect onboarding, store connected account IDs, and create transfers or destination charges for each paid listing.",
          sellerExpectation: "Until that payout layer is added, customer-created listings should be treated as admin-reviewed products, not self-serve seller payout products.",
        },
      } as const;
    }),
    publishGeneratedAsset: protectedProcedure
      .input(
        z.object({
          title: z.string().min(3),
          assetType: assetTypeSchema.default("bundle"),
          content: z.string().min(20),
          summary: z.string().optional(),
          priceCents: z.number().int().min(50).max(500000).default(2900),
          packageType: packageTypeSchema.default("individual"),
          licenseTerms: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        requireAdminAccess(ctx.user);

        const timestamp = Date.now();
        const slug = `${slugify(input.title) || "admin-package"}-${timestamp}`;
        const category = inferCategoryFromAsset(input.assetType, input.title);
        const includedFiles = buildIncludedFilesFromAsset(input.title, input.assetType);
        const description = input.summary?.trim() || `${input.title} is an admin-published ${category.toLowerCase()} package generated inside Skillz Magic AI Studio and prepared for marketplace sale.`;

        const product = await upsertMarketplaceProduct({
          ownerId: ctx.user.id,
          title: input.title,
          slug,
          category,
          packageType: input.packageType,
          priceCents: input.priceCents,
          description,
          includedFilesJson: JSON.stringify(includedFiles),
          licenseTerms: input.licenseTerms || DEFAULT_LICENSE,
        });

        return {
          published: true,
          product,
          slug,
          includedFiles,
          message: "Admin package published to the marketplace. Customer checkout remains paid unless the viewer is an admin.",
        } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
