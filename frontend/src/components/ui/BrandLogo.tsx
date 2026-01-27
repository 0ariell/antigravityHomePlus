import { cn } from '../../lib/utils';

interface BrandLogoProps {
  className?: string;
  variant?: 'sidebar' | 'auth' | 'mobile';
}

export function BrandLogo({ className, variant = 'auth' }: BrandLogoProps) {
  // Base classes for image containment
  const baseClasses = "w-auto object-contain transition-all duration-300";
  
  // Variant specific sizing
  const sizeClasses = {
    sidebar: "h-20 md:h-24 max-w-[200px]", // Large but contained in sidebar
    auth: "h-24 md:h-32 lg:h-40", // Very large on auth screens
    mobile: "h-12", // Compact for mobile headers
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img 
        src="/logo.png" 
        alt="HomePlus" 
        className={cn(baseClasses, sizeClasses[variant])}
      />
    </div>
  );
}
