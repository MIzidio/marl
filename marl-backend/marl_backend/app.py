from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from  marl_backend.schemas import PolicyIterationSchema, OptimalPolicyResponse
from http import HTTPStatus
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens (em desenvolvimento)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos
    allow_headers=["*"],  # Permite todos os headers
)

@app.get('/')
def read_root():
    return {'message': 'Salve Salve'}

@app.post('/police_iteraction/', status_code=HTTPStatus.OK, response_model=OptimalPolicyResponse)
def police_iteraction(request: PolicyIterationSchema):
    mdp_dict = request.mdp.root

    random_actions = np.random.choice(tuple(mdp_dict[0].keys()), len(mdp_dict))
    pi = {s:a for s, a in enumerate(random_actions)}

    while True:

        V = policy_evaluation(pi, mdp_dict, request.gamma, request.theta)
        new_pi = policy_improvement(V, mdp_dict, request.gamma)

        if new_pi == pi:
            break

        pi = new_pi

    pi = {int(state): int(action) for state, action in pi.items()}

    return OptimalPolicyResponse(
        policy = pi
    )

def policy_improvement(V, P, gamma=1.0):
    Q = np.zeros((len(P), len(P[0])))

    for s in range(len(P)):
        for a in range(len(P[s])):
            for prob, next_state, reward, done in P[s][a]:
                Q[s][a] += prob * (reward + gamma * V[next_state] * (not done))

    pi = {s:a for s, a in enumerate(np.argmax(Q, axis=1))}

    return pi

def policy_evaluation(pi, P, gamma=1.0, theta=1e-10):
    V = np.random.rand(len(P))

    while True:
        new_V = np.zeros(len(P))

        for s in range(len(P)):
            for prob, next_state, reward, done in P[s][pi[s]]:
                new_V[s] += prob * (reward + gamma * V[next_state] * (not done))
        if (np.max(np.abs(new_V - V)) < theta):
            break
        V = new_V

    return V