import { CheckCircle2, ShieldAlert } from "lucide-react";
import { PassCard } from "@/components/passes/PassCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCredentialByPassId } from "@/lib/data";

type Params = Promise<{ passId: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { passId } = await params;
  return { title: `Verify · ${passId}` };
}

export default async function VerifyPage({ params }: { params: Params }) {
  const { passId } = await params;
  const credential = await getCredentialByPassId(passId);

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      {credential && credential.status === "ACTIVE" ? (
        <Card>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="font-display text-sm font-semibold text-emerald-300">
              Credential verified
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">Valid</h1>
          <p className="mt-1 text-sm text-white/60">
            This credential was issued by Bow Sports Capital and is currently active.
          </p>
          <div className="mt-6">
            <PassCard
              passId={credential.passId}
              displayName="Holder"
              level={credential.levelName}
              track={credential.track}
              issuedAt={credential.issuedAt}
            />
          </div>
          <dl className="mt-6 space-y-2 text-sm">
            <Row label="Credential ID" value={<span className="font-mono">{credential.passId}</span>} />
            <Row label="Track" value={`Track ${credential.track}`} />
            <Row label="Level" value={credential.levelName} />
            <Row label="Issued" value={new Date(credential.issuedAt).toLocaleDateString()} />
            <Row label="Status" value={<Badge variant="success">ACTIVE</Badge>} />
          </dl>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-300" />
            <span className="font-display text-sm font-semibold text-amber-300">
              Credential not found
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">Invalid or revoked</h1>
          <p className="mt-2 text-sm text-white/60">
            No active credential matches{" "}
            <span className="font-mono text-white">{passId}</span>. Double-check the ID and try
            again.
          </p>
        </Card>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-2">
      <dt className="text-white/50">{label}</dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}
