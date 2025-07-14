import { useMutation } from '@tanstack/react-query';
import { runPolicyIteration } from '../api/api';

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

export const usePolicyIteration = () => {
  return useMutation(
    (params) => runPolicyIteration(params),
    {
      onError: (error: Error) => {
        console.error('Error in policy iteration:', error.message);
      },
    }
  );
};