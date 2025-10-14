// e2e/ecommerce-flow.spec.ts
import { test, expect } from "@playwright/test";

/**
 * TESTE DE FLUXO DE E-COMMERCE
 *
 * Testa o processo completo de compra:
 * 1. Navegação no catálogo
 * 2. Adição ao carrinho
 * 3. Checkout
 * 4. Confirmação de matrícula
 */

test.describe("Fluxo de E-commerce", () => {
  // Usuário de teste para compras
  const testUser = {
    email: "student@example.com",
    password: "StudentPass123!",
  };

  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste de e-commerce
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/senha/i).fill(testUser.password);
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("adicionar curso ao carrinho e finalizar compra", async ({ page }) => {
    // 1. Navega para a página de cursos
    await page.goto("/courses");

    // 2. Verifica se a página carregou
    await expect(
      page.getByRole("heading", { name: /nossos cursos/i })
    ).toBeVisible();

    // 3. Clica no primeiro curso disponível
    const firstCourse = page.locator('[data-testid="course-card"]').first();
    await firstCourse.click();

    // 4. Verifica se foi para a página do curso
    await expect(page).toHaveURL(/\/courses\/.+/);

    // 5. Adiciona o curso ao carrinho
    await page.getByRole("button", { name: /adicionar ao carrinho/i }).click();

    // 6. Verifica notificação de sucesso
    await expect(page.getByText(/adicionado ao carrinho/i)).toBeVisible();

    // 7. Abre o carrinho
    await page.getByRole("button", { name: /carrinho/i }).click();

    // 8. Verifica se o curso está no carrinho
    await expect(page.getByText(/seu carrinho/i)).toBeVisible();
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();

    // 9. Procede para checkout
    await page.getByRole("button", { name: /finalizar compra/i }).click();

    // 10. Verifica página de checkout
    await expect(page).toHaveURL(/\/checkout/);
    await expect(
      page.getByRole("heading", { name: /finalizar compra/i })
    ).toBeVisible();

    // 11. Simula pagamento (ambiente de teste)
    await page.getByRole("button", { name: /finalizar compra/i }).click();

    // 12. Verifica página de sucesso
    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.getByText(/parabéns|sucesso/i)).toBeVisible();

    // 13. Verifica se o curso aparece na área do aluno
    await page.goto("/dashboard/courses");
    await expect(page.locator('[data-testid="enrolled-course"]')).toBeVisible();
  });

  test("aplicar cupom de desconto", async ({ page }) => {
    // Pré-condição: ter itens no carrinho
    await page.goto("/courses");
    const courseCard = page.locator('[data-testid="course-card"]').first();
    await courseCard.click();
    await page.getByRole("button", { name: /adicionar ao carrinho/i }).click();

    // 1. Abre o carrinho
    await page.getByRole("button", { name: /carrinho/i }).click();

    // 2. Aplica cupom de desconto
    await page.getByPlaceholder(/digite seu cupom/i).fill("WELCOME10");
    await page.getByRole("button", { name: /aplicar/i }).click();

    // 3. Verifica se desconto foi aplicado
    await expect(page.getByText(/cupom aplicado|desconto/i)).toBeVisible();
    await expect(page.getByText(/10% off/i)).toBeVisible();
  });
});
