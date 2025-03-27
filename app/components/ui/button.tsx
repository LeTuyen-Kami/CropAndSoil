import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary-500 active:opacity-90",
        lightSolid: "bg-primary-50 active:opacity-90 active:bg-primary-100",
        outline: "border border-primary bg-background active:bg-primary-50",
        lightOutline:
          "border border-primary-50 bg-background active:bg-primary-50",
        ghost: "bg-background active:bg-primary-50",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 px-3",
        lg: "h-11 px-8 native:h-14",
        icon: "h-10 w-10",
      },
      disabled: {
        true: "bg-neutral-400",
        false: null,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "default",
        disabled: true,
        className: "bg-neutral-400",
      },
      {
        variant: "default",
        disabled: false,
        className: "bg-primary-500 active:opacity-90",
      },
      {
        variant: "lightSolid",
        disabled: true,
        className: "bg-primary-50",
      },
      {
        variant: "lightSolid",
        disabled: false,
        className: "bg-primary-200",
      },
      {
        variant: "outline",
        disabled: true,
        className: "border-neutral-400 bg-neutral-400",
      },
      {
        variant: "outline",
        disabled: false,
        className: "border-input bg-background active:bg-accent",
      },
      {
        variant: "ghost",
        disabled: true,
        className: "bg-accent",
      },
      {
        variant: "ghost",
        disabled: false,
        className: "bg-accent",
      },
    ],
  }
);

const buttonTextVariants = cva("text-sm font-medium text-foreground", {
  variants: {
    variant: {
      default: "text-white",
      lightSolid: "text-primary",
      outline: "text-primary",
      lightOutline: "text-primary",
      ghost: "text-primary",
    },
    size: {
      default: "text-sm",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-lg",
    },
    disabled: {
      true: "text-neutral-400",
      false: null,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
  compoundVariants: [
    {
      variant: "default",
      disabled: true,
      className: "text-neutral-400",
    },
    {
      variant: "default",
      disabled: false,
      className: "text-white",
    },
    {
      variant: "lightSolid",
      disabled: true,
      className: "text-primary-50",
    },
    {
      variant: "lightSolid",
      disabled: false,
      className: "text-primary",
    },
    {
      variant: "outline",
      disabled: true,
      className: "text-neutral-400",
    },
    {
      variant: "outline",
      disabled: false,
      className: "text-primary",
    },
    {
      variant: "ghost",
      disabled: true,
      className: "text-accent",
    },
    {
      variant: "ghost",
      disabled: false,
      className: "text-primary",
    },
  ],
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
            disabled: props.disabled,
          })
        )}
        ref={ref}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
