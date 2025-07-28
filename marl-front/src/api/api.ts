import axios from 'axios'
import type { PolicyIterationRequest, PolicyIterationResponse } from '../types/types'

const API_URL = 'http://127.0.0.1:8000';

export const runPolicyIteraction = async (
  { mdp, gamma, theta }: PolicyIterationRequest
): Promise<PolicyIterationResponse> => {
  const response = await axios.post<PolicyIterationResponse>(
    `${API_URL}/police_iteraction/`,
    {
      mdp: mdp,
      gamma: gamma ?? 1.0, // Valores padrão
      theta: theta ?? 1e-10,
    }
  );
  return response.data;
};