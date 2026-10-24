import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
          W
        </span>
        <span className="text-xl font-bold text-brand-600">WeEats</span>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
          Admin
        </span>
      </div>

      <div className="rounded-card bg-surface p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-bold text-brand-700">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && <p className="mt-5 text-center text-sm text-muted">{footer}</p>}
    </div>
  );
}