import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type DropdownItem =
  | { type: "label"; label: string }
  | { type: "separator" }
  | { type: "group"; items: MenuItem[] }
  | { type: "sub"; label: string; icon?: LucideIcon; items: MenuItem[] }
  | {
      type: "item";
      label: string;
      icon?: LucideIcon | undefined;
      shortcut?: string | undefined;
      onClick?: () => void;
    };

type MenuItem = {
  label: string;
  icon?: LucideIcon;
  shortcut?: string;
  onClick?: () => void;
};

interface DropdownProps {
  triggerLabel: string;
  triggerSubLabel?: string;
  triggerIcon?: LucideIcon;
  items: DropdownItem[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  triggerLabel,
  triggerSubLabel,
  triggerIcon: TriggerIcon,
  items,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex flex-col items-start justify-center p-8 focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none  rounded-lg">
          <div className="flex items-center gap-2">
            {TriggerIcon && <TriggerIcon className="h-8 w-8" />}
            <span className="flex items-start flex-col">
              <span className="text-lg font-bold">{triggerLabel}</span>
              {triggerSubLabel && (
                <span className="text-white">{triggerSubLabel}</span>
              )}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {items.map((item, index) => {
          switch (item.type) {
            case "label":
              return (
                <DropdownMenuLabel key={index}>{item.label}</DropdownMenuLabel>
              );
            case "separator":
              return <DropdownMenuSeparator key={index} />;
            case "group":
              return (
                <DropdownMenuGroup key={index}>
                  {item.items.map((groupItem, groupIndex) => (
                    <DropdownMenuItem key={groupIndex} onClick={groupItem.onClick}>
                      {groupItem.icon && (
                        <groupItem.icon className="mr-2 h-4 w-4" />
                      )}
                      <span>{groupItem.label}</span>
                      {groupItem.shortcut && (
                        <DropdownMenuShortcut>
                          {groupItem.shortcut}
                        </DropdownMenuShortcut>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              );
            case "sub":
              return (
                <DropdownMenuSub key={index}>
                  <DropdownMenuSubTrigger>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span>{item.label}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {item.items.map((subItem, subIndex) => (
                        <DropdownMenuItem key={subIndex} onClick={subItem.onClick}>
                          {subItem.icon && (
                            <subItem.icon className="mr-2 h-4 w-4" />
                          )}
                          <span>{subItem.label}</span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            case "item":
            default:
              return (
                <DropdownMenuItem inset={true} key={index} onClick={item.onClick}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
