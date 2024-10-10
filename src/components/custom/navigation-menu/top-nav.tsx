import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../button";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    isActive: boolean;
  }[];
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="border border-white"
            >
              <Menu color="white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href, isActive }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  href={href}
                  className={!isActive ? "text-muted-foreground" : "!font-bold"}
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          "hidden items-center space-x-4 md:flex lg:space-x-6 ",
          className
        )}
        {...props}
      >
        <div className="mr-5">
          <Image src="/moovin_logo_w.png" alt="Logo" width={100} height={50} />
        </div>
        {links.map(({ title, href, isActive }) => (
          <Link
            key={`${title}-${href}`}
            href={href}
            className={`text-sm font-medium transition-colors hover:opacity-50 text-white ${
              isActive ? "!font-bold" : "text-muted-foreground"
            }`}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  );
}
