import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      // Outer container - ALWAYS fixed full screen with flex centering
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      {...props}
    >
      {/* Inner dialog box - className is applied here for sizing */}
      <div 
        className={cn(
          // Default sizing
          "w-full max-w-lg",
          // Visual styling
          "bg-background border border-border/50 shadow-2xl",
          "rounded-2xl",
          // Animation
          "animate-in fade-in-0 zoom-in-95 duration-200",
          // Overflow handling
          "max-h-[85vh] overflow-hidden flex flex-col",
          "relative",
          // Custom className is passed here for sizing overrides (max-w-2xl, max-w-md, etc.)
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-primary rounded-t-2xl" />
        
        {/* Close button */}
        <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group">
          <X className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        
        {/* Content wrapper with padding */}
        <div className="p-6 pt-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-6", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-6 pt-4 border-t border-border/50", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description 
    ref={ref} 
    className={cn("text-sm text-muted-foreground mt-1", className)} 
    {...props} 
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
