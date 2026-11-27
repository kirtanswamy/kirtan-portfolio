import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './styles/editorial-refinement.css'
import './styles/reading-room-art-direction.css'
import './styles/workshop-art-direction.css'
import './styles/portrait-photo.css'
import './styles/final-page-art-direction.css'
import './styles/contact-envelope.css'
import './styles/immersive-chapters.css'
import './styles/project-case-study.css'
import './styles/useful-engine.css'
import './styles/journey-atlas.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
