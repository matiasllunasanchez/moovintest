import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { GetIcon } from "../common/icon";

const buttonVariants = cva(
  "flex inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-black",
  {
    variants: {
      variant: {
        default:
          "bg-black text-primary-foreground shadow hover:bg-black/90 !text-white",
        primary:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 !text-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 !text-white",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        white:
          "bg-white text-primary-foreground shadow hover:bg-white/90 text-black border border-solid border-[#E2E8F0]",
        black:
          "bg-black text-primary-foreground shadow hover:bg-black/90 !text-white",
        red: "bg-[#DC2626] text-primary-foreground shadow hover:bg-[#DC2626]/90 !text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        square: "px-4 py-2 gap-2 flex-col",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftSection?: JSX.Element;
  rightSection?: JSX.Element;
  iconName?: IconName;
  iconColor?: string;
  isIconBig?: boolean;
  iconClassName?: string;
  iconDivClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      loading = false,
      leftSection,
      rightSection,
      iconName,
      iconColor,
      isIconBig = false,
      iconClassName,
      iconDivClassName,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const iconBlack = iconColor
      ? iconColor
      : variant === "white"
      ? "black"
      : variant == "outline"
      ? "black"
      : "white";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || disabled}
        ref={ref}
        {...props}
      >
        {((leftSection && loading) ||
          (!leftSection && !rightSection && loading)) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && leftSection && <div className="mr-2">{leftSection}</div>}
        {iconName ? (
          <div className={cn("mr-2", iconDivClassName)}>
            <GetIcon
              iconName={iconName}
              mainColor={iconBlack}
              className={cn(isIconBig ? "w-30 h-30" : "h-5 w-5", iconClassName)}
            />
          </div>
        ) : null}
        <div>{children}</div>
        {!loading && rightSection && <div className="ml-2">{rightSection}</div>}
        {rightSection && loading && (
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
