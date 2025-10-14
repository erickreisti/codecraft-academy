// e2e/admin-flow.spec.ts
import { test, expect } from "@playwright/test";

/**
 * TESTE DE FLUXO ADMINISTRATIVO
 *
 * Testa funcionalidades do painel de admin:
 * 1. Acesso ao painel
 * 2. CRUD de cursos
 * 3. CRUD de posts
 * 4. Gerenciamento de usuários
 */

test.describe("Fluxo Administrativo", () => {
  // Credenciais de administrador
  const adminUser = {
    email: "admin@codecraft.com",
    password: "AdminPass123!",
  };

  test.beforeEach(async ({ page }) => {
    // Login como admin
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(adminUser.email);
    await page.getByLabel(/senha/i).fill(adminUser.password);
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("criar novo curso como administrador", async ({ page }) => {
    // 1. Acessa o painel administrativo
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: /painel admin/i })
    ).toBeVisible();

    // 2. Navega para gerenciamento de cursos
    await page.getByRole("link", { name: /cursos/i }).click();
    await expect(page).toHaveURL(/\/admin\/courses/);

    // 3. Clica para criar novo curso
    await page.getByRole("link", { name: /novo curso/i }).click();
    await expect(page).toHaveURL(/\/admin\/courses\/new/);

    // 4. Preenche dados do curso
    const courseData = {
      title: `Curso Teste ${Date.now()}`,
      slug: `curso-teste-${Date.now()}`,
      description: "Descrição do curso de teste",
      price: "199.99",
      duration: "40",
    };

    await page.getByLabel(/título do curso/i).fill(courseData.title);
    await page.getByLabel(/slug/i).fill(courseData.slug);
    await page.getByLabel(/descrição completa/i).fill(courseData.description);
    await page.getByLabel(/preço/i).fill(courseData.price);
    await page.getByLabel(/duração/i).fill(courseData.duration);

    // 5. Publica o curso
    await page.getByLabel(/status/i).selectOption("true");

    // 6. Salva o curso
    await page.getByRole("button", { name: /criar curso/i }).click();

    // 7. Verifica redirecionamento e mensagem de sucesso
    await expect(page).toHaveURL(/\/admin\/courses/);
    await expect(page.getByText(/curso criado|sucesso/i)).toBeVisible();

    // 8. Verifica se o curso aparece na listagem
    await expect(page.getByText(courseData.title)).toBeVisible();
  });

  test("criar e publicar post no blog", async ({ page }) => {
    // 1. Acessa gerenciamento de posts
    await page.goto("/admin/posts");
    await page.getByRole("link", { name: /novo post/i }).click();

    // 2. Preenche dados do post
    const postData = {
      title: `Post Teste ${Date.now()}`,
      slug: `post-teste-${Date.now()}`,
      excerpt: "Resumo do post de teste",
      content: "Conteúdo completo do post de teste",
    };

    await page.getByLabel(/título do post/i).fill(postData.title);
    await page.getByLabel(/slug/i).fill(postData.slug);
    await page.getByLabel(/descrição curta/i).fill(postData.excerpt);
    await page.getByLabel(/conteúdo completo/i).fill(postData.content);

    // 3. Publica o post
    await page.getByLabel(/status/i).selectOption("true");

    // 4. Salva o post
    await page.getByRole("button", { name: /criar post/i }).click();

    // 5. Verifica sucesso
    await expect(page.getByText(/post criado|sucesso/i)).toBeVisible();

    // 6. Verifica se o post está público no blog
    await page.goto("/blog");
    await expect(page.getByText(postData.title)).toBeVisible();
  });
});
