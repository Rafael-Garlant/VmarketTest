# 🧠 Decisões Técnicas - Projeto Vmarket

Este documento detalha as escolhas de arquitetura, modelagem e tecnologias adotadas durante o desenvolvimento do sistema de gestão de compras do Vmarket, visando atender aos requisitos de escalabilidade, performance e boa experiência do usuário (UX).

## 🗄️ 1. Modelagem do Banco de Dados
A modelagem foi pensada para ser relacional e normalizada, garantindo a integridade dos dados:
- **`suppliers` e `products`**: Entidades principais. Ambas possuem a flag `active` (boolean) para permitir a inativação lógica de registros sem a necessidade de excluí-los fisicamente, preservando o histórico de compras.
- **`product_supplier` (Pivot N:N)**: Tabela intermediária que permite que múltiplos fornecedores distribuam o mesmo produto, e um produto tenha múltiplos fornecedores. Isso reflete o cenário real do varejo e logística.
- **`orders` e `order_items` (1:N)**: A tabela pai (`orders`) armazena o cabeçalho do pedido e o valor total (como um cache de leitura para otimizar listagens). A tabela filha (`order_items`) guarda o histórico estático (preço e quantidade no momento da compra), protegendo o pedido de flutuações futuras de preço dos produtos.

## 🏗️ 2. Arquitetura e Stack Tecnológico
- **Laravel + Inertia.js + React**: Optei pelo Inertia.js em vez de construir uma API REST separada. Isso proporcionou a fluidez de uma Single Page Application (SPA) no frontend com React, mantendo a produtividade e a segurança do roteamento nativo do Laravel.
- **Tailwind CSS**: Escolhido para a estilização pela velocidade de prototipação e facilidade em criar componentes consistentes (como os "Cards" padronizados em todas as telas).

## ⚡ 3. Filas e Processamento Assíncrono (Redis)
Conforme o requisito de vínculo em massa, utilizei o sistema de Filas do Laravel integrado ao **Redis**:
- **O Problema:** Vincular ou desvincular centenas de fornecedores a um produto de forma síncrona poderia causar timeout no servidor e travar a tela do usuário.
- **A Solução:** Criei Jobs específicos (ex: `LinkProductsToSuppliers`). Quando o usuário confirma o vínculo no frontend, a requisição HTTP é respondida quase instantaneamente com uma mensagem de "Processando", enquanto o Redis cuida da inserção pesada no banco de dados em background.

## 🛡️ 4. Regras de Negócio e Integridade
- **Transações de Banco de Dados (`DB::transaction`)**: O momento de salvar um pedido é crítico. Utilizei transações no `OrderController` para garantir o princípio de Atomicidade. Se o sistema falhar ao salvar o 3º item do carrinho, o pedido inteiro sofre *rollback*, impedindo a existência de pedidos vazios ou corrompidos.
- **Cálculo Backend**: Embora o React mostre o total do carrinho, o valor final gravado na tabela `orders` é sempre recalculado no backend (Controller) iterando sobre os itens, prevenindo manipulações indevidas na requisição no lado do cliente.

## 🎨 5. Desafios de Criatividade Implementados
Durante o desenvolvimento, implementei as seguintes melhorias extras (Opções A e B do enunciado):
- **Experiência do Usuário (UX)**: O formulário de Novo Pedido possui um comportamento dinâmico. Ao selecionar um Fornecedor, o React dispara uma requisição via *Axios* que preenche o *select* de Produtos apenas com os itens **vinculados àquele fornecedor específico**.
- **Regras Restritivas**: O endpoint de busca dinâmica já filtra apenas os produtos e fornecedores que estão com o status `active = true`, impedindo a criação de intenções de compra com dados defasados.

## 🤖 6. Uso de Inteligência Artificial
A I.A. foi utilizada como um "copiloto" durante o desenvolvimento para aumentar a produtividade. O uso se concentrou em:
- Geração de *boilerplates* para componentes de interface em React.
- Refinamento de classes utilitárias do Tailwind CSS para manter o padrão visual de Cards e Tabelas.
- Revisão de sintaxe.
Toda a arquitetura de banco de dados, lógica de transações (ACID), roteamento e integração de filas com Redis foi desenhada e auditada manualmente para garantir que as melhores práticas de desenvolvimento de software fossem respeitadas.

## 🔮 7. O que eu melhoraria com mais tempo?
- **Padrão Repository/Service**: Extrairia a lógica de negócio pesada (como a criação de pedidos complexos) dos Controllers para Services, deixando os Controllers responsáveis apenas por receber a request e devolver a resposta.
- **Soft Deletes**: Implementaria a exclusão lógica completa (`Illuminate\Database\Eloquent\SoftDeletes`) nas tabelas principais para maior segurança em auditorias.
- **Dashboard Gerencial**: Criação de uma tela inicial com gráficos mostrando o volume de compras por fornecedor utilizando uma biblioteca como o *Chart.js*.
