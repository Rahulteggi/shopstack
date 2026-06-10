import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrders } from '../api'

const STATUS_COLORS = {
  pending: { bg: '#fff3cd', color: '#856404' },
  processing: { bg: '#cce5ff', color: '#004085' },
  shipped: { bg: '#d4edda', color: '#155724' },
  delivered: { bg: '#d4edda', color: '#155724' },
  cancelled: { bg: '#f8d7da', color: '#721c24' },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyOrders().then(({ data }) => { setOrders(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={s.loading}>Loading orders...</div>

  return (
    <div style={s.container}>
      <h1 style={s.title}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={s.empty}>
          <p style={s.emptyIcon}>📦</p>
          <p style={s.emptyText}>No orders yet. Start shopping!</p>
          <button style={s.shopBtn} onClick={() => navigate('/')}>Shop Now</button>
        </div>
      ) : (
        <div style={s.list}>
          {orders.map((order) => {
            const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending
            return (
              <div key={order._id} style={s.card} onClick={() => navigate(`/orders/${order._id}`)}>
                <div style={s.cardHeader}>
                  <div>
                    <p style={s.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={s.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color }}>{order.status}</span>
                </div>
                <div style={s.items}>
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item._id} style={s.itemChip}>{item.name} × {item.qty}</span>
                  ))}
                  {order.items.length > 3 && <span style={s.moreItems}>+{order.items.length - 3} more</span>}
                </div>
                <div style={s.cardFooter}>
                  <span style={s.total}>${order.totalPrice.toFixed(2)}</span>
                  <span style={s.viewLink}>View Details →</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const s = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '32px' },
  loading: { textAlign: 'center', padding: '80px', color: '#888' },
  empty: { textAlign: 'center', padding: '60px' },
  emptyIcon: { fontSize: '3.5rem', marginBottom: '16px' },
  emptyText: { color: '#888', marginBottom: '20px', fontSize: '1.1rem' },
  shopBtn: { background: '#e63946', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  orderId: { fontWeight: 700, fontSize: '1rem', marginBottom: '2px' },
  orderDate: { color: '#888', fontSize: '0.85rem' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize' },
  items: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  itemChip: { background: '#f1f3f5', padding: '3px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#555' },
  moreItems: { color: '#888', fontSize: '0.8rem', padding: '3px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f3f5', paddingTop: '12px' },
  total: { fontWeight: 700, fontSize: '1.1rem', color: '#e63946' },
  viewLink: { color: '#e63946', fontSize: '0.85rem', fontWeight: 500 },
}
