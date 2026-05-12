import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const appShellSource = readFileSync(join(process.cwd(), "client/src/components/AppShell.tsx"), "utf8");

describe("AppShell navigation layout", () => {
  it("uses the brand mark as the desktop home link instead of rendering a duplicate Home pill", () => {
    expect(appShellSource).toContain('aria-label="Skillz Magic AI Studio home"');
    expect(appShellSource).toContain('const desktopNavItems = [');
    expect(appShellSource).toContain('const mobileNavItems = [{ href: "/", label: "Home" }, ...desktopNavItems]');

    const desktopItemsBlock = appShellSource.match(/const desktopNavItems = \[([\s\S]*?)\];/)?.[1] ?? "";
    expect(desktopItemsBlock).not.toContain('label: "Home"');
    expect(desktopItemsBlock).toContain('label: "Builder"');
  });

  it("keeps the desktop header from squeezing navigation into the brand area", () => {
    expect(appShellSource).toContain('className="flex w-max items-center gap-2"');
    expect(appShellSource).toContain('className="flex shrink-0 items-center gap-3"');
    expect(appShellSource).toContain('className="hidden min-w-0 flex-1 justify-center 2xl:flex"');
    expect(appShellSource).toContain('className="hidden shrink-0 items-center gap-3 2xl:flex"');
    expect(appShellSource).toContain('className="ml-auto bg-white 2xl:hidden"');
    expect(appShellSource).not.toContain('className="flex min-w-0 items-center gap-2"');
  });
});
