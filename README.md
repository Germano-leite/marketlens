# 🛒 MarketLens - Inteligência Financeira com IA

> **MarketLens** é uma plataforma SaaS que transforma notas fiscais de supermercado em inteligência financeira. Utilizando Inteligência Artificial (Gemini), o sistema lê fotos de cupons fiscais, categoriza gastos e monitora a inflação pessoal de produtos ao longo do tempo.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Java](https://img.shields.io/badge/Backend-Java%2017%20%7C%20Spring%20Boot-red)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## 🚀 Funcionalidades Principais

1.  **Leitura Automática de Notas:** Upload de fotos de cupons fiscais (OCR + Interpretação via Gemini AI).
2.  **Dashboard Financeiro:** Gráficos interativos de gastos por categoria (Pizza) e evolução mensal (Barras).
3.  **Drill-Down de Categorias:** Clique em "Limpeza" para ver detalhes como "Sabão em Pó" vs "Detergente".
4.  **Market Intelligence (Busca):** Pesquise por "Leite" e veja um gráfico de linha com a variação de preço (Inflação Pessoal).
5.  **Gestão Completa:** Edição de itens (preço/nome) e exclusão de notas com recálculo automático.

## 🛠️ Tecnologias Utilizadas

### Backend (API)
* **Java 17** com **Spring Boot 3**
* **Spring AI** (Integração com LLMs)
* **Google Gemini Pro Vision** (Modelo Multimodal)
* **H2 Database** (Banco de dados SQL em arquivo/memória)
* **Maven** (Gerenciador de dependências)

### Frontend (Interface)
* **React.js** (Vite)
* **Tailwind CSS** (Estilização moderna)
* **Recharts** (Biblioteca de gráficos)
* **Lucide React** (Ícones)
* **Axios** (Comunicação HTTP)

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
* Java 17+ instalado
* Node.js 18+ instalado
* Chave de API do Google Gemini (`GEMINI_API_KEY`)

### 1. Configurar o Backend
1.  Clone o repositório.
2.  Abra a pasta `backend` no seu IDE.
3.  Configure a variável de ambiente no `application.properties`:
    ```properties
    spring.ai.openai.api-key=SUA_CHAVE_AQUI
    ```
4.  Execute a classe `MarketLensApplication.java`.
5.  O servidor iniciará em: `http://localhost:8080`.

### 2. Configurar o Frontend
1.  Abra o terminal na pasta `frontend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Rode o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse o App em: `http://localhost:5173`.

---
Desenvolvido como Projeto Acadêmico de Pós-Graduação da FIAP