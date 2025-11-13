"use client";

import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  type = "text",
  ...props
}: TextFieldProps) {
  const { ["aria-label"]: ariaLabel, ...restProps } =
    props as TextFieldProps & {
      ["aria-label"]?: string;
    };

  const computedAriaLabel =
    hideLabel && typeof label === "string" && !ariaLabel ? label : ariaLabel;

  const isPasswordField = type === "password";
  const [isVisible, setIsVisible] = useState(false);

  const resolvedType = useMemo(
    () => (isPasswordField && isVisible ? "text" : type),
    [isPasswordField, isVisible, type]
  );

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {label && !hideLabel && (
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          aria-label={computedAriaLabel}
          className={cn(
            "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50",
            isPasswordField ? "pr-20" : "",
            className
          )}
          {...(restProps as InputHTMLAttributes<HTMLInputElement>)}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center justify-center rounded-full p-2 text-emerald-300 transition hover:text-emerald-200 cursor-pointer"
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            tabIndex={-1}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {description && <p className="text-xs text-slate-400">{description}</p>}
    </div>
  );
}
