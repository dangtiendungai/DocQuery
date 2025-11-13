import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  description?: string;
  wrapperClassName?: string;
  hideLabel?: boolean;
};

export default function TextField({
  id,
  label,
  description,
  className,
  wrapperClassName,
  hideLabel = false,
  ...props
}: TextFieldProps) {
  const { ["aria-label"]: ariaLabel, ...restProps } =
    props as TextFieldProps & {
      ["aria-label"]?: string;
    };

  const computedAriaLabel =
    hideLabel && typeof label === "string" && !ariaLabel ? label : ariaLabel;

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {label && !hideLabel && (
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-label={computedAriaLabel}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50",
          className
        )}
        {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
      />
      {description && <p className="text-xs text-slate-400">{description}</p>}
    </div>
  );
}
