import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { Plus, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
    
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center text-gray-800 dark:text-white font-[1000] justify-between py-4  transition-all dark:hover:text-gray-500 hover:text-gray-700 text-left [&[data-state=open]>svg]:rotate-180 dark:data-[state=open]:text-gray-600 data-[state=open]:text-gray-900',
        className
      )}
      {...props}
    >
     
      {children}
      {/* Show Plus or Minus based on the accordion state */}
      {/* <span className="ml-2">
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 data-[state=open]:hidden" />
        <Minus className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 hidden data-[state=open]:block" />
      </span> */}
      <ChevronDown className="h-4 w-4 md:h-6 md:w-6 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-gray-900 dark:text-gray-500 text-sm md:text-lg data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* serial number to only appear if itemized */}
     {props.key && <span className="dark:bg-[#181A20] bg-white rounded-sm px-[6px] py-[1px] mr-2 text-[17px] dark:text-[#FFFFFF] text-black font-[300] border-2 border-[#2B3139] ">
        {props.key}
      </span>}
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
