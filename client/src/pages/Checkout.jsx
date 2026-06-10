import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()
  const [form, setForm] = useState({ fullName: '', address: '', city: '', postalCode: '', country: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = parseFloat((cartTotal * 0.08).toFixed(2))
  const total = parseFloat((cartTotal + shipping + tax).toFixed(2))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await createOrder({
        items: cart.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: form,
      })
      clearCart()
      navigate(`/orders/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) { navigate('/cart'); return null }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Checkout</h1>
      <div style={s.layout}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <h2 style={s.sectionTitle}>Shipping Address</h2>
          <input style={s.input} placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input style={s.input} placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <div style={s.row}>
            <input style={s.input} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <input style={s.input} placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
          </div>
          <input style={s.input} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />

          <h2 style={{ ...s.sectionTitle, marginTop: '24px' }}>Payment</h2>
          <div style={s.paymentNote}>
            <p>💳 Demo Mode — No real payment required</p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>In production, Stripe would be integrated here</p>
          </div>

          {error && <p style={s.error}>{error}</p>}
          <button style={s.placeBtn} type="submit" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order • $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div style={s.summary}>
          <h2 style={s.sectionTitle}>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.product} style={s.summaryItem}>
              <span style={s.summaryName}>{item.name} × {item.qty}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={s.divider} />
          <div style={s.summaryRow}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div style={s.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
          <div style={s.summaryRow}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div style={s.totalRow}><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '32px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' },
  input: { padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  paymentNote: { background: '#f0f9ff', border: '1px solid #bee3f8', borderRadius: '8px', padding: '16px', fontSize: '0.9rem', color: '#2b6cb0' },
  error: { color: '#e63946', fontSize: '0.85rem' },
  placeBtn: { background: '#e63946', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', marginTop: '8px' },
  summary: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555' },
  summaryName: { flex: 1, marginRight: '8px' },
  divider: { borderTop: '1px solid #e2e8f0', margin: '4px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '2px solid #e2e8f0', paddingTop: '10px' },
}
