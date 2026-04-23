import { NextResponse } from "next/server";
import { z } from "zod";
import { findClaimCode, getProfile } from "@/lib/data";
import { levelFromXp } from "@/lib/xp";

export const runtime = "nodejs";

const schema = z.object({
  code: z.string().min(4).max(64),
  lessonId: z.string().optional(),
  source: z.enum(["AUTO", "MANUAL"]).default("MANUAL"),
  payload: z.record(z.unknown()).optional(),
});

/**
 * POST /api/claim
 * Mock-friendly claim submission. In production this writes to Postgres
 * under a transaction (claim_codes → claims → xp_ledger → profiles).
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "BAD_INPUT", message: "Invalid payload." },
      { status: 400 },
    );
  }

  const { code } = parsed.data;
  const normalized = code.trim().toUpperCase();

  const profile = await getProfile();

  // In mock mode, look up by exact claim code. In production we'd transact.
  const existing = await findClaimCode(normalized);
  const baseXp = existing?.xp ?? inferXpFromCode(normalized);

  if (!baseXp) {
    return NextResponse.json(
      {
        ok: false,
        code: "CODE_UNKNOWN",
        message: "We couldn't find that code. Check the spelling.",
      },
      { status: 404 },
    );
  }

  const priorXp = profile.xp;
  const newXp = priorXp + baseXp;
  const before = levelFromXp(priorXp);
  const after = levelFromXp(newXp);
  const leveledUp = after.level > before.level;

  return NextResponse.json({
    ok: true,
    xp: baseXp,
    totalXp: newXp,
    leveledUp,
    newLevel: after.level,
    newLevelTitle: after.title,
    code: normalized,
  });
}

function inferXpFromCode(code: string) {
  if (code.startsWith("GAUNTLET-L")) {
    if (code.includes("-GOLD-")) return 200;
    if (code.includes("-SILVER-")) return 125;
    if (code.includes("-BRONZE-")) return 75;
  }
  if (code.startsWith("T101")) return 100;
  if (code.startsWith("T201")) return 150;
  if (code.startsWith("T301")) return 200;
  return 100;
}
