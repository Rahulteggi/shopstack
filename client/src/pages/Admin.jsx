import { useState, useEffect } from 'react'
import { getProducts, createProduct, deleteProduct } from '../api'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']
const BLANK = { name: '', description: '', price: '', category: 'Electronics', brand: '', stock: '', image: '', isFeatured: false }

export default function Admin() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const { data } = await getProducts({ limit: 100 })
    setProducts(data.products)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) })
      setMsg('✅ Product created!')
      setForm(BLANK)
      setShowForm(false)
      fetchAll()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Admin Panel</h1>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {msg && <p style={s.msg}>{msg}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} style={s.form}>
          <h2 style={s.formTitle}>New Product</h2>
          <div style={s.grid2}>
            <input style={s.input} placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input style={s.input} placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </div>
          <textarea style={{ ...s.input, resize: 'none' }} rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div style={s.grid3}>
            <input style={s.input} type="number" placeholder="Price ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" />
            <input style={s.input} type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0" />
            <select style={s.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input style={s.input} placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            &nbsp; Mark as Featured
          </label>
          <button style={s.submitBtn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Product'}</button>
        </form>
      )}

      <div style={s.stats}>
        <div style={s.stat}><p style={s.statNum}>{products.length}</p><p style={s.statLabel}>Products</p></div>
        <div style={s.stat}><p style={s.statNum}>{products.filter((p) => p.isFeatured).length}</p><p style={s.statLabel}>Featured</p></div>
        <div style={s.stat}><p style={s.statNum}>{products.filter((p) => p.stock === 0).length}</p><p style={s.statLabel}>Out of Stock</p></div>
      </div>

      <div style={s.table}>
        <div style={s.tableHeader}>
          <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
        </div>
        {products.map((p) => (
          <div key={p._id} style={s.tableRow}>
            <div style={s.productCell}>
              {p.image && <img src={p.image} alt="" style={s.thumb} />}
              <div>
                <p style={s.prodName}>{p.name}</p>
                <p style={s.prodBrand}>{p.brand}</p>
              </div>
            </div>
            <span style={s.cell}>{p.category}</span>
            <span style={s.cell}>${p.price.toFixed(2)}</span>
            <span style={{ ...s.cell, color: p.stock === 0 ? '#e63946' : '#155724', fontWeight: 600 }}>{p.stock}</span>
            <button style={s.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '1.8rem', fontWeight: 700 },
  addBtn: { background: '#e63946', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700 },
  msg: { background: '#d4edda', color: '#155724', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' },
  form: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' },
  formTitle: { fontSize: '1.1rem', fontWeight: 700 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  input: { padding: '10px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', width: '100%' },
  checkLabel: { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#555' },
  submitBtn: { background: '#e63946', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  stat: { background: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNum: { fontSize: '2rem', fontWeight: 800, color: '#e63946' },
  statLabel: { color: '#888', fontSize: '0.85rem', marginTop: '4px' },
  table: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '12px 20px', background: '#f8f9fa', fontWeight: 700, fontSize: '0.85rem', color: '#555' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '14px 20px', borderTop: '1px solid #f1f3f5', alignItems: 'center' },
  productCell: { display: 'flex', gap: '10px', alignItems: 'center' },
  thumb: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' },
  prodName: { fontWeight: 600, fontSize: '0.88rem' },
  prodBrand: { color: '#888', fontSize: '0.78rem' },
  cell: { fontSize: '0.88rem', color: '#555' },
  deleteBtn: { background: '#f8d7da', color: '#721c24', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 },
}
