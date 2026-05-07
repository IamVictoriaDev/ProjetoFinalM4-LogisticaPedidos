# LOGIX — Inteligência que move pedidos

Sistema web fullstack de gestão de pedidos para distribuidoras e atacados.

---

## 💡 O Problema

Pequenos negócios de distribuição gerenciam pedidos de forma manual — pelo WhatsApp, caderno ou memória. Isso gera perda de informação, falta de visibilidade do fluxo operacional e dificuldade em acompanhar o status de cada entrega.

## ✅ A Solução

O LOGIX é um sistema que permite criar, acompanhar e analisar pedidos do início à entrega, com visualização Kanban, dashboard em tempo real e relatórios analíticos.

---

## 🚀 Deploy

| Serviço | URL |
|---|---|
| Frontend (Vercel) | https://projeto-final-m4-logistica-pedidos.vercel.app |
| Backend (Railway) | https://projetofinalm4-logisticapedidos-production.up.railway.app |

---

## 🛠️ Tecnologias

### Frontend
- React + TypeScript
- TailwindCSS
- TanStack Query
- Zustand
- dnd-kit
- recharts
- Vite

### Backend
- Node.js + Fastify
- Prisma ORM
- PostgreSQL
- TypeScript

---

## 📁 Estrutura do Projeto

```
ProjetoFinalM4-LogisticaPedidos/
├── frontend/
│   └── src/
│       ├── components/    # Layout, Kanban, ErrorBoundary
│       ├── pages/         # Dashboard, Pedidos, Kanban, Relatórios
│       ├── services/      # api.ts, orders.ts
│       ├── types/         # order.ts
│       └── store/         # useToast.ts
└── backend/
    └── src/
        ├── controllers/   # OrderController.ts
        ├── services/      # OrderService.ts
        ├── routers/       # route.ts
        └── lib/           # prisma.ts
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Crie um arquivo `.env` em `backend/`:
```
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Crie um arquivo `.env` em `frontend/`:
```
VITE_API_URL=http://localhost:3333
```

Acesse: `http://localhost:5173`

---

## 📋 Funcionalidades

- **Dashboard** — KPIs em tempo real, gráfico de pedidos, ações pendentes
- **Pedidos** — CRUD completo com busca por cliente, produto ou ID
- **Kanban** — drag and drop com atualização automática de status e busca
- **Relatórios** — gráfico donut, ranking de produtos e clientes, alertas, upload de JSON/CSV e exportar CSV

---

## 👥 Time

Victoria · Marcelo · Cauã · Evely · Geiza · Maxine