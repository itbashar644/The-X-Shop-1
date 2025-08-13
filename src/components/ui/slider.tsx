import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/Image-utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValues?: boolean;
  formatValue?: (value: number) => string;
  minStepsBetweenThumbs?: number;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ 
  className, 
  showValues = true, 
  formatValue, 
  minStepsBetweenThumbs = 0,
  ...props 
}, ref) => {
  const values = (props.value as number[] | undefined) ?? 
                (props.defaultValue as number[] | undefined) ?? 
                [0];

  const defaultFormat = (value: number) => `${value}`;
  const format = formatValue || defaultFormat;

  return (
    <div className="w-full space-y-2">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        
        {values.map((value, i) => (
          <React.Fragment key={i}>
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              {showValues && (
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs bg-popover text-popover-foreground px-2 py-1 rounded-md shadow-sm whitespace-nowrap">
                  {format(value)}
                </div>
              )}
            </SliderPrimitive.Thumb>
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
      
      {props.min !== undefined && props.max !== undefined && (
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>{format(props.min)}</span>
          <span>{format(props.max)}</span>
        </div>
      )}
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };