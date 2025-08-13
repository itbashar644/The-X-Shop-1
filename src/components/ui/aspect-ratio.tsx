import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/Image-utils";

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(
      "relative w-full h-0 overflow-hidden",
      className
    )}
    style={{
      paddingBottom: `calc(100% / (${props.ratio}))`,
    }}
    {...props}
  />
));

AspectRatio.displayName = AspectRatioPrimitive.Root.displayName;

export { AspectRatio };