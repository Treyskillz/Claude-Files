import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Upload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");

  const readFile = async (file: File) => {
    setFileName(file.name);
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      setContent(`PDF import placeholder for ${file.name}. For best results, paste the key Claude resource text below after reviewing the PDF.`);
      toast.info("PDF selected. Paste extracted text into the editor before saving.");
      return;
    }
    const text = await file.text();
    setContent(text);
    toast.success("File loaded into the editor.");
  };

  const save = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Add a title and resource content before saving.");
      return;
    }
    const resource = {
      id: crypto.randomUUID(),
      title: title.trim(),
      fileName,
      assetType: "resource",
      source: "uploaded",
      content,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("skillz-magic-ai-studio-uploaded-resources") || localStorage.getItem("skills-magic-ai-uploaded-resources") || localStorage.getItem("skills-maker-ai-uploaded-resources") || "[]");
    localStorage.setItem("skillz-magic-ai-studio-uploaded-resources", JSON.stringify([resource, ...existing]));
    toast.success("Resource saved to your local library.");
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10 md:py-14">
      <div className="container grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Badge className="mb-4 rounded-full bg-red-100 text-red-700 hover:bg-red-100"><UploadCloud className="mr-2 h-4 w-4" /> User upload library</Badge>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-zinc-950 md:text-6xl">Import your own Claude resources.</h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">Upload or paste prompts, skills, workflows, templates, and notes. Skillz Magic AI Studio stores them in your browser so they can be searched, copied, and exported from the library without extra backend complexity.</p>
          <Card className="mt-8 rounded-3xl bg-white shadow-sm">
            <CardHeader><CardTitle>Supported resources</CardTitle><CardDescription>Markdown and plain text files load directly. PDF files can be cataloged, then refined by pasting extracted text.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 text-sm text-zinc-600">
              <p><strong className="text-zinc-950">Best formats:</strong> .md, .txt, Claude prompt notes, SKILL.md drafts, workflow SOPs, and templates.</p>
              <p><strong className="text-zinc-950">Privacy:</strong> Local imports remain in browser storage unless you manually copy them elsewhere.</p>
              <Button asChild variant="outline" className="mt-2 w-fit rounded-full bg-white"><Link href="/library">Open library</Link></Button>
            </CardContent>
          </Card>
        </div>
        <Card className="premium-card rounded-3xl">
          <CardHeader><CardTitle>Upload or paste content</CardTitle><CardDescription>Drag-and-drop support is included through the file selector area below.</CardDescription></CardHeader>
          <CardContent className="grid gap-5">
            <input ref={inputRef} type="file" accept=".md,.txt,.pdf,text/markdown,text/plain,application/pdf" className="hidden" onChange={event => event.target.files?.[0] && readFile(event.target.files[0])} />
            <button type="button" onClick={() => inputRef.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if (file) void readFile(file); }} className="rounded-3xl border-2 border-dashed border-red-200 bg-red-50/40 p-10 text-center transition hover:border-red-500 hover:bg-red-50">
              <UploadCloud className="mx-auto mb-4 h-12 w-12 text-red-600" />
              <span className="block text-lg font-black text-zinc-950">Drop a Claude resource file here or click to browse</span>
              <span className="mt-2 block text-sm text-zinc-600">Accepted: .md, .txt, .pdf</span>
            </button>
            <div className="grid gap-2"><Label>Resource title</Label><Input value={title} onChange={event => setTitle(event.target.value)} placeholder="Example: Sales Call Review Prompt" /></div>
            <div className="grid gap-2"><Label>Resource content</Label><Textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Paste Claude prompt, skill, workflow, or template content here." className="min-h-[360px] font-mono text-sm" /></div>
            <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700" onClick={save}><Save className="mr-2 h-5 w-5" /> Save to local library</Button>
            {fileName ? <p className="flex items-center gap-2 text-sm text-zinc-500"><FileText className="h-4 w-4" /> Current file: {fileName}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
