// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

/**
 * CONFIGURAÇÃO PLAYWRIGHT - Testes End-to-End
 *
 * Configuração para testes automatizados que simulam
 * o comportamento real do usuário na aplicação
 */

export default defineConfig({
  // Timeout para cada teste
  timeout: 30000,

  // Configurações globais
  use: {
    // Base URL da aplicação
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",

    // Screenshot apenas em falhas
    screenshot: "only-on-failure",

    // Video apenas em falhas
    video: "retain-on-failure",

    // Trace para debugging
    trace: "retain-on-failure",
  },

  // Projetos para diferentes browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  // Relatório de testes
  reporter: [
    ["html"], // Relatório HTML visual
    ["json"], // Relatório JSON para CI
    ["line"], // Feedback em tempo real no terminal
  ],

  // Diretórios
  testDir: "./e2e", // Onde ficam os testes
  outputDir: "./test-results", // Onde salvar resultados

  // Re-executar testes falhos
  retries: process.env.CI ? 2 : 0,
});
