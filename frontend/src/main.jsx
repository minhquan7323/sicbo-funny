import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </QueryClientProvider>
)
