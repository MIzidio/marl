from fastapi import FastAPI
import numpy as np
from  marl_backend.schemas import PolicyIterationSchema, OptimalPolicyResponse
from http import HTTPStatus

app = FastAPI()

@app.get('/')
def read_root():
    return {'message': 'Salve Salve'}

@app.post('/police_iteraction/', status_code=HTTPStatus.OK, response_model=OptimalPolicyResponse)
def police_iteraction(request: PolicyIterationSchema):
    random_actions = np.random.choice(tuple(P[0].keys()), len(P))
    pi = {s:a for s, a in enumerate(random_actions)}

    while True:

        V = policy_evaluation(pi, P, gamma, theta)
        new_pi = policy_improvement(V, P, gamma)

        if new_pi == pi:
            break

        pi = new_pi

    return OptimalPolicyResponse(
        police = pi
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