# Documento de Requisitos do Produto (PRD)

## 1. Problema e Público-Alvo
**Problema:** Planos de treino convencionais assumem acesso a academias completas e disponibilidade de uma hora diária. Indivíduos com restrições de tempo (ex: 30 minutos) ou equipamento (ex: apenas halteres) tendem a abandonar as rotinas por falta de adaptação. Adaptar essas restrições via código convencional é rígido e custoso.
**Público-alvo:** Pessoas que treinam por conta própria, em casa ou em academias de infraestrutura limitada, e que necessitam de rotinas dinâmicas e realistas.

## 2. Requisitos Funcionais (Escopo)
*   **RF01:** Autenticação de usuários com sessão persistente e proteção de rotas privadas.
*   **RF02:** Configuração e gerenciamento de perfil com inputs para objetivo, dias disponíveis na semana, tempo diário (minutos) e equipamentos acessíveis.
*   **RF03:** Geração de plano de treino semanal via LLM, consumindo os dados do perfil, com funcionalidade de solicitar à IA a substituição pontual de exercícios não executáveis.
*   **RF04:** Execução de treino via interface de checklist, permitindo marcar exercícios e séries como concluídos.
*   **RF05:** Visualização de histórico básico de execução em formato de lista (data, treino realizado e status).
*   **RF06:** Replanejamento dinâmico via LLM, acionado pelo sistema ao detectar duas semanas consecutivas de falha na frequência do usuário.
*   **RF07:** Integração de recurso nativo para agendamento de notificações locais nos dias e horários configurados para o treino.

## 3. Fora do Escopo
*   Cronômetro de descanso embutido.
*   Vídeos ou animações demonstrativas da execução de exercícios.
*   Edição manual granular do treino (alterações devem ser mediadas pela IA).
*   Acompanhamento nutricional ou de dieta.
*   Integração com smartwatches (Apple Health, Google Fit).
*   Gamificação e recursos sociais.

## 4. Revisão da Entrega 2 (implementação x planejado)

Divergências entre o PRD original e o que foi efetivamente implementado nesta etapa:

| Item | Planejado | Implementado na Entrega 2 | Motivo / Próximo passo |
| :-- | :-- | :-- | :-- |
| RF01 Autenticação | Sessão persistente e rotas privadas | Não implementado | Fora do escopo da etapa; entrega 3 |
| RF02 Perfil | Objetivo, dias, tempo e equipamentos | Implementado e salvo localmente (AsyncStorage). Tempo ajustado por botões de -5/+5 min | O controle deslizante exigiria uma dependência nativa extra |
| RF03 Plano via LLM | Plano gerado pela LLM, com substituição pontual | Telas de geração e plano prontas; **geração e substituição simuladas** (`lib/mock-plano.ts`) | A integração com a LLM é da entrega 3 |
| RF04 Execução | Checklist de exercícios e séries | Implementado: cronômetro, séries com carga e repetições, progresso | - |
| RF05 Histórico | Lista com data, treino e status | Implementado, com detalhe e exclusão. Status possíveis: "Concluído" e "Parcial" | O status "Faltou" do protótipo depende da agenda semanal (RF06/RF07) |
| RF06 Replanejamento | Disparo após 2 semanas de falha | Não implementado | Entrega 3 |
| RF07 Notificações | Notificações locais agendadas | Não implementado | Entrega 3 |

Ajustes de interface em relação ao protótipo do v0: foi incluída a tela de **Geração** (tempo e equipamentos do dia, pré-preenchidos pelo perfil) antes da tela de **Plano**, para que o treino de hoje possa diferir do perfil padrão.
