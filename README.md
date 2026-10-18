# Treino Possível

Aplicativo móvel desenvolvido para pessoas que treinam por conta própria com tempo e equipamentos limitados. O sistema utiliza Inteligência Artificial Generativa para adaptar planos de treinamento à realidade do usuário, ajustando rotinas automaticamente frente a falhas de frequência ou restrições de maquinário.

Trabalho acadêmico desenvolvido por João Victor Danielski e Lucas Felipetto para o curso de Engenharia de Software da Universidade Tecnológica Federal do Paraná.

## Protótipo Navegável
O fluxo principal das interfaces foi validado e gerado visualmente por IA. O protótipo pode ser visualizado diretamente via v0.dev:
*   [Link para o Protótipo] *(https://telas-treino-possivel.vercel.app)*

## Documentação do Projeto
A documentação técnica e de produto está modularizada no diretório `/docs`:
*   [Product Requirements Document (PRD)](./docs/PRD.md)
*   [Decisões de Arquitetura (ADRs)](./docs/ADRs.md)
*   [Diário de Bordo - IA](./docs/DIARIO_IA.md)

## Stack Tecnológica Prevista
*   **Front-end:** React Native (Expo)
*   **Persistência e Autenticação:** Firebase (Firestore, Auth)
*   **Cache Local:** MMKV / AsyncStorage
*   **IA Generativa:** Google Gemini via Google AI Studio
