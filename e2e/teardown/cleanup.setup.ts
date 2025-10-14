// e2e/teardown/cleanup.setup.ts
import { test as teardown } from "@playwright/test";

teardown("limpar dados de teste", async () => {
  // Limpar usuários/cursos de teste criados durante a execução
});
