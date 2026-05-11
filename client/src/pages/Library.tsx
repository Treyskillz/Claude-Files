import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { copyToClipboard, exportToMarkdown, exportToPDF } from "@/lib/export";
import { ExternalLink, FileDown, LibraryBig, Link as LinkIcon, Search } from "lucide-react";
import { toast } from "sonner";

const officialResources = [
  { title: "Claude Skills overview", category: "Official reference", url: "https://support.anthropic.com/en/articles/11175166-getting-started-with-skills", summary: "Anthropic guidance for understanding and using Claude Skills." },
  { title: "Claude prompt engineering", category: "Official prompting", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", summary: "Official Claude prompting principles and examples for higher-quality prompts." },
  { title: "Claude tool use", category: "Developer workflow", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview", summary: "Guidance on tool use patterns that can inspire workflow and automation assets." },
  { title: "Claude API documentation", category: "Developer docs", url: "https://docs.anthropic.com/", summary: "Primary documentation hub for Claude capabilities, APIs, and implementation patterns." },
];

type LocalAsset = { id: string; title: string; assetType?: string; source?: string; content: string; createdAt?: string; fileName?: string };

export default function Library() {
  const [query, setQuery] = useState("");
  const [localAssets, setLocalAssets] = useState<LocalAsset[]>([]);
  const mine = trpc.generator.listMine.useQuery(undefined, { retry: false });

  useEffect(() => {
    const generated = JSON.parse(localStorage.getItem("skills-magic-ai-local-assets") || "[]");
    const uploaded = JSON.parse(localStorage.getItem("skills-magic-ai-uploaded-resources") || "[]");
    setLocalAssets([...generated, ...uploaded]);
  }, []);

  const search = query.trim().toLowerCase();
  const generatedAssets = useMemo(() => {
    const remote = (mine.data || []).map(item => ({
      id: String(item.id),
      title: item.title,
      assetType: item.assetType,
      source: item.source,
      content: item.content ?? "",
      createdAt: item.createdAt ? new Date(Number(item.createdAt)).toISOString() : undefined,
    }));
    return [...remote, ...localAssets.filter(item => item.source !== "uploaded")].filter(item =>
      !search || `${item.title} ${item.assetType} ${item.source} ${item.content}`.toLowerCase().includes(search),
    );
  }, [mine.data, localAssets, search]);

  const uploads = localAssets.filter(item => item.source === "uploaded" && (!search || `${item.title} ${item.fileName} ${item.content}`.toLowerCase().includes(search)));
  const official = officialResources.filter(item => !search || `${item.title} ${item.category} ${item.summary}`.toLowerCase().includes(search));

  const AssetCard = ({ item }: { item: LocalAsset }) => (
    <Card className="rounded-3xl bg-white shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{item.title}</CardTitle>
            <CardDescription className="mt-2">{item.assetType || "resource"} · {item.source || "local"}</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full bg-zinc-50">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Local"}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{item.content}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="bg-white" onClick={() => copyToClipboard(item.content).then(() => toast.success("Copied."))}>Copy</Button>
          <Button size="sm" variant="outline" className="bg-white" onClick={() => exportToMarkdown(item.content, item.title)}><FileDown className="mr-2 h-4 w-4" /> Markdown</Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => exportToPDF(item.content, item.title)}>PDF</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container">
        <div className="mb-8 grid gap-5 md:grid-cols-[1fr_360px] md:items-end">
          <div>
            <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><LibraryBig className="mr-2 h-4 w-4" /> Searchable resource library</Badge>
            <h1 className="font-[Sora] text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Keep every Claude asset organized.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">Browse generated assets, imported resources, and official Anthropic references with clear source labels and export actions.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search assets and resources" className="h-12 rounded-full bg-white pl-10" />
          </div>
        </div>

        <Tabs defaultValue="generated">
          <TabsList className="mb-6 grid w-full max-w-3xl grid-cols-3">
            <TabsTrigger value="generated">Generated assets</TabsTrigger>
            <TabsTrigger value="official">Anthropic resources</TabsTrigger>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
          </TabsList>
          <TabsContent value="generated">
            {mine.error ? <p className="mb-4 rounded-2xl border bg-white p-4 text-sm text-zinc-600">Sign in to sync server-saved assets. Local assets remain available.</p> : null}
            <div className="grid gap-5 lg:grid-cols-2">{generatedAssets.length ? generatedAssets.map(item => <AssetCard key={item.id} item={item} />) : <EmptyState text="Generate or save an asset to see it here." />}</div>
          </TabsContent>
          <TabsContent value="official">
            <div className="grid gap-5 lg:grid-cols-2">
              {official.map(item => (
                <Card key={item.url} className="rounded-3xl bg-white shadow-sm">
                  <CardHeader>
                    <Badge className="mb-2 w-fit rounded-full bg-zinc-950 text-white hover:bg-zinc-950">{item.category}</Badge>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="rounded-full bg-red-600 hover:bg-red-700"><a href={item.url} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Open resource</a></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="uploads">
            <div className="grid gap-5 lg:grid-cols-2">{uploads.length ? uploads.map(item => <AssetCard key={item.id} item={item} />) : <EmptyState text="Upload .md, .txt, or PDF-derived resources to build a local library." />}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-3xl border bg-white p-10 text-center text-zinc-600"><LinkIcon className="mx-auto mb-4 h-10 w-10 text-red-600" /><p>{text}</p></div>;
}
