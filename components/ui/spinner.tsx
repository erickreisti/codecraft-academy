// components/ui/spinner.tsx
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface SpinnerWithTextProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center
        border-2 border-primary border-t-transparent 
        rounded-full animate-spin
        ${sizeClasses[size]}
        ${className}
      `}
    />
  );
}

export function SpinnerWithText({
  text = "Carregando...",
  size = "md",
  className = "",
}: SpinnerWithTextProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Spinner size={size} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
