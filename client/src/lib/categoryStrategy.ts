export const professionCategories = [
  "Real Estate Agents & Property Managers",
  "Consultants & Coaches",
  "Healthcare Administrators",
  "Attorneys & Legal Support",
  "Financial Advisors & Bookkeepers",
  "Insurance Brokers",
  "HR & Recruiting Professionals",
  "Marketing Agencies & Content Teams",
  "Educators & Course Creators",
  "Home Services & Field Operations",
  "Nonprofit Program Managers",
  "E-commerce Operators",
  "Other / Custom Profession",
] as const;

export const industryCategories = [
  "Real Estate & Senior Transitions",
  "Professional Services",
  "Healthcare & Wellness",
  "Legal & Compliance",
  "Finance & Insurance",
  "Education & Training",
  "Home Services & Construction",
  "Retail & E-commerce",
  "Hospitality & Events",
  "Technology & SaaS",
  "Marketing & Media",
  "Nonprofit & Community Services",
  "Other / Custom Industry",
] as const;

export type AssetNeedProfile = {
  skills: string[];
  prompts: string[];
  workflows: string[];
  operatingSystems: string[];
  individualPriceCents: number;
  strategicRationale: string;
};

export const defaultNeeds: AssetNeedProfile = {
  skills: ["Client intake skill", "Research and summary skill", "Quality-control assistant"],
  prompts: ["Lead qualification prompt", "Follow-up email prompt", "Offer explanation prompt"],
  workflows: ["Onboarding workflow", "Delivery workflow", "Review and improvement workflow"],
  operatingSystems: ["Intake OS", "Delivery OS", "QA OS", "Sales OS"],
  individualPriceCents: 3900,
  strategicRationale: "This category benefits from structured intake, repeatable delivery, and reusable follow-up assets that convert everyday business work into AI-assisted systems.",
};

export const assetNeedMap: Record<string, AssetNeedProfile> = {
  "Real Estate Agents & Property Managers": {
    skills: ["Listing description builder", "Client intake and needs analysis", "Neighborhood research assistant"],
    prompts: ["Buyer consultation script", "Seller follow-up email sequence", "Inspection objection response"],
    workflows: ["Lead-to-showing follow-up", "Listing launch checklist", "Post-closing referral system"],
    operatingSystems: ["Lead Intake OS", "Listing Launch OS", "Client Communication OS", "Referral OS"],
    individualPriceCents: 3900,
    strategicRationale: "Real estate operators repeatedly need intake, listing, communication, objection-handling, and referral systems that save time while improving client experience.",
  },
  "Consultants & Coaches": {
    skills: ["Client discovery synthesizer", "Offer packaging strategist", "Proposal drafting assistant"],
    prompts: ["Discovery call recap", "Client roadmap generator", "Case study outline"],
    workflows: ["Client onboarding", "Monthly review delivery", "Renewal and upsell process"],
    operatingSystems: ["Discovery OS", "Offer Packaging OS", "Delivery OS", "Renewal OS"],
    individualPriceCents: 4900,
    strategicRationale: "Consultants and coaches can monetize AI systems directly because proposals, client roadmaps, renewals, and delivery assets map to revenue-generating workflows.",
  },
  "Healthcare Administrators": {
    skills: ["Patient communication drafter", "Policy summarizer", "Operations SOP assistant"],
    prompts: ["Appointment reminder copy", "Care instruction simplifier", "Staff training outline"],
    workflows: ["Patient follow-up", "Front desk intake", "Referral coordination"],
    operatingSystems: ["Front Desk OS", "Patient Follow-up OS", "Referral OS", "Staff Training OS"],
    individualPriceCents: 5900,
    strategicRationale: "Healthcare administrators need safe, clear, non-diagnostic communication and repeatable operations workflows that reduce missed steps and staff confusion.",
  },
  "Attorneys & Legal Support": {
    skills: ["Client intake organizer", "Document summary assistant", "Case timeline builder"],
    prompts: ["Consultation prep checklist", "Plain-language client update", "Discovery organization prompt"],
    workflows: ["New matter intake", "Client status reporting", "Document review triage"],
    operatingSystems: ["Matter Intake OS", "Document Review OS", "Client Update OS", "Compliance QA OS"],
    individualPriceCents: 6900,
    strategicRationale: "Legal teams have high-value, high-risk information workflows where structured intake, document organization, and plain-language communication improve efficiency.",
  },
  "Financial Advisors & Bookkeepers": {
    skills: ["Client financial intake organizer", "Monthly close explainer", "Advisory memo drafter"],
    prompts: ["Transaction categorization review", "Client tax prep request", "Cash-flow summary prompt"],
    workflows: ["Monthly close workflow", "Client document collection", "Advisory review process"],
    operatingSystems: ["Client Finance Intake OS", "Monthly Close OS", "Advisory OS", "Compliance Review OS"],
    individualPriceCents: 6900,
    strategicRationale: "Finance professionals pay for accuracy, documentation, and repeatable client communication because small process improvements save significant review time.",
  },
  "Insurance Brokers": {
    skills: ["Policy comparison assistant", "Client needs analyzer", "Renewal conversation planner"],
    prompts: ["Coverage gap explainer", "Renewal reminder sequence", "Quote comparison prompt"],
    workflows: ["Lead qualification workflow", "Policy renewal workflow", "Claims handoff workflow"],
    operatingSystems: ["Coverage Intake OS", "Quote Comparison OS", "Renewal OS", "Client Education OS"],
    individualPriceCents: 5900,
    strategicRationale: "Insurance brokers need clear explanations, renewal consistency, and structured comparison tools that support trust without creating compliance risk.",
  },
  "HR & Recruiting Professionals": {
    skills: ["Job description optimizer", "Candidate screen summarizer", "Interview kit builder"],
    prompts: ["Role scorecard prompt", "Candidate outreach sequence", "Interview debrief prompt"],
    workflows: ["Role intake workflow", "Candidate screening workflow", "Offer handoff workflow"],
    operatingSystems: ["Role Intake OS", "Candidate Screening OS", "Interview OS", "Onboarding OS"],
    individualPriceCents: 4900,
    strategicRationale: "HR and recruiting teams repeatedly translate vague hiring needs into structured roles, outreach, interviews, and onboarding steps.",
  },
  "Marketing Agencies & Content Teams": {
    skills: ["Campaign brief builder", "Content repurposing strategist", "Brand voice assistant"],
    prompts: ["30-day content plan", "Ad angle generator", "Landing page critique"],
    workflows: ["Client campaign launch", "Creative QA", "Reporting narrative"],
    operatingSystems: ["Campaign Brief OS", "Content Repurposing OS", "Creative QA OS", "Reporting OS"],
    individualPriceCents: 4900,
    strategicRationale: "Marketing teams buy practical prompt systems because campaign planning, creative production, QA, and reporting are frequent, repeatable tasks.",
  },
  "Educators & Course Creators": {
    skills: ["Curriculum mapper", "Lesson plan builder", "Student feedback synthesizer"],
    prompts: ["Module outline prompt", "Quiz generator", "Learning objective refiner"],
    workflows: ["Course planning workflow", "Lesson production workflow", "Student support workflow"],
    operatingSystems: ["Curriculum OS", "Lesson Production OS", "Assessment OS", "Student Support OS"],
    individualPriceCents: 3900,
    strategicRationale: "Educators and course creators benefit from repeatable planning, lesson production, assessment, and learner support structures.",
  },
  "Home Services & Field Operations": {
    skills: ["Estimate drafting assistant", "Technician note summarizer", "Customer update writer"],
    prompts: ["Job scope prompt", "Follow-up review request", "Service explanation prompt"],
    workflows: ["Lead-to-estimate workflow", "Dispatch handoff workflow", "Post-job review workflow"],
    operatingSystems: ["Estimate OS", "Dispatch OS", "Field Notes OS", "Customer Follow-up OS"],
    individualPriceCents: 4900,
    strategicRationale: "Field service businesses need faster estimates, clearer customer updates, and better handoffs between office and technicians.",
  },
  "Nonprofit Program Managers": {
    skills: ["Grant narrative assistant", "Volunteer communication planner", "Impact report summarizer"],
    prompts: ["Donor update prompt", "Program outcome prompt", "Volunteer onboarding prompt"],
    workflows: ["Grant planning workflow", "Volunteer onboarding workflow", "Impact reporting workflow"],
    operatingSystems: ["Program Intake OS", "Volunteer OS", "Grant OS", "Impact Reporting OS"],
    individualPriceCents: 3900,
    strategicRationale: "Nonprofits need low-cost repeatable assets for grant writing, volunteer coordination, donor updates, and impact reporting.",
  },
  "E-commerce Operators": {
    skills: ["Product page optimizer", "Customer support responder", "Offer testing assistant"],
    prompts: ["Product description prompt", "Review response prompt", "Promo angle generator"],
    workflows: ["Product launch workflow", "Customer support triage", "Campaign testing workflow"],
    operatingSystems: ["Product Launch OS", "Support OS", "Offer Testing OS", "Retention OS"],
    individualPriceCents: 4900,
    strategicRationale: "E-commerce operators can quickly connect AI assets to revenue through better product pages, support, campaign testing, and retention messaging.",
  },
};

const industryNeedMap: Record<string, Partial<AssetNeedProfile>> = {
  "Real Estate & Senior Transitions": {
    skills: ["Senior transition intake assistant", "Property preparation planner", "Family communication summarizer"],
    prompts: ["Downsizing consultation prompt", "Estate timeline explainer", "Property readiness checklist prompt"],
    workflows: ["Senior transition intake", "Property readiness coordination", "Family decision handoff"],
    operatingSystems: ["Transition Intake OS", "Property Readiness OS", "Family Communication OS"],
    individualPriceCents: 5900,
  },
  "Legal & Compliance": {
    skills: ["Compliance checklist assistant", "Policy summary assistant", "Risk review organizer"],
    prompts: ["Compliance review prompt", "Plain-language policy explainer", "Exception log prompt"],
    workflows: ["Compliance intake", "Risk review workflow", "Approval documentation workflow"],
    operatingSystems: ["Compliance OS", "Risk Review OS", "Approval OS"],
    individualPriceCents: 6900,
  },
  "Finance & Insurance": {
    skills: ["Document request assistant", "Financial explanation writer", "Renewal review planner"],
    prompts: ["Client evidence request", "Plan comparison prompt", "Renewal analysis prompt"],
    workflows: ["Client document chase", "Review meeting preparation", "Renewal follow-up"],
    operatingSystems: ["Financial Intake OS", "Review OS", "Renewal OS"],
    individualPriceCents: 6900,
  },
  "Technology & SaaS": {
    skills: ["Product requirements synthesizer", "Support knowledge-base writer", "Release note drafter"],
    prompts: ["User story prompt", "Bug triage prompt", "Feature launch prompt"],
    workflows: ["Feature intake workflow", "Support escalation workflow", "Release communication workflow"],
    operatingSystems: ["Product Intake OS", "Support OS", "Release OS"],
    individualPriceCents: 5900,
  },
  "Hospitality & Events": {
    skills: ["Event brief builder", "Guest communication assistant", "Vendor coordination planner"],
    prompts: ["Event timeline prompt", "Guest FAQ prompt", "Vendor handoff prompt"],
    workflows: ["Event intake workflow", "Vendor coordination workflow", "Post-event follow-up"],
    operatingSystems: ["Event Intake OS", "Guest Experience OS", "Vendor OS"],
    individualPriceCents: 4900,
  },
};

function uniqueFirst(values: string[], limit = 5) {
  return Array.from(new Set(values.filter(Boolean))).slice(0, limit);
}

function contextBoosters(roleOrBusinessContext: string) {
  const context = roleOrBusinessContext.toLowerCase();
  const skills: string[] = [];
  const prompts: string[] = [];
  const workflows: string[] = [];
  const operatingSystems: string[] = [];

  if (context.includes("agency") || context.includes("consultant") || context.includes("creator")) {
    skills.push("Client deliverable packaging assistant", "Niche offer positioning strategist");
    prompts.push("Client-ready delivery prompt", "Niche product listing prompt");
    workflows.push("Client handoff workflow", "Digital product packaging workflow");
    operatingSystems.push("Client Delivery OS", "Product Packaging OS");
  }

  if (context.includes("solo") || context.includes("freelance") || context.includes("operator")) {
    skills.push("Solo operator prioritization assistant", "Daily execution planner");
    prompts.push("One-person weekly plan prompt", "Time-saving automation prompt");
    workflows.push("Weekly operating rhythm", "Solo delivery checklist");
    operatingSystems.push("Solo Operator OS", "Weekly Execution OS");
  }

  if (context.includes("clinic") || context.includes("office") || context.includes("team")) {
    skills.push("Team SOP assistant", "Internal handoff summarizer");
    prompts.push("Staff procedure prompt", "Internal update prompt");
    workflows.push("Team handoff workflow", "Internal review workflow");
    operatingSystems.push("Team Handoff OS", "Operations Review OS");
  }

  return { skills, prompts, workflows, operatingSystems };
}

export function getAssetNeedProfile(professionCategory: string, industryCategory = "", roleOrBusinessContext = "") {
  const profession = assetNeedMap[professionCategory] || defaultNeeds;
  const industry = industryNeedMap[industryCategory] || {};
  const boosters = contextBoosters(roleOrBusinessContext);

  return {
    skills: uniqueFirst([...(boosters.skills || []), ...(industry.skills || []), ...profession.skills]),
    prompts: uniqueFirst([...(boosters.prompts || []), ...(industry.prompts || []), ...profession.prompts]),
    workflows: uniqueFirst([...(boosters.workflows || []), ...(industry.workflows || []), ...profession.workflows]),
    operatingSystems: uniqueFirst([...(boosters.operatingSystems || []), ...(industry.operatingSystems || []), ...profession.operatingSystems]),
    individualPriceCents: Math.max(profession.individualPriceCents, industry.individualPriceCents || 0),
    strategicRationale: `${profession.strategicRationale} ${industry.skills ? `The ${industryCategory} industry adds specialized needs around ${industry.skills.slice(0, 2).join(" and ")}.` : ""} ${roleOrBusinessContext ? `The role or business context (${roleOrBusinessContext}) also changes the asset map toward the most relevant operating systems and handoffs.` : ""}`.trim(),
  } satisfies AssetNeedProfile;
}

export function buildRecommendedAssetFocus(profile: AssetNeedProfile) {
  return `Master Operating System modules needed: ${profile.operatingSystems.join(", ")}. Skills needed: ${profile.skills.join(", ")}. Prompts needed: ${profile.prompts.join(", ")}. Workflows needed: ${profile.workflows.join(", ")}. Rationale: ${profile.strategicRationale}`;
}

export function getSuggestedAssetPrice(assetType: "master_os" | "skill" | "prompt" | "workflow" | "bundle", profile: AssetNeedProfile) {
  if (assetType === "prompt") return Math.max(1900, profile.individualPriceCents - 1000);
  if (assetType === "workflow") return Math.max(3900, profile.individualPriceCents);
  if (assetType === "master_os") return Math.max(14900, profile.individualPriceCents * 4);
  if (assetType === "bundle") return Math.max(9900, profile.individualPriceCents * 2);
  return profile.individualPriceCents;
}
