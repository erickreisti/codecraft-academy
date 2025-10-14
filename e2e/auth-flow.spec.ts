// e2e/auth-flow.spec.ts
import { test, expect } from "@playwright/test";

/**
 * TESTE DE FLUXO DE AUTENTICAÇÃO
 *
 * Testa o caminho completo:
 * 1. Registro de novo usuário
 * 2. Login com credenciais
 * 3. Acesso à área logada
 * 4. Logout
 */

test.describe("Fluxo de Autenticação", () => {
  // Dados de teste - usuário único por execução
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  test("registro de novo usuário", async ({ page }) => {
    // 1. Navega para a página de registro
    await page.goto("/register");

    // 2. Verifica se a página carregou corretamente
    await expect(page).toHaveTitle(/Cadastro|Register/);
    await expect(
      page.getByRole("heading", { name: /criar conta/i })
    ).toBeVisible();

    // 3. Preenche o formulário de registro
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/senha/i).fill(testUser.password);
    await page.getByLabel(/confirmar senha/i).fill(testUser.password);

    // 4. Submete o formulário
    await page.getByRole("button", { name: /criar minha conta/i }).click();

    // 5. Verifica redirecionamento ou mensagem de sucesso
    await expect(page).toHaveURL(/\/login|\/dashboard/);

    // 6. Verifica feedback visual (toast de sucesso)
    const successMessage = page.getByText(/cadastro realizado|sucesso/i);
    await expect(successMessage).toBeVisible();
  });

  test("login com credenciais válidas", async ({ page }) => {
    // 1. Navega para login
    await page.goto("/login");

    // 2. Preenche credenciais
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/senha/i).fill(testUser.password);

    // 3. Submete o formulário
    await page.getByRole("button", { name: /entrar na plataforma/i }).click();

    // 4. Verifica se foi redirecionado para o dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // 5. Verifica elementos da área logada
    await expect(page.getByText(/olá|dashboard/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /meus cursos/i })
    ).toBeVisible();
  });

  test("logout do sistema", async ({ page }) => {
    // Pré-condição: usuário deve estar logado
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/senha/i).fill(testUser.password);
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // 1. Clica no avatar do usuário
    await page.getByRole("button", { name: /avatar/i }).click();

    // 2. Clica em "Sair" no dropdown
    await page.getByRole("button", { name: /sair/i }).click();

    // 3. Verifica se foi redirecionado para home ou login
    await expect(page).toHaveURL(/\//);

    // 4. Verifica se elementos da área logada sumiram
    await expect(page.getByText(/dashboard/i)).not.toBeVisible();
  });
});
