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
