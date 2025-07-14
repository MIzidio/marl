import React, { useState, useEffect } from 'react';
import { usePolicyIteration } from './hooks/usePolicyIteration';

type Transition = [number, number, number, boolean]; // [prob, next_state, reward, done]

interface StateActions {
  [action: number]: Transition[];
}

interface MDP {
  [state: number]: StateActions;
}

const PolicyIterationComponent: React.FC = () => {
  // Estado inicial do MDP
  const initialMdp: MDP = {
    0: {
      0: [[1.0, 0, 0.0, true]],
      1: [[1.0, 0, 0.0, true]],
    },
    1: {
      0: [
        [0.5, 0, 0.0, true],
        [0.3, 1, 0.0, false],
        [0.2, 2, 0.0, false],
      ],
      1: [
        [0.5, 2, 0.0, false],
        [0.3, 1, 0.0, false],
        [0.2, 0, 0.0, true],
      ],
    },
    // ... adicione mais estados conforme necessário
  };

  const [mdp, setMdp] = useState<MDP>(initialMdp);
  const [mdpText, setMdpText] = useState<string>(
    JSON.stringify(initialMdp, null, 2)
  );
  const [gamma, setGamma] = useState<number>(1.0);
  const [theta, setTheta] = useState<number>(1e-10);
  const [isValidMdp, setIsValidMdp] = useState<boolean>(true);

  const { mutate, isLoading, isError, error, data } = usePolicyIteration();

  // Atualiza o MDP quando o texto muda (com validação)
  useEffect(() => {
    try {
      const parsed = JSON.parse(mdpText);
      setMdp(parsed);
      setIsValidMdp(true);
    } catch (err) {
      setIsValidMdp(false);
    }
  }, [mdpText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidMdp) return;
    mutate({ mdp, gamma, theta });
  };

  const handleMdpChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMdpText(e.target.value);
  };

  const formatMdp = () => {
    try {
      const parsed = JSON.parse(mdpText);
      setMdpText(JSON.stringify(parsed, null, 2));
      setIsValidMdp(true);
    } catch (err) {
      setIsValidMdp(false);
    }
  };

  const actionNames: Record<number, string> = {
    0: 'LEFT',
    1: 'RIGHT',
    2: 'UP',
    3: 'DOWN',
  };

  return (
    <div className="policy-iteration-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mdp">MDP Definition:</label>
          <textarea
            id="mdp"
            value={mdpText}
            onChange={handleMdpChange}
            rows={15}
            cols={50}
            className={!isValidMdp ? 'invalid' : ''}
          />
          {!isValidMdp && (
            <div className="error-message">Invalid JSON format</div>
          )}
          <button 
            type="button" 
            onClick={formatMdp}
            className="format-button"
          >
            Format JSON
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="gamma">Gamma:</label>
          <input
            id="gamma"
            type="number"
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            step="0.1"
            min="0"
            max="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="theta">Theta:</label>
          <input
            id="theta"
            type="number"
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            step="1e-10"
            min="0"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !isValidMdp}
          className="submit-button"
        >
          {isLoading ? 'Processing...' : 'Run Policy Iteration'}
        </button>
      </form>

      {isError && (
        <div className="error-message">
          Error: {error?.message || 'Unknown error occurred'}
        </div>
      )}

      {data && (
        <div className="results">
          <h3>Optimal Policy:</h3>
          <ul>
            {Object.entries(data.policy).map(([state, action]) => (
              <li key={state}>
                State {state}: {actionNames[action] || action}
              </li>
            ))}
          </ul>
          <div className="meta-data">
            <p>Gamma used: {data.gamma_used}</p>
            <p>Theta used: {data.theta_used}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .policy-iteration-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        textarea {
          width: 100%;
          font-family: monospace;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        textarea.invalid {
          border-color: #ff4444;
        }
        input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100px;
        }
        button {
          padding: 8px 15px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        button.format-button {
          background-color: #2196F3;
          margin-top: 5px;
        }
        .error-message {
          color: #ff4444;
          margin-top: 5px;
        }
        .results {
          margin-top: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        .meta-data {
          margin-top: 10px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PolicyIterationComponent;