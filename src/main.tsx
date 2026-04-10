import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './Header/Navbar/Navbar.tsx'
import Nextpage from './Footer/Next_page/Next_page.tsx'
import './Footer/footer.tsx'
import Footer from './Footer/footer.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar />

    <App />
    <Footer />
    <Nextpage />
  </StrictMode>,
)
