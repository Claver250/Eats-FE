import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MIN_PASSWORD, checkPassword, passwordScore } from "@/lib/admin-auth/validators";

const labels = ["", "Weak", "Fair", "Good", "Strong"];
const barColors = ["", "bg-danger", "bg-warning", "bg-brand-500", "bg-brand-600"];

type Props = {
  password: string;
  email: string;
  name: string;
};

export default function PasswordStrength({ password, email, name }: Props) {
  const who = { email, name };
  const check = checkPassword(password, who);
  const score = passwordScore(password, who);

  const rules = [
    { ok: check.length, text: `At least ${MIN_PASSWORD} characters` },
    { ok: check.mix, text: "A letter and a number" },
    { ok: check.notCommon, text: "Not a common password" },
    { ok: check.notPersonal, text: "Doesn’t contain your name or email" },
  ];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2" aria-hidden="true">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={cn("h-1.5 flex-1 rounded-full", n <= score ? barColors[score] : "bg-gray-200")}
            />
          ))}
        </div>
        <span className="w-12 text-right text-xs text-muted">{labels[score]}</span>
      </div>
      <p className="sr-only" role="status">
        {score > 0 ? `Password strength: ${labels[score]}` : ""}
      </p>
      <ul className="space-y-1 text-xs">
        {rules.map((r) => (
          <li key={r.text} className={cn("flex items-center gap-1.5", r.ok ? "text-success" : "text-muted")}>
            {r.ok ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Circle className="h-3 w-3" aria-hidden="true" />}
            <span>
              {r.text}
              <span className="sr-only">{r.ok ? " (met)" : " (not met)"}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}