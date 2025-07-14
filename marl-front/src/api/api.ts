import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

interface PolicyIterationResponse {
  policy: Record<number, number>;
  gamma_used: number;
  theta_used: number;
  message: string;
}

interface PolicyIterationRequest {
  mdp: MDP;
  gamma?: number;
  theta?: number;
}

export const runPolicyIteration = async (
  params: PolicyIterationRequest
): Promise<PolicyIterationResponse> => {
  const response = await axios.post<PolicyIterationResponse>(
    `${API_URL}/policy_iteration/`,
    {
      mdp: params.mdp,
      gamma: params.gamma ?? 1.0, // Valores padrão
      theta: params.theta ?? 1e-10,
    }
  );
  return response.data;
};