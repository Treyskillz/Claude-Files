import JSZip from "jszip";
import { saveAs } from "file-saver";

const APP_BRAND = "Skillz Magic AI Studio";
const DOWNLOAD_BRAND = "Freedom One Academy";
const DOWNLOAD_CONTACT = "freedom1.digital.@gmail.com";

const BRAND_HEADER = `${DOWNLOAD_BRAND}\nPowered by ${APP_BRAND}\nContact: ${DOWNLOAD_CONTACT}\nCreate, package, export, and sell Master Operating Systems, skills, prompts, workflows, and bundles for Claude, ChatGPT, Manus, Grok/Groq, and general AI.\n`;

export function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "skillz-magic-ai-studio-export";
}

export async function copyToClipboard(content: string) {
  await navigator.clipboard.writeText(content);
}

function platformInstallGuide(targetPlatform: string) {
  if (targetPlatform === "Claude") {
    return "Use MASTER-OPERATING-SYSTEM.md as Claude Project instructions, SKILL.md as a Claude skill-style file, and PROMPTS.md as reusable conversation starters.";
  }
  if (targetPlatform === "ChatGPT") {
    return "Use MASTER-OPERATING-SYSTEM.md as Custom GPT instructions or project instructions, add PROMPTS.md as starters, and use WORKFLOWS.md as action checklists.";
  }
  if (targetPlatform === "Manus") {
    return "Use MASTER-OPERATING-SYSTEM.md as project instructions, WORKFLOWS.md as agent runbooks, and PROMPTS.md/SKILL.md as task templates.";
  }
  if (targetPlatform === "Grok/Groq") {
    return "Use PROMPTS.md and WORKFLOWS.md as concise high-speed prompt patterns, and adapt MASTER-OPERATING-SYSTEM.md into system guidance or API-side orchestration notes.";
  }
  return "Use the files as a portable operating system package across Claude, ChatGPT, Manus, Grok/Groq, and general AI tools. Keep platform instructions, prompt templates, SOPs, and QA rules together when installing.";
}

function usageGuideMarkdown(title: string, targetPlatform: string) {
  return `# ${title} Usage Guide\n\nPrepared by ${DOWNLOAD_BRAND}.\n\nPowered by ${APP_BRAND}.\n\nContact: ${DOWNLOAD_CONTACT}\n\n## What This Asset Does\n\nThis package gives the buyer a structured AI operating asset that can be copied into an AI workspace, reused as a prompt or workflow system, adapted into a Claude-style skill, and packaged for internal operations or customer delivery. It is designed to turn a business goal into repeatable instructions, quality rules, prompts, workflows, and platform-ready guidance instead of leaving the buyer with a loose one-off prompt.\n\n## Install\n\n${platformInstallGuide(targetPlatform)}\n\n## Recommended Setup Steps\n\n1. Read the master document first so you understand the asset purpose, audience, operating rules, and quality standards.\n2. Add the master instructions to the selected AI platform as project instructions, Custom GPT instructions, system guidance, or a reusable workspace note.\n3. Add the prompt and workflow files as reusable templates or task checklists.\n4. Run one realistic test task from the buyer's industry and review the output against the QA rules.\n5. Customize examples, brand voice, compliance notes, and handoff steps before selling, publishing, or using the asset with clients.\n\n## Files\n\n- \`MASTER-OPERATING-SYSTEM.md\`: The primary operating system, skill, prompt, workflow, or bundle document.\n- \`SKILL.md\`: A Claude-style skill file that can also be adapted into platform instructions.\n- \`PROMPTS.md\`: Prompt system and reusable conversation templates.\n- \`WORKFLOWS.md\`: Workflow blueprint, SOP notes, and QA sequence.\n- \`PLATFORM-ADAPTATION-GUIDE.md\`: Installation guidance for Claude, ChatGPT, Manus, Grok/Groq, and general AI.\n- \`manifest.json\`: Package metadata for cataloging, sale, or reuse.\n- \`USAGE-GUIDE.md\`: This quick-start guide.\n\n## Quality Check\n\nReview the instructions, adapt examples to the buyer's industry, test the package with representative tasks, and verify that outputs are useful, specific, safe, and commercially ready before selling or publishing it.\n`;
}

function platformAdaptationGuideMarkdown(targetPlatform: string) {
  return `# Platform Adaptation Guide\n\nPrepared by ${DOWNLOAD_BRAND}.\n\nPowered by ${APP_BRAND}.\n\nContact: ${DOWNLOAD_CONTACT}\n\nTarget platform: ${targetPlatform}\n\n${platformInstallGuide(targetPlatform)}\n\n## Claude\n\nInstall as Project instructions, SKILL.md, artifacts, and reusable prompt blocks. If using Claude Projects, place the operating rules and workflow expectations in project instructions and upload supporting markdown files as project knowledge.\n\n## ChatGPT\n\nInstall as Custom GPT instructions, project knowledge, prompt starters, and workflow checklists. Keep the role, task, constraints, output format, and QA requirements together so the GPT produces consistent results.\n\n## Manus\n\nInstall as project instructions, agent runbooks, and task planning templates. Use the workflow sections as repeatable execution steps and the QA rules as completion criteria.\n\n## Grok/Groq\n\nUse as compact system guidance, high-speed prompt templates, and API orchestration notes. Keep prompts concise and move longer SOP content into a reference document when needed.\n\n## General AI\n\nPreserve the role, context, task, constraints, output format, QA, and implementation sections. If the platform has no project or custom-instruction feature, paste the relevant sections at the start of a new chat and save them as reusable templates.\n`;
}

export function exportToMarkdown(content: string, title: string) {
  const fileName = `${slugifyFileName(title)}.md`;
  const markdown = `# ${title}\n\n> Prepared by ${DOWNLOAD_BRAND}. Powered by ${APP_BRAND}. Contact: ${DOWNLOAD_CONTACT}\n\n> Generated with Skillz Magic AI Studio for multi-platform AI operating systems, skills, prompts, and workflows.\n\n${content}`;
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  saveAs(blob, fileName);
}

export function exportToText(content: string, title: string) {
  const blob = new Blob([`${BRAND_HEADER}\n${title}\n\n${content}`], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${slugifyFileName(title)}.txt`);
}

export function exportToPDF(content: string, title: string, targetPlatform = "Multi-platform AI") {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");
  if (!printWindow) {
    throw new Error("Please allow popups to export this PDF.");
  }

  const escaped = content
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const escapedUsageGuide = usageGuideMarkdown(title, targetPlatform)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const escapedPlatformGuide = platformAdaptationGuideMarkdown(targetPlatform)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; color: #111111; background: #ffffff; margin: 0; padding: 40px; line-height: 1.58; }
      .brand { border-bottom: 4px solid #DC2626; padding-bottom: 18px; margin-bottom: 28px; }
      .kicker { color: #DC2626; font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
      h1 { font-size: 34px; margin: 6px 0 8px; letter-spacing: -0.04em; }
      h2 { break-after: avoid; margin-top: 32px; }
      .sub { color: #6B7280; font-size: 14px; }
      .contact { margin-top: 10px; font-size: 13px; font-weight: 700; color: #111111; }
      .guide { border-top: 1px solid #E5E7EB; margin-top: 34px; padding-top: 22px; }
      pre { white-space: pre-wrap; font: inherit; }
      @page { margin: 24mm; }
    </style>
  </head>
  <body>
    <section class="brand">
      <div class="kicker">${DOWNLOAD_BRAND} Export</div>
      <h1>${title}</h1>
      <div class="sub">Powered by ${APP_BRAND}. ${targetPlatform} asset generated for copy, PDF archive, buyer delivery, marketplace packaging, and AI platform installation.</div>
      <div class="contact">Contact: ${DOWNLOAD_CONTACT}</div>
    </section>
    <pre>${escaped}</pre>
    <section class="guide">
      <h2>Usage Guide</h2>
      <pre>${escapedUsageGuide}</pre>
    </section>
    <section class="guide">
      <h2>Platform Installation Guide</h2>
      <pre>${escapedPlatformGuide}</pre>
    </section>
    <script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>
  </body>
</html>`);
  printWindow.document.close();
}

export async function exportClaudePluginZip(params: {
  title: string;
  content: string;
  assetType: string;
  manifest?: Record<string, unknown>;
}) {
  const zip = new JSZip();
  const slug = slugifyFileName(params.title);
  const targetPlatform = typeof params.manifest?.targetPlatform === "string" ? params.manifest.targetPlatform : "All Platforms";
  const brandedHeader = `Prepared by ${DOWNLOAD_BRAND}.\nPowered by ${APP_BRAND}.\nContact: ${DOWNLOAD_CONTACT}\n\n`;
  const manifest = {
    name: slug,
    title: params.title,
    assetType: params.assetType,
    targetPlatform,
    compatibility: "Multi-platform AI package for Claude, ChatGPT, Manus, Grok/Groq, and general AI tools",
    generatedBy: "Skillz Magic AI Studio",
    preparedBy: DOWNLOAD_BRAND,
    contact: DOWNLOAD_CONTACT,
    files: ["MASTER-OPERATING-SYSTEM.md", "SKILL.md", "PROMPTS.md", "WORKFLOWS.md", "PLATFORM-ADAPTATION-GUIDE.md", "manifest.json", "USAGE-GUIDE.md"],
    ...(params.manifest ?? {}),
  };

  zip.file("MASTER-OPERATING-SYSTEM.md", `${brandedHeader}${params.content}`);
  zip.file("SKILL.md", `${brandedHeader}${params.content}`);
  zip.file("PROMPTS.md", `${brandedHeader}# ${params.title} Prompt System\n\nUse the prompt sections from the master document below and adapt them for ${targetPlatform}.\n\n${params.content}`);
  zip.file("WORKFLOWS.md", `${brandedHeader}# ${params.title} Workflow Blueprint\n\nUse the workflow, SOP, QA, and implementation sections from the master document below.\n\n${params.content}`);
  zip.file("PLATFORM-ADAPTATION-GUIDE.md", platformAdaptationGuideMarkdown(targetPlatform));
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file("USAGE-GUIDE.md", usageGuideMarkdown(params.title, targetPlatform));

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${slug}-ai-operating-system-package.zip`);
}
