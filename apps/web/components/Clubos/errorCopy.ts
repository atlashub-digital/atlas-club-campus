/** Presentation copy only: classification and recovery actions stay upstream. */
const copy: Record<string, [string, string]> = {
  version_mismatch: ['O Campus foi atualizado', 'Recarregue a página para acessar a versão atual.'],
  chunk_load: ['Parte da página não carregou', 'Recarregue a página para tentar novamente.'],
  auth_session: ['Sua sessão expirou', 'Entre novamente para continuar.'],
  plan_limit: ['Recurso indisponível no plano atual', 'Consulte a administração do Campus sobre este recurso.'],
  permission: ['Você não tem acesso a este conteúdo', 'Confira sua conta ou consulte a administração do Campus.'],
  rate_limit: ['Aguarde um momento', 'Foram feitas muitas solicitações. Tente novamente em instantes.'],
  not_found: ['Conteúdo não encontrado', 'O endereço pode ter mudado ou o conteúdo não está mais disponível.'],
  conflict: ['Este registro já existe', 'Confira os dados antes de tentar novamente.'],
  validation: ['Confira os dados informados', 'Alguns campos precisam de revisão antes de continuar.'],
  org_config: ['O Campus precisa de configuração', 'Consulte a administração para concluir a configuração.'],
  payment: ['Não foi possível concluir esta etapa', 'Confira os dados de pagamento antes de tentar novamente.'],
  upload: ['O arquivo não foi enviado', 'Confira o arquivo e sua conexão antes de tentar novamente.'],
  ai: ['O assistente está indisponível', 'Tente novamente em instantes.'],
  offline: ['Parece que você está sem conexão', 'Confira sua conexão com a internet e tente novamente.'],
  service_unavailable: ['Serviço temporariamente indisponível', 'Tente novamente em instantes.'],
  timeout: ['A resposta demorou mais que o esperado', 'Confira sua conexão e tente novamente.'],
  server: ['Não foi possível carregar esta página', 'Tente novamente ou volte ao Campus.'],
  unknown: ['Não foi possível concluir esta ação', 'Tente novamente ou volte ao Campus.'],
}
export function campusErrorCopy(kind?: string) { return copy[kind || 'unknown'] || copy.unknown }
