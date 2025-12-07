import { useState, useEffect } from 'react'
import { apiService } from '../services/api.service'

const Home = () => {
  const [examples, setExamples] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExamples()
  }, [])

  const fetchExamples = async () => {
    try {
      setLoading(true)
      const data = await apiService.getExamples()
      setExamples(data.data || [])
    } catch (error) {
      console.error('Error fetching examples:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home">
      <h1>Welcome to Retail Sales App</h1>
      <div className="examples">
        <h2>Examples</h2>
        {examples.length > 0 ? (
          <ul>
            {examples.map((example) => (
              <li key={example.id}>
                <strong>{example.name}</strong>: {example.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No examples found</p>
        )}
      </div>
    </div>
  )
}

export default Home

