import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.container}>
      <div style={s.card}>
        <h1 style={s.title}>🛍️ ShopStack</h1>
        <h2 style={s.subtitle}>Welcome back</h2>
        <form onSubmit={handleSubmit} style={s.form}>
          <input style={s.input} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={s.link}>Don't have an account? <Link to="/register" style={{ color: '#e63946' }}>Register</Link></p>
      </div>
    </div>
  )
}

const s = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #e63946)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' },
  card: { background: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  title: { textAlign: 'center', fontSize: '1.8rem', marginBottom: '4px' },
  subtitle: { textAlign: 'center', color: '#666', fontWeight: 400, fontSize: '1rem', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  error: { color: '#e63946', fontSize: '0.85rem' },
  btn: { padding: '13px', background: '#e63946', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700 },
  link: { textAlign: 'center', marginTop: '16px', color: '#666', fontSize: '0.9rem' },
}
