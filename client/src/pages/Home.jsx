import { useState, useEffect } from 'react'
import { getProducts } from '../api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Other']

export default function Home() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [category, sort, page])

  const fetchProducts = async (searchQuery = search) => {
    setLoading(true)
    try {
      const params = { sort, page, limit: 12 }
      if (searchQuery) params.search = searchQuery
      if (category) params.category = category
      const { data } = await getProducts(params)
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProducts(search)
  }

  const handleCategory = (cat) => {
    setCategory(cat === 'All' ? '' : cat)
    setPage(1)
  }

  return (
    <div style={s.container}>
      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Discover Amazing Products</h1>
        <p style={s.heroSub}>Shop the latest electronics, fashion, books, and more</p>
        <form onSubmit={handleSearch} style={s.searchForm}>
          <input style={s.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
          <button style={s.searchBtn} type="submit">🔍 Search</button>
        </form>
      </div>

      <div style={s.content}>
        {/* Filters */}
        <div style={s.filters}>
          <div style={s.categoryList}>
            {CATEGORIES.map((cat) => (
              <button key={cat} style={{ ...s.catBtn, background: (category === cat || (cat === 'All' && !category)) ? '#e63946' : 'white', color: (category === cat || (cat === 'All' && !category)) ? 'white' : '#555' }}
                onClick={() => handleCategory(cat)}>{cat}</button>
            ))}
          </div>
          <select style={s.sortSelect} value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>

        {/* Results */}
        <div style={s.resultsBar}>
          <span style={s.resultCount}>{total} products</span>
        </div>

        {loading ? (
          <div style={s.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={s.empty}>No products found. Try a different search.</div>
        ) : (
          <div style={s.grid}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={s.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} style={{ ...s.pageBtn, background: page === p ? '#e63946' : 'white', color: page === p ? 'white' : '#555' }}
                onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  container: { minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #1a1a2e, #e63946)', color: 'white', padding: '60px 32px', textAlign: 'center' },
  heroTitle: { fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' },
  heroSub: { fontSize: '1.1rem', opacity: 0.85, marginBottom: '32px' },
  searchForm: { display: 'flex', gap: '8px', maxWidth: '500px', margin: '0 auto' },
  searchInput: { flex: 1, padding: '14px 18px', borderRadius: '10px', border: 'none', fontSize: '1rem', outline: 'none' },
  searchBtn: { padding: '14px 24px', background: 'white', color: '#e63946', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  filters: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' },
  categoryList: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn: { padding: '7px 14px', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 },
  sortSelect: { padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', background: 'white', color: '#555' },
  resultsBar: { marginBottom: '16px' },
  resultCount: { color: '#888', fontSize: '0.9rem' },
  loading: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '1.1rem' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
  pagination: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '40px' },
  pageBtn: { width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' },
}
