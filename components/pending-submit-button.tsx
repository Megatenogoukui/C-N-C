"use client";

import { useFormStatus } from "react-dom";

type PendingSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
};

export function PendingSubmitButton({
  children,
  pendingLabel = "Working...",
  className
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingLabel : children}
    </button>
  );
}
