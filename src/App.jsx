import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'https://app-lydevtech.duckdns.org/api'

  useEffect(() => {
    // Assuming the backend has some endpoint, you might need to adjust this path
    axios.get(`${apiUrl}/hello`)
      .then(response => {
        setData(response.data)
      })
      .catch(err => {
        console.error("Error fetching data", err)
        setError(err.message)
      })
  }, [apiUrl])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Examen DevOps - Frontend</h1>
      <p>L'API configurée est : <strong>{apiUrl}</strong></p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Données de l'API :</h2>
        {error ? (
          <p style={{ color: 'red' }}>Erreur de connexion : {error}</p>
        ) : data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
    </div>
  )
}

export default App
