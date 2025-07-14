from typing import Dict, List, Tuple
from pydantic import BaseModel, RootModel

# Cada transição é uma tupla (probabilidade, próximo_estado, recompensa, terminal)
Transition = Tuple[float, int, float, bool]

# Schema para o MDP
class MDP(RootModel[Dict[int, Dict[int, List[Transition]]]]):
    pass

# Modelo para a requisição da API
class PolicyIterationSchema(BaseModel):
    mdp: MDP
    gamma: float = 1.0  # Valor padrão 1.0
    theta: float = 1e-10  # Valor padrão 1e-10

class OptimalPolicyResponse(BaseModel):
    policy: Dict[int, int]  # Mapeia estados (int) para ações (int)

    @property
    def policy_readable(self):
        action_names = {0: "LEFT", 1: "RIGHT", 2: "UP", 3: "DOWN"}
        return {state: action_names[action] for state, action in self.policy.items()}