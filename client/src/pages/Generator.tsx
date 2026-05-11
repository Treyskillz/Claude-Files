import { useMemo, useState } from "react";
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
import { BriefcaseBusiness, Download, FileArchive, FileDown, Loader2, PackagePlus, Save, Sparkles, Wand2 } from "lucide-react";
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

export default function Generator() {
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

  const generatedTitle = result?.title || title || "Skills Magic AI asset";
  const promptHint = useMemo(() => quickIdeas[Math.floor(Math.random() * quickIdeas.length)], []);
  const effectiveProfessionCategory = professionCategory === "Other / Custom Profession" ? customProfessionCategory.trim() || "Custom profession" : professionCategory;
  const effectiveIndustryCategory = industryCategory === "Other / Custom Industry" ? customIndustryCategory.trim() || "Custom industry" : industryCategory;
  const effectiveTargetPlatform = targetPlatform === "Other / Custom Platform" ? customPlatform.trim() || "Custom AI platform" : targetPlatform;
  const effectiveAssetCategory = customAssetCategory.trim();
  const customCategoryContext = `${role} ${businessType} ${customProfessionCategory} ${customIndustryCategory} ${customPlatform} ${effectiveAssetCategory}`.trim();
  const recommendedNeeds = getAssetNeedProfile(effectiveProfessionCategory, effectiveIndustryCategory, customCategoryContext);
  const recommendedAssetFocus = useMemo(() => buildRecommendedAssetFocus(recommendedNeeds), [recommendedNeeds]);
  const suggestedPrice = getSuggestedAssetPrice(assetType, recommendedNeeds);

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
    const existing = JSON.parse(localStorage.getItem("skills-magic-ai-local-assets") || localStorage.getItem("skills-maker-ai-local-assets") || "[]");
    localStorage.setItem("skills-magic-ai-local-assets", JSON.stringify([item, ...existing]));
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

  return (
    <div className="bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><Wand2 className="mr-2 h-4 w-4" /> Multi-platform Master Operating Systems</Badge>
            <h1 className="font-[Sora] text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Create Master Operating Systems by profession, industry, and AI platform.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
              Generate Master Operating Systems, skills, prompt systems, workflow blueprints, or bundles for Claude, ChatGPT, Manus, Grok/Groq, and general AI use. The app recommends the operating systems, skills, prompts, workflows, and pricing structure those buyers are most likely to need.
            </p>
          </div>
          <Button size="lg" className="rounded-full bg-red-600 text-white hover:bg-red-700" disabled={createAsset.isPending} onClick={() => generate("autonomous")}>
            {createAsset.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            Generate instantly
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <Card className="premium-card rounded-3xl">
            <CardHeader>
              <CardTitle>Generator controls</CardTitle>
              <CardDescription>Start from a profession and industry, then refine the asset with role, goal, constraints, and monetization. Suggested idea: {promptHint}.</CardDescription>
            </CardHeader>
            <CardContent>
                  <Tabs value={assetType} onValueChange={value => setAssetType(value as AssetType)}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="master_os">Master OS</TabsTrigger>
                  <TabsTrigger value="skill">Skill</TabsTrigger>
                  <TabsTrigger value="prompt">Prompt</TabsTrigger>
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                  <TabsTrigger value="bundle">Bundle</TabsTrigger>
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
              <div className="no-print flex flex-wrap gap-2 border-b bg-white p-4">
                <Button variant="outline" className="bg-white" disabled={!result} onClick={() => result && copyToClipboard(result.content).then(() => toast.success(`Copied for ${effectiveTargetPlatform}.`))}><Download className="mr-2 h-4 w-4" /> Copy</Button>
                <Button variant="outline" className="bg-white" disabled={!result} onClick={() => result && exportToMarkdown(result.content, generatedTitle)}><FileDown className="mr-2 h-4 w-4" /> Markdown</Button>
                <Button variant="outline" className="bg-white" disabled={!result} onClick={() => result && exportToPDF(result.content, generatedTitle, effectiveTargetPlatform)}><FileDown className="mr-2 h-4 w-4" /> PDF</Button>
                <Button variant="outline" className="bg-white" disabled={!result} onClick={() => result && exportClaudePluginZip({ title: generatedTitle, content: result.content, assetType, manifest: { ...result.manifest, targetPlatform: effectiveTargetPlatform, businessType, customAssetCategory: effectiveAssetCategory } })}><FileArchive className="mr-2 h-4 w-4" /> Platform ZIP</Button>
                <Button variant="outline" className="bg-white" disabled={!result} onClick={saveToLocalLibrary}><Save className="mr-2 h-4 w-4" /> Save</Button>
                <Button className="bg-red-600 hover:bg-red-700" disabled={!result || saveProduct.isPending} onClick={addToMarketplace}><PackagePlus className="mr-2 h-4 w-4" /> Add listing</Button>
              </div>
              <div className="print-area print-surface min-h-[640px] p-7">
                {result ? (
                  <article className="prose prose-zinc max-w-none">
                    <h2 className="mb-4 text-3xl font-black tracking-[-0.04em] text-zinc-950">{result.title}</h2>
                    <Streamdown>{result.content}</Streamdown>
                  </article>
                ) : (
                  <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700"><Sparkles className="h-8 w-8" /></div>
                    <h2 className="text-2xl font-black text-zinc-950">Your generated asset will appear here.</h2>
                    <p className="mt-3 max-w-xl leading-7 text-zinc-600">Choose an AI platform, profession, industry, or business type, then generate a category-specific Master Operating System, skill, prompt, workflow, or bundle with pricing guidance.</p>
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
