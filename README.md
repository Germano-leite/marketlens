# 🛒 MarketLens - Inteligência Financeira com IA

> **MarketLens** é uma plataforma inovadora que transforma notas fiscais de supermercado em inteligência financeira. Utilizando Inteligência Artificial (Google Gemini), o sistema processa imagens de cupons fiscais, categoriza gastos automaticamente, monitora a inflação pessoal de produtos ao longo do tempo e gera um planejamento de compras inteligente.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Java](https://img.shields.io/badge/Backend-Java%2017%20%7C%20Spring%20Boot-red)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Docker](https://img.shields.io/badge/Docker-Conteinerizado-2496ED?logo=docker&logoColor=white)

## 🚀 Funcionalidades Principais

1. **Leitura Automática de Notas Fiscais:** Upload de fotos de cupons fiscais com extração de dados e normalização de nomes de produtos via Gemini AI.
2. **Planejador Inteligente (Smart Planner):** Geração automática de listas de compras (Mensal de Base vs. Semanal de Frescos) baseada no perfil familiar, cruzando dados de histórico de consumo e aplicando limites de orçamento.
3. **Dashboard Financeiro:** Visão macro do orçamento com gráficos interativos de gastos por categoria (Drill-down) e evolução temporal.
4. **Market Intelligence:** Motor de busca inteligente por produtos ou categorias, apresentando gráficos de linha com a variação histórica de preço (Inflação Pessoal).
5. **Gestão Flexível:** Edição em tempo real de itens extraídos, adição manual no planejador com precificação de fallback e recálculo dinâmico de subtotais.

## 🛠️ Tecnologias Utilizadas

* **Backend:** Java 17, Spring Boot 3, Spring Data JPA, H2 Database (In-Memory), RestClient.
* **Frontend:** React.js (Vite), Tailwind CSS, Recharts, Lucide Icons.
* **Inteligência Artificial:** Google Gemini 2.5 Flash API.
* **Infraestrutura:** Docker, Docker Compose.

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
   Você pode configurá-la via variável de ambiente (.env - recomendado) ou no `application.properties`.

3. **Suba os Containers:**
   Ainda na raiz do projeto, execute o comando para construir e iniciar os servidores:
   ```bash
   docker compose up --build
   ```

4. **Acesse a Aplicação:**
   Abra o seu navegador e acesse: 👉 **http://localhost** *(Ou a porta configurada no seu ambiente, ex: http://localhost:5173 para execução local do Vite)*

---

### 🐳 Comandos Úteis (Docker)

* **Para desligar a aplicação:** Pressione `Ctrl + C` no terminal em execução ou rode `docker compose down`.
* **Para rodar em segundo plano:** `docker compose up -d`
* **Para ver os logs do backend:** `docker compose logs -f backend`

---

Vídeo do Pitch (Apresentação): [https://youtu.be/g1unHZUFo2A](https://youtu.be/g1unHZUFo2A)

Vídeo do MVP (Demonstração): [https://youtu.be/hph1JT92km0](https://youtu.be/hph1JT92km0)

---
*Desenvolvido como Projeto Acadêmico de Pós-Graduação da FIAP.*