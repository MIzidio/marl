import { useMutation } from '@tanstack/react-query';
import { runPolicyIteraction } from '../api/api';
import type { PolicyIterationRequest, PolicyIterationResponse } from '../types/types'

export const usePolicyIteration = () => {
  return useMutation<PolicyIterationResponse, Error, PolicyIterationRequest>(
    {
      mutationFn: runPolicyIteraction,
      onError: (error: Error) => {
        console.error('Error in policy iteration:', error.message);
      },
    }
  );
};