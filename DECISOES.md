# 🧠 Decisões Técnicas - Projeto Vmarket

Este documento detalha as escolhas de arquitetura, modelagem e tecnologias adotadas durante o desenvolvimento do sistema de gestão de compras do Vmarket, visando atender aos requisitos de escalabilidade, performance e boa experiência do usuário (UX).

## 🗄️ 1. Modelagem do Banco de Dados
A modelagem foi projetada para ser relacional e normalizada, assegurando a integridade das informações:
- **`suppliers` e `products`**: principais entidades. Ambas têm a flag `active` (boolean) para possibilitar a desativação lógica de registros sem precisar excluí-los fisicamente, mantendo o histórico de compras.
- **`product_supplier` (Pivot N:N)**: Tabela intermediária que possibilita que diversos fornecedores ofereçam o mesmo produto, e que um produto possa ter vários fornecedores. Isso espelha a situação atual do varejo e da logística.
- **`orders` e `order_items` (1:N)**: A tabela principal (`orders`) guarda o cabeçalho do pedido e o valor total (atuando como um cache de leitura para otimizar as listagens). A tabela filha (`order_items`) armazena o histórico estático (preço e quantidade no momento da compra), garantindo que o pedido não seja afetado por futuras variações de preço dos produtos.

****

## 🏗️ 2. Arquitetura e Stack Tecnológico
- **Laravel + Inertia.js + React**: Escolhi usar o Inertia.js em vez de criar uma API REST separada. Isso possibilitou a fluidez de uma Single Page Application (SPA) no frontend utilizando React, preservando a eficiência e a segurança do roteamento nativo do Laravel.
- **Tailwind CSS**: Optei pelo Tailwind CSS por ser um framework com o qual já estou familiarizado e para evitar a inclusão de grandes arquivos CSS no projeto.

****

## ⚡ 3. Filas e Processamento Assíncrono (Redis)
De acordo com a exigência de vínculo em massa, empreguei o sistema de Filas do Laravel combinado ao **Redis**:
- **O Problema:** Associar ou desassociar centenas de fornecedores a um produto de maneira síncrona poderia resultar em timeout no servidor e bloquear a interface do usuário.
- **A Solução:** Desenvolvi Jobs específicos, como o `LinkProductsToSuppliers`. Ao confirmar o vínculo no frontend, o usuário recebe quase que imediatamente uma resposta HTTP com a mensagem "Processando", enquanto o Redis realiza a inserção no banco de dados em segundo plano.

  ****

## 🛡️ 4. Regras de Negócio e Integridade
- **Transações de Banco de Dados (`DB::transaction`)**: Utilizei transações no `OrderController` para garantir o princípio de Atomicidade. Se o sistema falhar ao salvar o 3º item do carrinho, o pedido inteiro sofre *rollback*, impedindo a existência de pedidos vazios ou corrompidos.
- **Cálculo Backend**: Embora o React mostre o total do carrinho, o valor final gravado na tabela `orders` é sempre recalculado no backend (Controller) iterando sobre os itens, prevenindo manipulações indevidas na requisição no lado do cliente.

****

## 🎨 5. Desafios de Criatividade Implementados
Durante o desenvolvimento, implementei as seguintes melhorias adicionais (Opções A e B do enunciado):
- **Experiência do Usuário (UX)**: O formulário de Novo Pedido apresenta um comportamento dinâmico. Quando um Fornecedor é escolhido, o React envia uma solicitação usando o *Axios*, que atualiza o *select* de Produtos para mostrar apenas os itens **associados a esse fornecedor específico**.
- **Regras Restritivas**: O endpoint de busca dinâmica já exibe somente os produtos e fornecedores com o status `active = true`, evitando a criação de intenções de compra com informações desatualizadas.

****

## 🤖 6. Uso de Inteligência Artificial
O uso se concentrou no aumento de produtividade pelo curto prazoe e entender exatamente pelo que cada arquivo é responsável. 
- **Aceleração do Setup:** Entendimento e aplicação do **Laravel Breeze** para otimizar a construção de todo o processo de autenticação e tela de login de forma segura.
- **Ecossistema e Ambiente:** Sugestões para configurar o ambiente de desenvolvimento local com o **Laragon**, além de suporte para entender as melhores práticas para a estrutura de arquivos e pastas padrão do Laravel.
- **Frontend Sustentável:** Desenvolvimento da estrutura fundamental (esqueletos) para componentes de interface, juntamente com estratégias para manter os arquivos e estados do **React** organizados e escaláveis à medida que o sistema se expande.
- **Estilização e Revisão:** Aperfeiçoamento das classes utilitárias do Tailwind CSS para garantir uma uniformidade visual (como na utilização de Cards e Tabelas) e revisões específicas de sintaxe.
  
****

## 🔮 7. O que eu melhoraria com mais tempo?
1. **Arquitetura Avançada**:
    -Para deixar as rotas mais limpas e facilitar os testes unitários, a lógica de negócio seria extraída dos Controllers para uma camada de **Services/Repositories**.
2. **Auditoria e Segurança**:
    -Para assegurar que nenhuma informação seja perdida de forma permanente e permitir auditorias precisas, implementaria **Soft Deletes** em todas as tabelas principais.
3. **Responsividade Mobile-First**: 
    - Para telas menores, adotaria a visualização de tabelas no formato de **cards empilháveis**, removendo a necessidade de rolagem horizontal e aprimorando a experiência do usuário em dispositivos móveis.
    - Melhoria da responsividade em todo o ecossistema do projeto.
4. **Inteligência de Aquisição**:
    - **Comparativo Automático**: o sistema faria uma análise entre fornecedores, indicando automaticamente quem oferece o menor e o maior preço para um item específico.
    - **Gestão de Estoque**: Painel de comparação dos níveis de estoque para ajudar na priorização de pedidos.
5. **Aprimoramento de UX/UI**:
    - **Micro-interações**: Inclusão de animações sutis em botões (feedback de clique e hover) e transições suaves em modais/popups para uma experiência de navegação mais fluida e profissional.
6. **Dashboard Gerencial**:
    -Desenvolvimento de uma interface de indicadores (KPIs) com gráficos (Chart.js) exibindo o volume de compras e despesas por período e fornecedor.

  ****
