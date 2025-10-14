🎓 CodeCraft Academy

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=react)

Uma plataforma moderna de cursos online com sistema completo de e-commerce, blog dinâmico e dashboard administrativo.

## ✨ Demonstração

🌐 **Demo Online**: [Em breve]  
📱 **Responsivo**: ✅ Sim  
🎨 **Temas**: Claro & Escuro  
🚀 **Performance**: Lighthouse ≥ 90

## 🎯 Funcionalidades

### 🏫 Sistema de Cursos
- ✅ Catálogo de cursos com filtros
- ✅ Páginas detalhadas de cursos
- ✅ Níveis: Iniciante, Intermediário, Avançado
- ✅ Sistema de avaliações e reviews
- ✅ Certificados de conclusão

### 🛒 E-commerce Completo
- ✅ Carrinho de compras persistente
- ✅ Checkout com validação
- ✅ Cupons de desconto
- ✅ Processamento de pedidos
- ✅ Histórico de compras

### 👨‍🎓 Área do Aluno
- ✅ Dashboard personalizado
- ✅ Progresso nos cursos
- ✅ Certificados
- ✅ Perfil customizável
- ✅ Matrículas automáticas

### 📝 Blog Integrado
- ✅ Publicação de artigos
- ✅ Sistema de comentários
- ✅ SEO otimizado
- ✅ Categorias e tags
- ✅ Busca e filtros

### ⚡ Dashboard Admin
- ✅ CRUD completo de cursos
- ✅ Gerenciamento de posts
- ✅ Controle de usuários
- ✅ Relatórios e analytics
- ✅ Upload de imagens

## 🚀 Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Estilização** | Tailwind CSS, shadcn/ui, Radix UI |
| **Backend** | Supabase (PostgreSQL), Next.js Server Actions |
| **Autenticação** | Supabase Auth (Email/Google) |
| **Estado** | Zustand, React Hook Form |
| **Banco** | PostgreSQL (Supabase) |
| **Deploy** | Vercel, GitHub Actions |
| **Testes** | Playwright (E2E), Jest (Unit) |

## 📊 Performance

| Métrica | Score |
|---------|-------|
| **Lighthouse Performance** | 95+ |
| **Accessibility** | 100 |
| **Best Practices** | 100 |
| **SEO** | 100 |
| **Bundle Size** | ~450KB |

## 🔐 Segurança

- **Autenticação**: Supabase Auth com PKCE flow
- **Autorização**: RLS (Row Level Security) no PostgreSQL
- **Validação**: Zod schemas em todos os forms
- **CORS**: Configurado corretamente
- **Sanitização**: XSS protection automática

## 📈 Monitoramento

| Configuração | Recomendação |
|-------------|--------------|
| **Error Tracking** | Sentry |
| **Métricas** | Vercel Analytics |
| **Queries** | Supabase Logs |
| **Analytics** | Google Analytics (opcional) |

## 🆘 Troubleshooting

**Problemas Comuns:**

- **Erro de autenticação**: Verifique as variáveis de ambiente e confirme o Supabase URL e chaves
- **Imagens não carregam**: Configure as políticas RLS do storage e verifique as permissões do bucket
- **Build falha**: Limpe cache (`rm -rf .next node_modules`) e reinstale (`npm install`)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

Érick Reis - [GitHub](https://github.com/erickreisti)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [Supabase](https://supabase.com/) - Backend como serviço
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [shadcn/ui](https://ui.shadcn.com/) - Componentes lindos

⭐️ **Se este projeto te ajudou, deixe uma estrela no GitHub!**

[Report Bug](https://github.com/seu-usuario/codecraft-academy/issues) · [Request Feature](https://github.com/seu-usuario/codecraft-academy/issues)
