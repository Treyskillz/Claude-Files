import JSZip from "jszip";
import { saveAs } from "file-saver";

const BRAND_HEADER = `Skills Magic AI\nCreate, package, export, and sell Master Operating Systems, skills, prompts, workflows, and bundles for Claude, ChatGPT, Manus, Grok/Groq, and general AI.\n`;

export function slugifyFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "skills-magic-ai-export";
}

export async function copyToClipboard(content: string) {
  await navigator.clipboard.writeText(content);
}

export function exportToMarkdown(content: string, title: string) {
  const fileName = `${slugifyFileName(title)}.md`;
  const markdown = `# ${title}\n\n> Generated with Skills Magic AI for multi-platform AI operating systems, skills, prompts, and workflows.\n\n${content}`;
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

  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; color: #111111; background: #ffffff; margin: 0; padding: 40px; line-height: 1.58; }
      .brand { border-bottom: 4px solid #DC2626; padding-bottom: 18px; margin-bottom: 28px; }
      .kicker { color: #DC2626; font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
      h1 { font-size: 34px; margin: 6px 0 8px; letter-spacing: -0.04em; }
      .sub { color: #6B7280; font-size: 14px; }
      pre { white-space: pre-wrap; font: inherit; }
      @page { margin: 24mm; }
    </style>
  </head>
  <body>
    <section class="brand">
      <div class="kicker">Skills Magic AI Export</div>
      <h1>${title}</h1>
      <div class="sub">${targetPlatform} asset generated for copy, PDF archive, buyer delivery, and marketplace packaging.</div>
    </section>
    <pre>${escaped}</pre>
    <script>window.addEventListener('load', () => setTimeout(() => window.print(), 250));</script>
  </body>
</html>`);
  printWindow.document.close();
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

export async function exportClaudePluginZip(params: {
  title: string;
  content: string;
  assetType: string;
  manifest?: Record<string, unknown>;
}) {
  const zip = new JSZip();
  const slug = slugifyFileName(params.title);
  const targetPlatform = typeof params.manifest?.targetPlatform === "string" ? params.manifest.targetPlatform : "All Platforms";
  const manifest = {
    name: slug,
    title: params.title,
    assetType: params.assetType,
    targetPlatform,
    compatibility: "Multi-platform AI package for Claude, ChatGPT, Manus, Grok/Groq, and general AI tools",
    generatedBy: "Skills Magic AI",
    files: ["MASTER-OPERATING-SYSTEM.md", "SKILL.md", "PROMPTS.md", "WORKFLOWS.md", "PLATFORM-ADAPTATION-GUIDE.md", "manifest.json", "USAGE-GUIDE.md"],
    ...(params.manifest ?? {}),
  };

  zip.file("MASTER-OPERATING-SYSTEM.md", params.content);
  zip.file("SKILL.md", params.content);
  zip.file("PROMPTS.md", `# ${params.title} Prompt System\n\nUse the prompt sections from the master document below and adapt them for ${targetPlatform}.\n\n${params.content}`);
  zip.file("WORKFLOWS.md", `# ${params.title} Workflow Blueprint\n\nUse the workflow, SOP, QA, and implementation sections from the master document below.\n\n${params.content}`);
  zip.file("PLATFORM-ADAPTATION-GUIDE.md", `# Platform Adaptation Guide\n\nTarget platform: ${targetPlatform}\n\n${platformInstallGuide(targetPlatform)}\n\n## Claude\n\nInstall as Project instructions, SKILL.md, artifacts, and reusable prompt blocks.\n\n## ChatGPT\n\nInstall as Custom GPT instructions, project knowledge, prompt starters, and workflow checklists.\n\n## Manus\n\nInstall as project instructions, agent runbooks, and task planning templates.\n\n## Grok/Groq\n\nUse as compact system guidance, high-speed prompt templates, and API orchestration notes.\n\n## General AI\n\nPreserve the role, context, task, constraints, output format, QA, and implementation sections.`);
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file(
    "USAGE-GUIDE.md",
    `# ${params.title} Usage Guide\n\nThis package was generated by Skills Magic AI for ${targetPlatform}.\n\n## Install\n\n${platformInstallGuide(targetPlatform)}\n\n## Files\n\n- \`MASTER-OPERATING-SYSTEM.md\`: The primary operating system, skill, prompt, workflow, or bundle document.\n- \`SKILL.md\`: A Claude-style skill file that can also be adapted into platform instructions.\n- \`PROMPTS.md\`: Prompt system and reusable conversation templates.\n- \`WORKFLOWS.md\`: Workflow blueprint, SOP notes, and QA sequence.\n- \`PLATFORM-ADAPTATION-GUIDE.md\`: Installation guidance for Claude, ChatGPT, Manus, Grok/Groq, and general AI.\n- \`manifest.json\`: Package metadata for cataloging, sale, or reuse.\n- \`USAGE-GUIDE.md\`: This quick-start guide.\n\n## Quality Check\n\nReview the instructions, adapt examples to the buyer's industry, test the package with representative tasks, and verify that outputs are useful, specific, safe, and commercially ready before selling or publishing it.\n`,
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${slug}-ai-operating-system-package.zip`);
}
