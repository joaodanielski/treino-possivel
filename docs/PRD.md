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
