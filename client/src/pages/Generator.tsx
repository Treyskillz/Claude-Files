import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { buildRecommendedAssetFocus, getAssetNeedProfile, getSuggestedAssetPrice, industryCategories, professionCategories } from "@/lib/categoryStrategy";
import { copyToClipboard, exportClaudePluginZip, exportToMarkdown, exportToPDF } from "@/lib/export";
import { BriefcaseBusiness, CheckCircle2, Download, FileArchive, FileDown, Info, Loader2, PackagePlus, Save, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const quickIdeas = [
  "Real estate agent master AI operating system",
  "Healthcare office patient follow-up prompt pack",
  "Consultant client onboarding skill",
  "Insurance broker lead qualification workflow bundle",
];

const platformOptions = ["All Platforms", "Claude", "ChatGPT", "Manus", "Grok/Groq", "General AI", "Other / Custom Platform"] as const;

type TargetPlatform = (typeof platformOptions)[number];
type AssetType = "master_os" | "skill" | "prompt" | "workflow" | "bundle";
type Mode = "autonomous" | "assisted";

const assetTypeLabels: Record<AssetType, string> = {
  master_os: "Master Operating System",
  skill: "AI skill",
  prompt: "prompt system",
  workflow: "workflow blueprint",
  bundle: "asset bundle",
};

function getPlatformInstallSteps(platform: string) {
  if (platform === "Claude") {
    return [
      "Create or open a Claude Project and paste the master instructions into Project instructions.",
      "Upload or copy SKILL.md, PROMPTS.md, and WORKFLOWS.md as reusable project knowledge.",
      "Run one real buyer task and refine examples, compliance notes, and output format rules.",
    ];
  }
  if (platform === "ChatGPT") {
    return [
      "Paste the master instructions into a Custom GPT or ChatGPT Project instruction area.",
      "Add PROMPTS.md as conversation starters and WORKFLOWS.md as repeatable action checklists.",
      "Test with one realistic customer scenario before selling, sharing, or publishing the package.",
    ];
  }
  if (platform === "Manus") {
    return [
      "Use the master document as project instructions and the workflows as agent runbooks.",
      "Keep the prompt templates available as repeatable task starters inside the project workspace.",
      "Treat the QA rules as the completion checklist for every generated business deliverable.",
    ];
  }
  if (platform === "Grok/Groq") {
    return [
      "Use PROMPTS.md as concise high-speed prompt patterns and keep longer SOPs in a reference file.",
      "Adapt the master instructions into system guidance or API-side orchestration notes.",
      "Run a speed-focused test and shorten any instructions that are too long for the selected workflow.",
    ];
  }
  return [
    "Read the master document first so you understand the asset purpose, rules, and intended buyer outcome.",
    "Paste the master instructions into the selected AI tool's project, custom-instruction, system, or workspace guidance area.",
    "Add the prompt and workflow files as reusable templates, then run one realistic test before customer delivery.",
  ];
}

export default function Generator() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [assetType, setAssetType] = useState<AssetType>("master_os");
  const [mode, setMode] = useState<Mode>("autonomous");
  const [title, setTitle] = useState("");
  const [professionCategory, setProfessionCategory] = useState("Consultants & Coaches");
  const [industryCategory, setIndustryCategory] = useState("Professional Services");
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>("All Platforms");
  const [businessType, setBusinessType] = useState("");
  const [customProfessionCategory, setCustomProfessionCategory] = useState("");
  const [customIndustryCategory, setCustomIndustryCategory] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [customAssetCategory, setCustomAssetCategory] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [monetization, setMonetization] = useState("One-off download or bundled marketplace package");
  const [result, setResult] = useState<{ title: string; content: string; manifest?: Record<string, unknown>; generatedBy?: string } | null>(null);

  const createAsset = trpc.generator.create.useMutation({
    onSuccess(data) {
      setResult(data);
      toast.success("Asset generated and ready to export.");
    },
    onError(error) {
      toast.error(error.message || "Generation failed. Please try again.");
    },
  });
  const saveProduct = trpc.marketplace.saveProduct.useMutation({
    onSuccess() {
      toast.success("Marketplace listing saved.");
    },
    onError(error) {
      toast.error(error.message || "Sign in to save marketplace listings.");
    },
  });
  const publishPackage = trpc.admin.publishGeneratedAsset.useMutation({
    onSuccess(data) {
      toast.success(data.message || "Package published to the marketplace.");
    },
    onError(error) {
      toast.error(error.message || "Admin package publishing failed.");
    },
  });

  const generatedTitle = result?.title || title || "Skillz Magic AI Studio asset";
  const promptHint = useMemo(() => quickIdeas[Math.floor(Math.random() * quickIdeas.length)], []);
  const effectiveProfessionCategory = professionCategory === "Other / Custom Profession" ? customProfessionCategory.trim() || "Custom profession" : professionCategory;
  const effectiveIndustryCategory = industryCategory === "Other / Custom Industry" ? customIndustryCategory.trim() || "Custom industry" : industryCategory;
  const effectiveTargetPlatform = targetPlatform === "Other / Custom Platform" ? customPlatform.trim() || "Custom AI platform" : targetPlatform;
  const effectiveAssetCategory = customAssetCategory.trim();
  const customCategoryContext = `${role} ${businessType} ${customProfessionCategory} ${customIndustryCategory} ${customPlatform} ${effectiveAssetCategory}`.trim();
  const recommendedNeeds = getAssetNeedProfile(effectiveProfessionCategory, effectiveIndustryCategory, customCategoryContext);
  const recommendedAssetFocus = useMemo(() => buildRecommendedAssetFocus(recommendedNeeds), [recommendedNeeds]);
  const suggestedPrice = getSuggestedAssetPrice(assetType, recommendedNeeds);
  const assetLabel = assetTypeLabels[assetType];
  const installSteps = getPlatformInstallSteps(effectiveTargetPlatform);

  const generate = async (forcedMode?: Mode) => {
    const selectedMode = forcedMode ?? mode;
    await createAsset.mutateAsync({
      assetType,
      mode: selectedMode,
      title: title || undefined,
      professionCategory: effectiveProfessionCategory || undefined,
      industryCategory: effectiveIndustryCategory || undefined,
      recommendedAssetFocus,
      targetPlatform: effectiveTargetPlatform,
      businessType: businessType || undefined,
      customCategoryContext: effectiveAssetCategory || undefined,
      role: role || effectiveProfessionCategory || undefined,
      industry: industry || effectiveIndustryCategory || undefined,
      audience: audience || `${effectiveProfessionCategory} serving ${effectiveIndustryCategory} clients`,
      goal: goal || `create a commercially useful ${assetType === "master_os" ? "Master Operating System" : assetType} based on the daily operating systems, skills, prompts, and workflows needed by ${effectiveProfessionCategory} in ${effectiveIndustryCategory}${effectiveAssetCategory ? ` with custom category context: ${effectiveAssetCategory}` : ""} for ${effectiveTargetPlatform}` ,
      constraints: constraints || undefined,
      monetization: monetization || undefined,
      tone: "professional, practical, premium, concise",
    });
  };

  const saveToLocalLibrary = () => {
    if (!result) return;
    const item = {
      id: crypto.randomUUID(),
      title: result.title,
      assetType,
      source: mode,
      targetPlatform: effectiveTargetPlatform,
      businessType,
      customAssetCategory: effectiveAssetCategory,
      professionCategory: effectiveProfessionCategory,
      industryCategory: effectiveIndustryCategory,
      recommendedAssetFocus,
      content: result.content,
      manifest: result.manifest,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("skillz-magic-ai-studio-local-assets") || localStorage.getItem("skills-magic-ai-local-assets") || localStorage.getItem("skills-maker-ai-local-assets") || "[]");
    localStorage.setItem("skillz-magic-ai-studio-local-assets", JSON.stringify([item, ...existing]));
    toast.success("Saved to local library.");
  };

  const addToMarketplace = async () => {
    if (!result) return;
    await saveProduct.mutateAsync({
      title: result.title,
      category: `${effectiveTargetPlatform} · ${effectiveProfessionCategory} · ${effectiveAssetCategory || (assetType === "master_os" ? "Master Operating System" : assetType)}`,
      packageType: assetType === "bundle" || assetType === "master_os" ? "bundle" : "individual",
      priceCents: suggestedPrice,
      description: `${effectiveTargetPlatform} ${effectiveAssetCategory || (assetType === "master_os" ? "Master Operating System" : assetType)} for ${effectiveProfessionCategory} in ${effectiveIndustryCategory}. Includes recommended operating systems, skills, prompts, workflows, platform adaptation notes, Markdown, PDF-ready content, manifest, and usage guidance.`,
      includedFiles: ["MASTER-OPERATING-SYSTEM.md", "SKILL.md", "PROMPTS.md", "WORKFLOWS.md", "manifest.json", "USAGE-GUIDE.md", "CATEGORY-ASSET-MAP.md", "PLATFORM-ADAPTATION-GUIDE.md", `${result.title}.pdf`],
    });
  };

  const publishAdminPackage = async () => {
    if (!result || !isAdmin) return;
    await publishPackage.mutateAsync({
      title: result.title,
      assetType,
      content: result.content,
      summary: `${effectiveTargetPlatform} ${effectiveAssetCategory || assetLabel} for ${effectiveProfessionCategory} in ${effectiveIndustryCategory}. Includes operating guidance, prompt systems, workflow steps, install guidance, and customer-ready packaging notes.`,
      priceCents: suggestedPrice,
      packageType: assetType === "bundle" || assetType === "master_os" ? "bundle" : "individual",
    });
  };

  return (
    <div className="bg-zinc-50 py-6 sm:py-8 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Wand2 className="mr-2 h-4 w-4" /> Multi-platform Master Operating Systems</Badge>
            <h1 className="text-3xl font-black tracking-[-0.05em] text-zinc-950 sm:text-4xl md:text-6xl">Create Master Operating Systems by profession, industry, and AI platform.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
              Generate Master Operating Systems, skills, prompt systems, workflow blueprints, or bundles for Claude, ChatGPT, Manus, Grok/Groq, and general AI use. The app recommends the operating systems, skills, prompts, workflows, and package structure those buyers are most likely to need.
            </p>
            {isAdmin ? (
              <div className="mt-5 flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                <ShieldCheck className="h-4 w-4" /> Owner/admin mode: Builder generation and all local export downloads are included without checkout.
              </div>
            ) : null}
          </div>
          <Button size="lg" className="w-full justify-center rounded-full bg-red-600 text-white hover:bg-red-700 sm:w-auto" disabled={createAsset.isPending} onClick={() => generate("autonomous")}>
            {createAsset.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            Generate instantly
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <Card className="premium-card rounded-3xl">
            <CardHeader>
              <CardTitle>Generator controls</CardTitle>
              <CardDescription>Start from a profession and industry, then refine the asset with role, goal, constraints, and package format. Suggested idea: {promptHint}.</CardDescription>
            </CardHeader>
            <CardContent>
                  <Tabs value={assetType} onValueChange={value => setAssetType(value as AssetType)}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-zinc-100 p-1 sm:grid-cols-3 lg:grid-cols-5">
                  <TabsTrigger className="text-xs sm:text-sm" value="master_os">Master OS</TabsTrigger>
                  <TabsTrigger className="text-xs sm:text-sm" value="skill">Skill</TabsTrigger>
                  <TabsTrigger className="text-xs sm:text-sm" value="prompt">Prompt</TabsTrigger>
                  <TabsTrigger className="text-xs sm:text-sm" value="workflow">Workflow</TabsTrigger>
                  <TabsTrigger className="text-xs sm:text-sm" value="bundle">Bundle</TabsTrigger>
                </TabsList>
                <TabsContent value={assetType} className="mt-6 grid gap-5">
                  <div className="grid gap-2">
                    <Label>Generation mode</Label>
                    <Select value={mode} onValueChange={value => setMode(value as Mode)}>
                      <SelectTrigger><SelectValue placeholder="Choose mode" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="autonomous">Autonomous: profession and industry defaults</SelectItem>
                        <SelectItem value="assisted">Assisted: use my detailed inputs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>AI platform</Label>
                      <Select value={targetPlatform} onValueChange={value => setTargetPlatform(value as TargetPlatform)}>
                        <SelectTrigger><SelectValue placeholder="Choose platform" /></SelectTrigger>
                        <SelectContent>{platformOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                      </Select>
                      {targetPlatform === "Other / Custom Platform" && (
                        <Input value={customPlatform} onChange={event => setCustomPlatform(event.target.value)} placeholder="Type any AI platform, model, workspace, or tool" />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Business type</Label>
                      <Input value={businessType} onChange={event => setBusinessType(event.target.value)} placeholder="Agency, solo practice, clinic, local service firm" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Other / Custom asset category context</Label>
                    <Input value={customAssetCategory} onChange={event => setCustomAssetCategory(event.target.value)} placeholder="Optional: type any product category, department, workflow family, compliance niche, or buyer segment" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Profession category</Label>
                      <Select value={professionCategory} onValueChange={setProfessionCategory}>
                        <SelectTrigger><SelectValue placeholder="Choose profession" /></SelectTrigger>
                        <SelectContent>{professionCategories.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                      </Select>
                      {professionCategory === "Other / Custom Profession" && (
                        <Input value={customProfessionCategory} onChange={event => setCustomProfessionCategory(event.target.value)} placeholder="Type any profession, role, or buyer segment" />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label>Industry category</Label>
                      <Select value={industryCategory} onValueChange={setIndustryCategory}>
                        <SelectTrigger><SelectValue placeholder="Choose industry" /></SelectTrigger>
                        <SelectContent>{industryCategories.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                      </Select>
                      {industryCategory === "Other / Custom Industry" && (
                        <Input value={customIndustryCategory} onChange={event => setCustomIndustryCategory(event.target.value)} placeholder="Type any industry, market, or niche" />
                      )}
                    </div>
                  </div>
                  <Card className="rounded-3xl border-red-100 bg-red-50/60">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2 font-bold text-zinc-950"><BriefcaseBusiness className="h-5 w-5 text-red-600" /> Recommended category asset map</div>
                      <p className="mb-3 text-sm leading-6 text-zinc-700"><strong className="text-zinc-950">Active category context:</strong> {effectiveTargetPlatform} · {effectiveProfessionCategory} · {effectiveIndustryCategory}{effectiveAssetCategory ? ` · ${effectiveAssetCategory}` : ""}</p>
                      <div className="grid gap-3 text-sm leading-6 text-zinc-700 md:grid-cols-3">
                        <p><strong className="text-zinc-950">Operating systems:</strong> {recommendedNeeds.operatingSystems.join(", ")}</p>
                        <p><strong className="text-zinc-950">Skills:</strong> {recommendedNeeds.skills.join(", ")}</p>
                        <p><strong className="text-zinc-950">Prompts:</strong> {recommendedNeeds.prompts.join(", ")}</p>
                        <p><strong className="text-zinc-950">Workflows:</strong> {recommendedNeeds.workflows.join(", ")}</p>
                      </div>
                      <p className="mt-3 text-sm text-zinc-700"><strong className="text-zinc-950">Suggested one-off price:</strong> ${(suggestedPrice / 100).toFixed(0)} for this {assetType}.</p>
                    </CardContent>
                  </Card>
                  <div className="grid gap-2">
                    <Label>Asset title</Label>
                    <Input value={title} onChange={event => setTitle(event.target.value)} placeholder="Example: Real Estate Agency Master Operating System" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2"><Label>Specific role</Label><Input value={role} onChange={e => setRole(e.target.value)} placeholder="Agent, broker, office manager" /></div>
                    <div className="grid gap-2"><Label>Specific niche</Label><Input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Luxury listings, elder care, tax prep" /></div>
                  </div>
                  <div className="grid gap-2"><Label>Audience</Label><Input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Who will use or buy this asset?" /></div>
                  <div className="grid gap-2"><Label>Goal</Label><Textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Describe the outcome this asset should create." /></div>
                  <div className="grid gap-2"><Label>Constraints</Label><Textarea value={constraints} onChange={e => setConstraints(e.target.value)} placeholder="Tone, compliance needs, format rules, excluded topics, examples." /></div>
                  <div className="grid gap-2"><Label>Monetization</Label><Input value={monetization} onChange={e => setMonetization(e.target.value)} placeholder="Individual download, bundle, internal SOP, subscription library" /></div>
                  <Button className="w-full rounded-full bg-zinc-950 text-white hover:bg-red-700" disabled={createAsset.isPending} onClick={() => generate()}>
                    {createAsset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate with custom category strategy
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="premium-card rounded-3xl">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Output preview</CardTitle>
                  <CardDescription>Copy into Claude, ChatGPT, Manus, Grok/Groq, or another AI tool; download Markdown/PDF; save locally; or package as a platform-ready ZIP.</CardDescription>
                </div>
                <Badge variant="outline" className="w-fit rounded-full bg-white">{result?.generatedBy || "Ready"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="no-print grid grid-cols-2 gap-2 border-b bg-white p-3 sm:flex sm:flex-wrap sm:p-4">
                {isAdmin ? (
                  <div className="col-span-2 flex w-full items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 sm:text-sm">
                    <ShieldCheck className="h-4 w-4 shrink-0" /> Admin exports unlocked: Markdown, PDF, and Platform ZIP downloads do not require payment for this owner account.
                  </div>
                ) : null}
                <Button variant="outline" className="justify-center bg-white text-xs sm:text-sm" disabled={!result} onClick={() => result && copyToClipboard(result.content).then(() => toast.success(`Copied for ${effectiveTargetPlatform}.`))}><Download className="mr-2 h-4 w-4" /> Copy</Button>
                <Button variant="outline" className="justify-center bg-white text-xs sm:text-sm" disabled={!result} onClick={() => result && exportToMarkdown(result.content, generatedTitle)}><FileDown className="mr-2 h-4 w-4" /> Markdown</Button>
                <Button variant="outline" className="justify-center bg-white text-xs sm:text-sm" disabled={!result} onClick={() => result && exportToPDF(result.content, generatedTitle, effectiveTargetPlatform)}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
                <Button variant="outline" className="justify-center bg-white text-xs sm:text-sm" disabled={!result} onClick={() => result && exportClaudePluginZip({ title: generatedTitle, content: result.content, assetType, manifest: { ...result.manifest, targetPlatform: effectiveTargetPlatform, businessType, customAssetCategory: effectiveAssetCategory } })}><FileArchive className="mr-2 h-4 w-4" /> Platform ZIP</Button>
                <Button variant="outline" className="justify-center bg-white text-xs sm:text-sm" disabled={!result} onClick={saveToLocalLibrary}><Save className="mr-2 h-4 w-4" /> Save</Button>
                <Button className="justify-center bg-red-600 text-xs hover:bg-red-700 sm:text-sm" disabled={!result || saveProduct.isPending} onClick={addToMarketplace}><PackagePlus className="mr-2 h-4 w-4" /> Add listing</Button>
                {isAdmin ? (
                  <Button className="justify-center bg-zinc-950 text-xs text-white hover:bg-red-700 sm:text-sm" disabled={!result || publishPackage.isPending} onClick={publishAdminPackage}>
                    {publishPackage.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />} Publish package
                  </Button>
                ) : null}
              </div>
              {result && (
                <div className="no-print border-b bg-red-50/50 p-4 sm:p-5">
                  <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
                      <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-red-700"><Info className="h-4 w-4" /> What this asset does</p>
                      <p className="mt-3 text-sm leading-6 text-zinc-700">
                        This {assetLabel} is built for {effectiveProfessionCategory} in {effectiveIndustryCategory} using {effectiveTargetPlatform}. It explains the asset purpose, operating rules, prompts, workflow steps, output expectations, and QA requirements so a buyer understands how to use it before copying it into an AI platform.
                      </p>
                      <p className="mt-3 rounded-2xl bg-zinc-50 p-3 text-xs font-semibold leading-5 text-zinc-700">
                        Download branding: <span className="text-zinc-950">Freedom One Academy</span> · Contact: <span className="text-zinc-950">freedom1.digital.@gmail.com</span>
                      </p>
                    </div>
                    <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
                      <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-red-700"><CheckCircle2 className="h-4 w-4" /> How to add it to your AI</p>
                      <ol className="mt-3 grid gap-3 text-sm leading-6 text-zinc-700">
                        {installSteps.map(step => (
                          <li key={step} className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-3 text-xs leading-5 text-zinc-500">The Markdown, PDF, and ZIP downloads also include usage and platform adaptation guidance for customer delivery.</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="print-area print-surface min-h-[520px] p-4 sm:min-h-[640px] sm:p-6 lg:p-7">
                {result ? (
                  <article className="prose prose-zinc max-w-none">
                    <h2 className="mb-4 text-2xl font-black tracking-[-0.04em] text-zinc-950 sm:text-3xl">{result.title}</h2>
                    <Streamdown>{result.content}</Streamdown>
                  </article>
                ) : (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center sm:min-h-[520px]">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700"><Sparkles className="h-8 w-8" /></div>
                    <h2 className="text-2xl font-black text-zinc-950">Your generated asset will appear here.</h2>
                    <p className="mt-3 max-w-xl leading-7 text-zinc-600">Choose an AI platform, profession, industry, or business type, then generate a category-specific Master Operating System, skill, prompt, workflow, or bundle with clear package details.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
