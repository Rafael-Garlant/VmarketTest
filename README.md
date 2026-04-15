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
    npm install
    # Se caso o npm install não funcionar, use o comando a abaixo
    npm install --force
    composer install # se der erro rodando pelo terminal do VSCode, rode esse comando no terminal do Laragon.
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
    composer install # rode se caso não tiver funcionado pelo terminal do VSCode.
    php artisan key:generate
    php artisan migrate --seed
composer require predis/predis
```

5. **Inicie os servidores:**

    > ⚠️ Os três terminais abaixo devem rodar simultaneamente.


Onde acessar o **TERMINAL** e **INCIAR TUDO** pelo Laragon:
<img width="1027" height="653" alt="image" src="https://github.com/user-attachments/assets/8209bc07-b49a-4cb4-bd18-94cb2a56696e" />

Abrindo outro terminal pelo Laragon:
Clique no ícone com sinal de **+** para abir outro terminal.
<img width="751" height="383" alt="image" src="https://github.com/user-attachments/assets/2de05b40-c27a-43e3-84d9-9f26d758bf0e" />

Rode o comando `cd Vmarket` se caso a pasta raiz não for Vmarket.
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

> Antes de acessar, por padrão já é feito um login para uso que é o 
> E-mail: test@example.com
> Senha: password
> Abra o navegador em [http://localhost:8000](http://localhost:8000)
> Mas se quiser criar um usuário próprio, acesse [http://localhost:8000](http://localhost:8000/register)
