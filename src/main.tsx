import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter} from 'react-router-dom'
import { SearchProvider } from './context/SearchContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <SearchProvider>

  <React.StrictMode>
     <BrowserRouter>
    <App />
     </BrowserRouter>
  
  </React.StrictMode>,

  </SearchProvider>
)
