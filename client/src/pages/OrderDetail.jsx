import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrder } from '../api'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(id).then(({ data }) => { setOrder(data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={s.loading}>Loading...</div>
  if (!order) return <div style={s.loading}>Order not found.</div>

  const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']
  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div style={s.container}>
      <button style={s.back} onClick={() => navigate('/orders')}>← My Orders</button>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p style={s.date}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span style={s.statusBadge}>{order.status.toUpperCase()}</span>
      </div>

      {/* Status tracker */}
      {order.status !== 'cancelled' && (
        <div style={s.tracker}>
          {STATUS_STEPS.map((step, i) => (
            <div key={step} style={s.step}>
              <div style={{ ...s.stepDot, background: i <= currentStep ? '#e63946' : '#e2e8f0' }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <p style={{ ...s.stepLabel, color: i <= currentStep ? '#e63946' : '#aaa', fontWeight: i === currentStep ? 700 : 400 }}>{step}</p>
              {i < STATUS_STEPS.length - 1 && <div style={{ ...s.stepLine, background: i < currentStep ? '#e63946' : '#e2e8f0' }} />}
            </div>
          ))}
        </div>
      )}

      <div style={s.layout}>
        {/* Items */}
        <div>
          <h2 style={s.sectionTitle}>Items Ordered</h2>
          <div style={s.items}>
            {order.items.map((item) => (
              <div key={item._id} style={s.item}>
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={s.itemImg} />
                <div style={s.itemInfo}>
                  <p style={s.itemName}>{item.name}</p>
                  <p style={s.itemMeta}>${item.price.toFixed(2)} × {item.qty}</p>
                </div>
                <p style={s.itemTotal}>${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <h2 style={{ ...s.sectionTitle, marginTop: '24px' }}>Shipping Address</h2>
          <div style={s.addressCard}>
            <p style={s.addrLine}>{order.shippingAddress.fullName}</p>
            <p style={s.addrLine}>{order.shippingAddress.address}</p>
            <p style={s.addrLine}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p style={s.addrLine}>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <h2 style={s.sectionTitle}>Payment Summary</h2>
          <div style={s.row}><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
          <div style={s.row}><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span></div>
          <div style={s.row}><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
          <div style={s.totalRow}><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
          <div style={{ ...s.paidBadge, background: order.isPaid ? '#d4edda' : '#f8d7da', color: order.isPaid ? '#155724' : '#721c24' }}>
            {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  loading: { textAlign: 'center', padding: '80px', color: '#888' },
  back: { background: 'none', border: 'none', color: '#e63946', fontWeight: 500, fontSize: '0.95rem', marginBottom: '24px', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' },
  date: { color: '#888', fontSize: '0.9rem' },
  statusBadge: { background: '#e63946', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' },
  tracker: { display: 'flex', alignItems: 'flex-start', marginBottom: '40px', position: 'relative' },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: { width: '32px', height: '32px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px', zIndex: 1 },
  stepLabel: { fontSize: '0.75rem', textTransform: 'capitalize', textAlign: 'center' },
  stepLine: { position: 'absolute', top: '16px', left: '50%', width: '100%', height: '2px', zIndex: 0 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' },
  items: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '14px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  itemImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' },
  itemMeta: { color: '#888', fontSize: '0.8rem' },
  itemTotal: { fontWeight: 700, color: '#e63946' },
  addressCard: { background: 'white', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  addrLine: { fontSize: '0.9rem', color: '#555', marginBottom: '4px' },
  summary: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.9rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '2px solid #e2e8f0', paddingTop: '10px' },
  paidBadge: { textAlign: 'center', padding: '8px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' },
}
