import Image from "next/image";
import { cn } from "@/design-system";
import logo from "@/features/layout/assets/pm-show-logo.png";

// The band's round medallion (transparent outside the circle), so the same
// mark works on the dark chrome and on light pages. The size comes from
// className; 128px covers the largest one (the opening splash) on 1x screens.
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="PM SHOW"
      width={128}
      height={128}
      // Always above the fold (splash, menu, sign-in): no lazy loading.
      loading="eager"
      className={cn("shrink-0 rounded-full", className)}
    />
  );
}
