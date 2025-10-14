// e2e/setup/auth.setup.ts
import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("autenticar usuário", async ({ page }) => {
  // Setup para reutilizar sessão autenticada
  await page.context().storageState({ path: authFile });
});
