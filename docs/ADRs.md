# Registros de Decisão de Arquitetura (ADRs)

## ADR 1: Backend e Autenticação
*   **Decisão:** Utilização do Firebase (Firestore para banco de dados e Firebase Authentication).
*   **Alternativas Consideradas:** Supabase (PostgreSQL) e desenvolvimento de backend próprio em Node.js/Python.
*   **Consequências Assumidas:** O ecossistema garante integração ágil com o React Native e farto material de apoio acadêmico. Contudo, assume-se a restrição de executar consultas históricas altamente relacionais de forma performática.

## ADR 2: Modelagem de Dados
*   **Decisão:** Modelagem Orientada a Documentos (NoSQL).
*   **Alternativas Consideradas:** Modelagem Relacional Clássica (SQL).
*   **Consequências Assumidas:** Para manter compatibilidade estrutural com o Firestore escolhido na ADR 1, os dados serão desnormalizados. Planos de treino gerados pela LLM serão armazenados como documentos JSON complexos. Isso acelera a gravação do output da IA, mas exigirá maior processamento lógico no lado do cliente (React Native) para atualizações parciais.

## ADR 3: Estratégia de Persistência e Cache Local
*   **Decisão:** Utilização de bibliotecas de chave-valor (AsyncStorage ou MMKV).
*   **Alternativas Consideradas:** Bancos de dados locais nativos (Expo SQLite, WatermelonDB).
*   **Consequências Assumidas:** Garante a disponibilidade do plano de treino da semana atual em academias sem sinal de internet (requisito de negócio) com baixíssima complexidade de implementação. O trade-off é a impossibilidade de executar filtros complexos no histórico quando o dispositivo estiver estritamente offline.

## ADR 4: Estilização da Interface

*   **Decisão:** NativeWind v4 (Tailwind CSS v3) com Expo Router.
*   **Alternativas Consideradas:** `StyleSheet` nativo do React Native; NativeWind v5 (Tailwind CSS v4, ainda em versão de pré-lançamento).
*   **Consequências Assumidas:** As classes do protótipo gerado pelo v0 (Tailwind) puderam ser reaproveitadas quase diretamente, o que acelera a fidelidade visual. Em contrapartida, o projeto depende de `babel.config.js`, `metro.config.js`, `tailwind.config.js` e `global.css`: sem eles as classes são ignoradas e o app abre sem estilo. A versão 4 foi preferida à 5 por ser estável.

## ADR 5: Passagem de Dados entre Telas

*   **Decisão:** Parâmetros de rota do Expo Router (`router.push` com `params` e `useLocalSearchParams`), com o plano serializado em JSON e validado ao ser lido, e rota dinâmica `/treino/[id]` para o detalhe do histórico.
*   **Alternativas Consideradas:** Estado global (Context API ou Zustand) e leitura do plano diretamente do AsyncStorage.
*   **Consequências Assumidas:** O fluxo geração, plano e execução fica explícito e testável por rota, sem estado global. Parâmetros são sempre texto, então o plano é validado (`lib/params.ts`) e a tela de execução exibe um estado de erro se os dados forem inválidos. Para planos muito grandes ou persistência do treino em andamento, será necessário migrar para armazenamento local.

## Revisão do ADR 3 (Entrega 2)

O AsyncStorage foi mantido. As chaves foram versionadas (`@treino_possivel/perfil_v2` e `@treino_possivel/historico_v2`) porque o formato dos dados mudou: o perfil passou a incluir dias, tempo e equipamentos, e cada treino do histórico guarda as séries executadas.
