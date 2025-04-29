import {Moon, Sun} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useTheme} from "@/components/theme-provider.tsx";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(className)} asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Переключить тему</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Светлая
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Темная
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    Как в системе
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
