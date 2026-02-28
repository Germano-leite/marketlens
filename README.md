# 🛒 MarketLens - Inteligência Financeira com IA

> **MarketLens** é uma plataforma SaaS que transforma notas fiscais de supermercado em inteligência financeira. Utilizando Inteligência Artificial (Gemini), o sistema lê fotos de cupons fiscais, categoriza gastos e monitora a inflação pessoal de produtos ao longo do tempo.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Java](https://img.shields.io/badge/Backend-Java%2017%20%7C%20Spring%20Boot-red)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Docker](https://img.shields.io/badge/Docker-Conteinerizado-2496ED?logo=docker&logoColor=white)

## 🚀 Funcionalidades Principais

1. **Leitura Automática de Notas:** Upload de fotos de cupons fiscais (OCR + Interpretação via Gemini AI).
2. **Dashboard Financeiro:** Gráficos interativos de gastos por categoria (Pizza) e evolução mensal (Barras).
3. **Market Intelligence (Busca):** Pesquise por produtos ou categorias e veja um gráfico de linha com a variação de preço (Inflação Pessoal).
4. **Gestão Completa:** Edição em tempo real de itens (preço/nome) e exclusão de notas com recálculo automático.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Java 17, Spring Boot 3, Spring AI, H2 Database, Maven.
* **Frontend:** React.js (Vite), Tailwind CSS, Recharts, Nginx.
* **Inteligência Artificial:** Google Gemini.
* **Infraestrutura:** Docker, Docker Compose (Multi-stage builds).

---

## ⚙️ Como Rodar o Projeto (Via Docker - Recomendado)

O projeto está totalmente conteinerizado, garantindo que rode perfeitamente em qualquer ambiente sem necessidade de instalar Java ou 
Node.js na máquina hospedeira.

### Pré-requisitos
* **Docker** e **Docker Compose** instalados.
* Chave de API do Google Gemini.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Germano-leite/marketlens.git
   cd marketlens
   ```

2. **Configure a Chave da IA:**
   Na pasta raiz do projeto, crie um arquivo chamado `.env` e adicione sua chave do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui_sem_aspas
   ```

3. **Suba os Containers:**
   Ainda na raiz do projeto, execute o comando para construir e iniciar os servidores:
   ```bash
   docker compose up --build
   ```

4. **Acesse a Aplicação:**
   Abra o seu navegador e acesse: 👉 **http://localhost**

---

### 🐳 Comandos Úteis (Docker)

* **Para desligar a aplicação:** Pressione `Ctrl + C` no terminal em execução ou rode `docker compose down`.
* **Para rodar em segundo plano:** `docker compose up -d`
* **Para ver os logs do backend:** `docker compose logs -f backend`

---
*Desenvolvido como Projeto Acadêmico de Pós-Graduação da FIAP.*