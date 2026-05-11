# Skills Magic AI GitHub Delivery and Deployment Guide

## Purpose

This guide documents how to hand off, migrate, publish, or push the **Skills Magic AI** application source after QA. The app is a React, Express, tRPC, Drizzle, Manus Auth, database, and Stripe-enabled web application that generates multi-platform Master Operating Systems, skills, prompts, workflows, downloadable bundles, and marketplace-ready AI asset packages.

The project has passed the current QA validation suite and production build checks. Before publishing or transferring to GitHub, create a Manus checkpoint so the exact source state can be restored from the project interface.

## Project Structure

| Path | Purpose |
|---|---|
| `client/src/pages/` | Public and app pages, including Home, Generator, Instructions, Library, Upload, Marketplace, and Pricing. |
| `client/src/components/` | Shared layout and UI components, including the global app shell. |
| `client/src/lib/` | Client utilities for category recommendations, exports, saved assets, and tRPC client wiring. |
| `server/routers.ts` | Main tRPC router and generator/payment procedures. |
| `server/products.ts` | Product catalog and pricing presets for Stripe checkout flows. |
| `server/*.test.ts` | Vitest coverage for auth, branding, custom categories, exports, instructions, and retail-readiness evidence. |
| `drizzle/schema.ts` | Database schema for users and app-specific persisted records. |
| `docs/` | Market assessment, retail QA report, marketing package, and this delivery guide. |

## Validation Commands

Run these commands before pushing to GitHub or publishing a checkpoint.

```bash
cd /home/ubuntu/claude-skill-studio
pnpm test
pnpm build
```

The latest validation completed successfully with **6 test files and 9 tests passing**. The production build also completed successfully. Vite reports non-blocking large-chunk warnings caused by rich markdown, diagram, and syntax-rendering dependencies. This is documented as an optimization opportunity, not a release blocker.

## Environment and Secrets

The project uses platform-injected environment variables for authentication, database access, storage, LLM utilities, and Stripe. Do not commit `.env` files or hardcode secrets in source.

| Integration | Notes |
|---|---|
| Manus OAuth | Authentication is already wired through the template. Use `useAuth()` on the client and protected tRPC procedures on the server. |
| Database | Schema is managed through Drizzle. Use `pnpm db:push` after schema changes. |
| Stripe | Checkout flows are wired through server-side procedures and product presets. The owner still needs to claim the Stripe sandbox before full test-payment activation. |
| Storage | Static assets should remain outside the project and be referenced through platform storage URLs when needed. The app currently uses inline brand visuals for core visible branding. |

## Database Notes

The current delivery did not require destructive database operations. If future schema changes are made, follow the schema-first workflow: update `drizzle/schema.ts`, run `pnpm db:push`, then verify with tests and a project health check. Avoid storing file bytes in database columns; keep file data in storage and persist only metadata or storage references.

## Stripe Notes

The app includes checkout-ready interactions for pricing and marketplace flows. Stripe sandbox credentials are configured by the platform, but the sandbox must be claimed by the owner before complete end-to-end test purchases are performed. Once claimed, test purchases should use Stripe’s standard test card `4242 4242 4242 4242`.

The application intentionally stores only essential payment identifiers and app-specific purchase/listing data. Stripe should remain the source of truth for payment objects, statuses, and billing details.

## Publishing in Manus

To publish from Manus, first create a checkpoint. After the checkpoint is created, use the project interface’s **Publish** button. Do not attempt to deploy manually from the terminal for the Manus-hosted version.

## GitHub Delivery Options

There are two practical GitHub delivery paths. The preferred path depends on whether the destination repository already exists.

| Option | When to Use | Steps |
|---|---|---|
| Push to an existing repository | The destination repository already exists and access is configured. | Add or update the remote, commit the final source, and push to the target branch. |
| Create a new repository | The user wants a fresh repository for Skills Magic AI. | Create the repository in GitHub, add it as the remote, commit the source, and push the main branch. |

If pushing directly from this environment, confirm the destination repository name and owner before writing to GitHub. A safe repository name is `skills-magic-ai`.

## Suggested Commit Message

```text
Finalize Skills Magic AI retail-ready multi-platform generator
```

This commit should include the multi-platform generator, custom category support, Instructions page, premium pricing offer, marketplace updates, QA coverage, market assessment, social media marketing package, and handoff documentation.

## Pre-Push Checklist

| Item | Status |
|---|---:|
| Instructions page registered in app routing and navigation | Complete |
| Custom/manual categories available across profession, industry, platform, and asset context | Complete |
| Premium Master Operating System pricing offer added | Complete |
| Marketplace and checkout flows aligned with product catalog | Complete |
| Branding cleaned across active UI and metadata | Complete |
| Market viability assessment created | Complete |
| Retail-readiness QA report created | Complete |
| Social media marketing package created | Complete |
| Tests passing | Complete |
| Production build passing | Complete |
| Manus checkpoint | Pending final checkpoint phase |
| GitHub push | Complete — pushed to `https://github.com/Treyskillz/skills-magic-ai` on `main` |

## Future Optimization Notes

The main non-blocking technical improvement is frontend code splitting. The build currently includes large chunks because markdown rendering, diagram support, and syntax highlighting dependencies are pulled into the frontend bundle. A future optimization pass should evaluate dynamic importing the output preview renderer, lazy-loading diagram/syntax support, or splitting heavy rendering modules behind the Generator page route.

The second future improvement is complete end-to-end Stripe verification after the sandbox is claimed. The app’s checkout initiation paths are wired, but live confirmation requires the owner to claim the sandbox and run test purchases.

## GitHub Delivery Evidence From This Session

GitHub delivery was completed from the project environment after the GitHub connector was enabled and command-line authentication was confirmed for the **Treyskillz** account. The destination repository did not exist at the start of delivery, so a new repository was created and the QA-approved source was pushed to the `main` branch.

| Delivery Item | Evidence |
|---|---|
| GitHub owner | `Treyskillz` |
| Repository URL | `https://github.com/Treyskillz/skills-magic-ai` |
| Repository visibility | Private at creation time; change visibility in GitHub settings if a public launch repository is desired. |
| Git remote URL | `https://github.com/Treyskillz/skills-magic-ai.git` |
| Default branch pushed | `main` |
| Initial release commit | `bdaf8a2f3dcd07bf536cdfb9af2c7e78737bd963` (`bdaf8a2`) |
| Commit message | `feat: initial Skills Magic AI retail-ready release` |
| Push result | `git push -u github main` completed successfully and set `main` to track `github/main`. |
| Validation before push | `pnpm test` and `pnpm build` completed successfully on May 11, 2026. |

The exact push sequence used for this completed delivery was:

```bash
cd /home/ubuntu/claude-skill-studio
gh repo create Treyskillz/skills-magic-ai --private --description "Skills Magic AI — Multi-Platform Master Operating Systems Generator"
git remote add github https://github.com/Treyskillz/skills-magic-ai.git
git add -A
git commit -m "feat: initial Skills Magic AI retail-ready release"
git push -u github main
```

A clean handoff ZIP is also available at `/home/ubuntu/skills-magic-ai-handoff-20260511.zip` for archive or manual transfer workflows. The repository should remain the source-of-truth for future code changes, while Manus checkpointing should still be used before publishing from the Manus interface.

## Confirmed Treyskillz Handoff Context

This delivery used the confirmed GitHub account context for **Treyskillz**. At the start of repository delivery, `Treyskillz/skills-magic-ai` was checked and did not exist. The repository was then created under the Treyskillz account with the recommended repository name `skills-magic-ai` and pushed from the local `main` branch.

| Handoff Field | Confirmed Value |
|---|---|
| Confirmed GitHub account | `Treyskillz` |
| Known repository state before delivery | `Treyskillz/skills-magic-ai` did not exist when checked. |
| Suggested repository name | `skills-magic-ai` |
| Repository created during delivery | Yes — `https://github.com/Treyskillz/skills-magic-ai` |
| Current source branch | `main` |
| Current GitHub remote | `github` → `https://github.com/Treyskillz/skills-magic-ai.git` |
| Export path going forward | Use GitHub as the code handoff source; use a Manus checkpoint plus the Manus **Publish** button for Manus-hosted publishing. |

The next operational path is to keep code changes flowing through the GitHub repository and to use Manus checkpointing for release snapshots. For production payments, the owner should claim the Stripe sandbox, test with Stripe test card `4242 4242 4242 4242`, then complete Stripe KYC and configure live payment settings when ready.
