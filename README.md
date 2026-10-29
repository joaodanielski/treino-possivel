# Treino Possível

Aplicativo móvel desenvolvido para pessoas que treinam por conta própria com tempo e equipamentos limitados. O sistema utiliza Inteligência Artificial Generativa para adaptar planos de treinamento à realidade do usuário, ajustando rotinas automaticamente frente a falhas de frequência ou restrições de maquinário.

Trabalho acadêmico desenvolvido por João Victor Danielski e Lucas Felipetto para o curso de Engenharia de Software da Universidade Tecnológica Federal do Paraná.

## Protótipo Navegável

O fluxo principal das interfaces foi validado e gerado visualmente por IA (v0). O protótipo pode ser visualizado em:

- [Protótipo navegável](https://telas-treino-possivel.vercel.app)

O código-fonte web dos protótipos (Next.js, usado apenas como referência visual) está compactado em [`docs/prototipo/`](./docs/prototipo). Ele **não** faz parte do aplicativo.

## Documentação do Projeto

A documentação técnica e de produto está no diretório `/docs`:

- [Product Requirements Document (PRD)](./docs/PRD.md)
- [Decisões de Arquitetura (ADRs)](./docs/ADRs.md)
- [Diário de Bordo - IA](./docs/DIARIO_IA.md)

## Stack

- **Front-end:** React Native + Expo (Expo Router), estilização com NativeWind v4 (Tailwind CSS v3)
- **Persistência local:** AsyncStorage
- **Previsto para a entrega final:** Firebase (Firestore e Authentication) e LLM (Google Gemini)

## Estado da Entrega 2

Implementado: 5 telas com navegação e passagem de parâmetros, persistência local (perfil e histórico) com criação, leitura, atualização e exclusão, e estados de carregamento, vazio e erro no histórico.

Simulado nesta entrega (será substituído na entrega 3): a geração do plano e a substituição de exercícios pela IA (`lib/mock-plano.ts`). Autenticação, persistência remota e notificações também ficam para a entrega 3.

### Telas e fluxo

| Tela | Rota | Observação |
| --- | --- | --- |
| Início | `/(tabs)` | Resumo da semana e atalho para gerar treino |
| Histórico | `/(tabs)/historico` | Lista com carregamento, vazio e erro; abre o detalhe |
| Perfil | `/(tabs)/perfil` | Nome, objetivo, dias, tempo e equipamentos |
| Geração | `/treino/geracao-ia` | Modal; envia tempo, equipamentos e objetivo ao plano |
| Plano | `/treino/plano` | Recebe os dados por parâmetro; permite substituir exercícios |
| Execução | `/treino/execucao` | Recebe o plano por parâmetro; cronômetro e séries com carga e repetições |
| Detalhe | `/treino/[id]` | Parâmetro dinâmico; permite excluir o treino |

## Como executar o projeto (clone limpo)

Pré-requisitos: Node.js 20 ou superior, npm, e o aplicativo **Expo Go** no celular (ele e o computador devem estar na mesma rede Wi-Fi).

1. Clone este repositório.
2. **Atenção (Windows):** o caminho da pasta não deve conter espaços ou caracteres especiais (acentos, cedilhas); isso causa conflitos conhecidos no Metro Bundler.
3. Na raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npx expo start
   ```
5. Escaneie o QR code com o Expo Go (Android) ou com a câmera (iOS).

Se o celular não encontrar o servidor, use `npx expo start --tunnel`. Se algo ficar em cache, use `npx expo start -c`.

Verificações opcionais: `npx tsc --noEmit` e `npm run lint`.

## Variáveis de ambiente

Nenhuma é necessária nesta entrega. Chaves de API (Gemini e Firebase) serão lidas de variáveis de ambiente na entrega 3 e **nunca** serão versionadas.
