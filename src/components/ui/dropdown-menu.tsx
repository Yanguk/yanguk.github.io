"use client";

import { Menu } from "@base-ui/react/menu";
import type * as React from "react";

import { cn } from "@/lib/utils";

function DropdownMenu(props: Menu.Root.Props) {
  return <Menu.Root modal={false} {...props} />;
}

function DropdownMenuTrigger({
  children,
  ...props
}: Menu.Trigger.Props & {
  children: React.ReactElement;
}) {
  return <Menu.Trigger render={children} {...props} />;
}

function DropdownMenuContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: Menu.Popup.Props & {
  align?: Menu.Positioner.Props["align"];
  sideOffset?: Menu.Positioner.Props["sideOffset"];
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner align={align} sideOffset={sideOffset}>
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-32 border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
            "data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95 data-[ending-style]:animate-out data-[open]:animate-in",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: Menu.Item.Props & {
  className?: string;
}) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm outline-none transition data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
