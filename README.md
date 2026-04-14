# 🛒 Vmarket - Sistema de Gestão de Compras

Este projeto é um sistema interno para o time comercial gerenciar produtos, fornecedores e ordens de compra. Desenvolvido como um teste técnico focado em escalabilidade, integridade de dados e processamento assíncrono.

## 🛠️ Tecnologias Utilizadas

- **Backend:** Laravel 11 (PHP)
- **Frontend:** React + Inertia.js (SPA)
- **Styling:** Tailwind CSS
- **Banco de Dados:** MySQL
- **Fila/Cache:** Redis

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL
- **Redis** (Obrigatório para o processamento de vínculos em massa)
    - _Nota:_ No **Laragon**, certifique-se de que o Redis está ativo (`Menu -> Redis -> Start`).

## 🚀 Como instalar e rodar

1. **Clone o repositório:**
    ```bash
    git clone [https://github.com/Rafael-Garlant/VmarketTest.git](https://github.com/Rafael-Garlant/VmarketTest.git)
    cd VmarketTest
    ```
2. **Instale as dependências do backend:**
    ```bash
    composer install
    npm install
    ```
3. **Configure o ambiente:**
    - Copie o arquivo `.env.example` para `.env`:
    ```bash
    cp .env.example .env
    ```
4. Gere a chave da aplicação e rode as migrations:

    ```bash
    php artisan key:generate
    php artisan migrate --seed
    ```

5. Inicie os servidores:

Terminal 1 (Servidor PHP): `php artisan serve`

Terminal 2 (Compilação Frontend): `npm run dev`

Terminal 3 (CRUCIAL - Worker das Filas): `php artisan queue:work`
