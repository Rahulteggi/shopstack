import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>🛍️ ShopStack</Link>
      <div style={s.links}>
        <Link to="/" style={s.link}>Shop</Link>
        {user && <Link to="/orders" style={s.link}>My Orders</Link>}
        {user?.isAdmin && <Link to="/admin" style={s.link}>Admin</Link>}
      </div>
      <div style={s.right}>
        <Link to="/cart" style={s.cartBtn}>
          🛒 Cart {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
        </Link>
        {user ? (
          <div style={s.userArea}>
            <span style={s.userName}>Hi, {user.name.split(' ')[0]}</span>
            <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div style={s.authLinks}>
            <Link to="/login" style={s.loginBtn}>Login</Link>
            <Link to="/register" style={s.registerBtn}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

const s = {
  nav: { background: 'white', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: '1.4rem', fontWeight: 700, color: '#e63946' },
  links: { display: 'flex', gap: '24px' },
  link: { color: '#555', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  cartBtn: { display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f3f5', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem', position: 'relative' },
  badge: { background: '#e63946', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 },
  userArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { color: '#555', fontSize: '0.9rem', fontWeight: 500 },
  logoutBtn: { background: 'none', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '6px', color: '#555', fontSize: '0.85rem' },
  authLinks: { display: 'flex', gap: '8px' },
  loginBtn: { padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#555', fontSize: '0.9rem', fontWeight: 500 },
  registerBtn: { padding: '8px 16px', background: '#e63946', color: 'white', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 },
}
