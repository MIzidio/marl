import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import PolicyIterationComponent from './PolicyIterationComponent'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <PolicyIterationComponent />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </QueryClientProvider>
  )
}

export default App
