import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shipping = cartTotal > 100 ? 0 : 9.99
  const tax = parseFloat((cartTotal * 0.08).toFixed(2))
  const total = parseFloat((cartTotal + shipping + tax).toFixed(2))

  if (cart.length === 0) return (
    <div style={s.empty}>
      <p style={s.emptyIcon}>🛒</p>
      <h2 style={s.emptyTitle}>Your cart is empty</h2>
      <p style={s.emptySub}>Add some products to get started</p>
      <button style={s.shopBtn} onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  )

  return (
    <div style={s.container}>
      <h1 style={s.title}>Shopping Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h1>
      <div style={s.layout}>
        {/* Items */}
        <div style={s.items}>
          {cart.map((item) => (
            <div key={item.product} style={s.item}>
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} style={s.itemImg} />
              <div style={s.itemInfo}>
                <p style={s.itemName}>{item.name}</p>
                <p style={s.itemPrice}>${item.price.toFixed(2)} each</p>
              </div>
              <div style={s.qtyControl}>
                <button style={s.qtyBtn} onClick={() => updateQty(item.product, item.qty - 1)}>−</button>
                <span style={s.qtyNum}>{item.qty}</span>
                <button style={s.qtyBtn} onClick={() => updateQty(item.product, item.qty + 1)}>+</button>
              </div>
              <div style={s.itemTotal}>
                <p style={s.itemTotalPrice}>${(item.price * item.qty).toFixed(2)}</p>
                <button style={s.removeBtn} onClick={() => removeFromCart(item.product)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <h2 style={s.summaryTitle}>Order Summary</h2>
          <div style={s.summaryRow}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div style={s.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
          {shipping > 0 && <p style={s.freeShip}>Add ${(100 - cartTotal).toFixed(2)} more for free shipping!</p>}
          <div style={s.summaryRow}><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <div style={s.totalRow}><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button style={s.checkoutBtn} onClick={() => user ? navigate('/checkout') : navigate('/login')}>
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <button style={s.continueBtn} onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '32px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' },
  items: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: { background: 'white', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  itemImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' },
  itemPrice: { color: '#888', fontSize: '0.85rem' },
  qtyControl: { display: 'flex', alignItems: 'center', gap: '12px' },
  qtyBtn: { background: '#f1f3f5', border: 'none', width: '32px', height: '32px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, color: '#333' },
  qtyNum: { fontWeight: 700, fontSize: '1rem', minWidth: '24px', textAlign: 'center' },
  itemTotal: { textAlign: 'right' },
  itemTotalPrice: { fontWeight: 700, fontSize: '1.05rem', color: '#e63946', marginBottom: '4px' },
  removeBtn: { background: 'none', border: 'none', color: '#aaa', fontSize: '0.8rem', textDecoration: 'underline' },
  summary: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '12px' },
  summaryTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.95rem' },
  freeShip: { fontSize: '0.8rem', color: '#155724', background: '#d4edda', padding: '6px 10px', borderRadius: '6px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '4px' },
  checkoutBtn: { background: '#e63946', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem' },
  continueBtn: { background: 'none', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', color: '#555', fontSize: '0.95rem' },
  empty: { textAlign: 'center', padding: '80px 24px', maxWidth: '400px', margin: '0 auto' },
  emptyIcon: { fontSize: '4rem', marginBottom: '16px' },
  emptyTitle: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' },
  emptySub: { color: '#888', marginBottom: '24px' },
  shopBtn: { background: '#e63946', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' },
}
