// Tipos para o MDP
export type Transition = [number, number, number, boolean]; // [prob, next_state, reward, done]

export interface StateActions {
  [action: number]: Transition[];
}

export interface MDP {
  [state: number]: StateActions;
}

// Tipos para a requisição
export interface PolicyIterationRequest {
  mdp: MDP;
  gamma?: number;
  theta?: number;
}

// Tipos para a resposta
export interface PolicyIterationResponse {
  policy: Record<number, number>;
  gamma_used: number;
  theta_used: number;
  message: string;
}