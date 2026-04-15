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
    git clone https://github.com/Rafael-Garlant/VmarketTest.git
    cd VmarketTest
```

2. **Instale as dependências:**
```bash
    composer install
    npm install
```

3. **Configure o ambiente:**

    Copie o arquivo `.env.example` para `.env`:
```bash
    cp .env.example .env
```

    Abra o `.env` e configure as seguintes variáveis:
```env
    DB_DATABASE=vmarket
    DB_USERNAME=seu_usuario # ou root
    DB_PASSWORD=sua_senha   # ou sem senha

    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379

    QUEUE_CONNECTION=redis
    CACHE_STORE=redis
```

4. **Gere a chave da aplicação e rode as migrations:**
```bash
    php artisan key:generate
    php artisan migrate --seed
```

5. **Inicie os servidores:**

    > ⚠️ Os três terminais abaixo devem rodar simultaneamente.


Onde acessar o **TERMINAL** e **INCIAR TUDO** pelo Laragon:
<img width="1027" height="653" alt="image" src="https://github.com/user-attachments/assets/8209bc07-b49a-4cb4-bd18-94cb2a56696e" />


Terminal 1 — Servidor PHP:
```bash
    php artisan serve
```

Terminal 2 — Compilação do Frontend:
```bash
    npm run dev
```

Terminal 3 — Worker das Filas (obrigatório para vínculos em massa):
```bash
    php artisan queue:work
```

6. **Acesse o sistema:**

    Abra o navegador em [http://localhost:8000](http://localhost:8000)
