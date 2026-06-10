import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <div style={s.card} onClick={() => navigate(`/product/${product._id}`)}>
      <div style={s.imgWrap}>
        <img src={product.image || 'https://via.placeholder.com/300x200'} alt={product.name} style={s.img} />
        {product.isFeatured && <span style={s.featuredBadge}>Featured</span>}
        {product.stock === 0 && <div style={s.outOfStock}>Out of Stock</div>}
      </div>
      <div style={s.body}>
        <p style={s.category}>{product.category}</p>
        <h3 style={s.name}>{product.name}</h3>
        <div style={s.ratingRow}>
          <span style={s.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
          <span style={s.numReviews}>({product.numReviews})</span>
        </div>
        <div style={s.footer}>
          <span style={s.price}>${product.price.toFixed(2)}</span>
          <button style={{ ...s.addBtn, opacity: product.stock === 0 ? 0.5 : 1 }}
            onClick={handleAdd} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' },
  imgWrap: { position: 'relative', paddingTop: '66%', overflow: 'hidden' },
  img: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  featuredBadge: { position: 'absolute', top: '10px', left: '10px', background: '#e63946', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' },
  outOfStock: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' },
  body: { padding: '14px' },
  category: { fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' },
  name: { fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '6px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' },
  stars: { color: '#f59e0b', fontSize: '0.85rem' },
  numReviews: { color: '#aaa', fontSize: '0.75rem' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '1.1rem', fontWeight: 700, color: '#e63946' },
  addBtn: { background: '#e63946', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 },
}
