# Treino Possível

Aplicativo móvel desenvolvido para pessoas que treinam por conta própria com tempo e equipamentos limitados. O sistema utiliza Inteligência Artificial Generativa para adaptar planos de treinamento à realidade do usuário, ajustando rotinas automaticamente frente a falhas de frequência ou restrições de maquinário.

Trabalho acadêmico desenvolvido por João Victor Danielski e Lucas Felipetto para o curso de Engenharia de Software da Universidade Tecnológica Federal do Paraná.

## Protótipo Navegável

O fluxo principal das interfaces foi validado e gerado visualmente por IA. O protótipo pode ser visualizado diretamente via v0.dev:

- [Link para o Protótipo] _(https://telas-treino-possivel.vercel.app)_

## Documentação do Projeto

A documentação técnica e de produto está modularizada no diretório `/docs`:

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Decisões de Arquitetura (ADRs)](./docs/ADRs.md)
- [Diário de Bordo - IA](./docs/DIARIO_IA.md)

## Stack Tecnológica Prevista

- **Front-end:** React Native (Expo)
- **Persistência e Autenticação:** Firebase (Firestore, Auth)
- **Cache Local:** M## Como executar o projeto (Clone Limpo)

## Como executar o projeto (Clone Limpo)

Para avaliar o protótipo funcional desta entrega, siga os passos abaixo:

1. Clone este repositório no seu computador.
2. **Atenção (Windows):** Certifique-se de que o caminho da pasta onde clonou o projeto não contém espaços ou caracteres especiais (acentos, cedilhas), pois isso causa conflitos conhecidos no Metro Bundler do Expo Router.
3. Abra o terminal na raiz do projeto e execute a instalação das dependências:
   ```bash
   npm install
   ```
