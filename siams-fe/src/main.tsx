import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Page from './app/dashboard/page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div>
      <Page />
    </div>
  </StrictMode>,
)
