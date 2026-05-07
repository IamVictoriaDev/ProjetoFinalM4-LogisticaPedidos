# PRD - Logix: Gestão de Logística de Pedidos 

## 1. Visão do Produto
O **Logix** é uma plataforma Fullstack robusta para gestão logística, permitindo o acompanhamento do ciclo de vida de pedidos em tempo real. O sistema oferece desde um **Dashboard** operacional até um quadro **Kanban** para controle de fluxo e relatórios detalhados.

## 2. Usuário-alvo
*   **Gestores Logísticos**: Profissionais que precisam de uma visão macro das métricas e do volume de pedidos.
*   **Equipes de Operação**: Usuários que necessitam de uma ferramenta direta para cadastrar e alterar o status das entregas sem fricção.

## 3. Problema
No setor de logística, a falta de sincronia entre o pedido feito e o status da entrega gera atrasos. Os principais desafios são:
*   Dificuldade em acompanhar o ciclo de vida do pedido (Recebido, Em transporte, Entregue).
*   Conflitos de dados entre o front-end e o banco de dados.
*   Necessidade de uma interface rápida que funcione em diferentes dispositivos.

## 4. Solução Proposta
Uma aplicação web que centraliza o histórico de logística, utilizando **React** e **Node.js** para garantir que as atualizações de status refletem imediatamente na interface para todos os usuários.

## 5. Próximos Passos (Futuras Implementações)
*   Sistema de login e autenticação de usuários para maior segurança.
*   Integração com APIs de mapas para rastreio via GPS em tempo real.
*   Sistema de notificações push ou alertas via e-mail para mudança de status.

## 6. Funcionalidades Essenciais
*   **Dashboard**: Visão geral de pedidos e métricas operacionais.
*   **Gestão de Pedidos (CRUD)**: Cadastro, listagem, edição e exclusão de pedidos.
*   **Quadro Kanban**: Movimentação visual de pedidos entre colunas de status.
*   **Relatórios**: Análise percentual de pedidos e ranking de produtos.

## 7. Diferencial
O diferencial do **Logix** é a **integridade de dados em tempo real**. Ao utilizar **Zod** para validação rigorosa, o sistema impede a entrada de informações inconsistentes, garantindo que os relatórios sejam 100% confiáveis para a tomada de decisão.

## 8. Divisão de Responsabilidades (Squad)
O projeto foi desenvolvido de forma colaborativa, dividido em frentes de trabalho:
*   **Pedidos (CRUD)** (Evely + Cauã): Criação do formulário, listagem em tabela, edição, deleção e conexão com a API.
*   **Kanban** (Geiza + Maxine): Criação da tela baseada no Figma, implementação de colunas e cards com funcionalidade de atualização de status.
*   **Dashboard + Relatórios** (Victoria + Marcelo): Desenvolvimento de métricas, gráficos, consumo de dados e implementação de upload de arquivos.

## 9. Guia Técnico (Como rodar)

### Backend (`/backend`)
1. Instale as dependências: `npm install`
2. Configure o `.env` com a `DATABASE_URL` do seu PostgreSQL.
3. Sincronize o banco: `npx prisma db push`.
4. Inicie: `npm run dev`.

### Frontend (`/frontend`)
1. Instale as dependências: `npm install`.
2. Inicie a aplicação: `npm run dev`.

---

**Squad Logix**: Evely Sena, Cauã, Geiza, Maxine, Victoria e Marcelo.
**Deploy oficial**: [projeto-final-m4-logistica-pedidos.vercel.app](https://projeto-final-m4-logistica-pedidos.vercel.app/)

