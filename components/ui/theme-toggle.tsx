"use client"; // Usa hooks (useTheme) e estado

/**
 * MODE TOGGLE - Seletor de tema interativo
 *
 * Funcionalidades:
 * - Ícone dinâmico (Sol/Lua)
 * - Dropdown com 3 opções: Claro, Escuro, Sistema
 * - Acessível (screen reader friendly)
 * - Persistência automática no localStorage
 */

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/*
          asChild: Evita duplicação de botões
          Renderiza o DropdownMenuTrigger como filho do Button
        */}
        <Button variant="outline" size="icon">
          {/*
            Ícones condicionais com transição suave:
            - Sun aparece no tema claro
            - Moon aparece no tema escuro
            - Transição de rotação e opacidade
          */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
          {/* sr-only: Texto apenas para screen readers (acessibilidade) */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
