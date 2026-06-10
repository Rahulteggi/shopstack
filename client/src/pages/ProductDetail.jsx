import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, addReview } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getProduct(id).then(({ data }) => { setProduct(data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={s.loading}>Loading...</div>
  if (!product) return <div style={s.loading}>Product not found.</div>

  const handleAddToCart = () => { addToCart(product, qty); navigate('/cart') }

  const handleReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addReview(id, reviewForm)
      setMsg('Review added!')
      const { data } = await getProduct(id)
      setProduct(data)
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error adding review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={s.container}>
      <button style={s.back} onClick={() => navigate(-1)}>← Back</button>
      <div style={s.main}>
        {/* Image */}
        <div style={s.imgCol}>
          <img src={product.image || 'https://via.placeholder.com/500x400'} alt={product.name} style={s.img} />
        </div>
        {/* Info */}
        <div style={s.infoCol}>
          <p style={s.category}>{product.category} · {product.brand}</p>
          <h1 style={s.name}>{product.name}</h1>
          <div style={s.ratingRow}>
            <span style={s.stars}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span style={s.numRev}>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <p style={s.price}>${product.price.toFixed(2)}</p>
          <p style={s.desc}>{product.description}</p>
          <div style={s.stockRow}>
            <span style={{ ...s.stockBadge, background: product.stock > 0 ? '#d4edda' : '#f8d7da', color: product.stock > 0 ? '#155724' : '#721c24' }}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>
          {product.stock > 0 && (
            <div style={s.addRow}>
              <select style={s.qtySelect} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button style={s.addBtn} onClick={handleAddToCart}>Add to Cart 🛒</button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div style={s.reviewsSection}>
        <h2 style={s.reviewsTitle}>Customer Reviews</h2>
        {product.reviews.length === 0 && <p style={s.noReviews}>No reviews yet. Be the first!</p>}
        <div style={s.reviewList}>
          {product.reviews.map((r) => (
            <div key={r._id} style={s.reviewCard}>
              <div style={s.reviewTop}>
                <strong>{r.name}</strong>
                <span style={s.revStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style={s.revComment}>{r.comment}</p>
              <p style={s.revDate}>{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {user && (
          <form onSubmit={handleReview} style={s.reviewForm}>
            <h3 style={s.writeReview}>Write a Review</h3>
            <select style={s.input} value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
            <textarea style={{ ...s.input, resize: 'none' }} rows={3} value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your experience..." required />
            {msg && <p style={{ color: msg.includes('!') ? '#155724' : '#721c24', fontSize: '0.85rem' }}>{msg}</p>}
            <button style={s.submitReview} type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        )}
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  loading: { textAlign: 'center', padding: '80px', color: '#888', fontSize: '1.1rem' },
  back: { background: 'none', border: 'none', color: '#e63946', fontWeight: 500, fontSize: '0.95rem', marginBottom: '24px', cursor: 'pointer' },
  main: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' },
  imgCol: { borderRadius: '16px', overflow: 'hidden', background: '#f1f3f5' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  infoCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  category: { fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 },
  name: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  stars: { color: '#f59e0b', fontSize: '1.1rem' },
  numRev: { color: '#888', fontSize: '0.9rem' },
  price: { fontSize: '2rem', fontWeight: 800, color: '#e63946' },
  desc: { color: '#555', lineHeight: 1.7, fontSize: '0.95rem' },
  stockRow: { display: 'flex' },
  stockBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 },
  addRow: { display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' },
  qtySelect: { padding: '10px 16px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' },
  addBtn: { flex: 1, background: '#e63946', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem' },
  reviewsSection: { borderTop: '1px solid #e2e8f0', paddingTop: '40px' },
  reviewsTitle: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' },
  noReviews: { color: '#888', marginBottom: '20px' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' },
  reviewCard: { background: 'white', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  reviewTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  revStars: { color: '#f59e0b' },
  revComment: { color: '#555', fontSize: '0.95rem', lineHeight: 1.6 },
  revDate: { color: '#aaa', fontSize: '0.8rem', marginTop: '6px' },
  reviewForm: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' },
  writeReview: { fontSize: '1.1rem', fontWeight: 600 },
  input: { padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', width: '100%' },
  submitReview: { background: '#e63946', color: 'white', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem' },
}
