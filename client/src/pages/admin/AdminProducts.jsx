import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  fetchAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '@/features/admin/adminSlice'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Leaf, Flame } from 'lucide-react'

const CATEGORIES = ['appetizer', 'main_course', 'dessert', 'beverage', 'fast_food']
const CATEGORY_LABEL = {
  appetizer: 'Appetizer',
  main_course: 'Main course',
  dessert: 'Dessert',
  beverage: 'Beverage',
  fast_food: 'Fast food',
}
const SPICE_LEVELS = ['none', 'mild', 'medium', 'hot']

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'main_course',
  isVeg: true,
  spiceLevel: 'none',
  isPopular: false,
  isAvailable: true,
}

function ProductModal({ product, onClose }) {
  const dispatch = useAppDispatch()
  const isEdit = !!product
  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          isVeg: product.isVeg,
          spiceLevel: product.spiceLevel,
          isPopular: product.isPopular,
          isAvailable: product.isAvailable,
        }
      : EMPTY_FORM
  )
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) return
    setSubmitting(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (imageFile) fd.append('image', imageFile)

    if (isEdit) {
      await dispatch(updateProduct({ id: product._id, formData: fd }))
    } else {
      await dispatch(createProduct(fd))
    }

    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50 dark:bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-clay dark:border-border-dark">
          <h3 className="font-display text-xl font-bold text-ink dark:text-text-dark">
            {isEdit ? 'Edit product' : 'New product'}
          </h3>
          <button onClick={onClose} className="text-ink/40 dark:text-text-dark/40 hover:text-ink dark:hover:text-text-dark transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Chicken Sekuwa"
              className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 outline-none focus:border-chili rounded-sm transition-colors"
            />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Smoky grilled chicken on skewers…"
              className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 outline-none focus:border-chili rounded-sm transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
                Price (Rs.)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="350"
                className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 outline-none focus:border-chili rounded-sm transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 font-body text-sm text-ink dark:text-text-dark outline-none focus:border-chili rounded-sm transition-colors cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
                Spice level
              </label>
              <select
                name="spiceLevel"
                value={form.spiceLevel}
                onChange={handleChange}
                className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-2.5 font-body text-sm text-ink dark:text-text-dark outline-none focus:border-chili rounded-sm transition-colors cursor-pointer capitalize"
              >
                {SPICE_LEVELS.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold block mb-1.5">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full font-body text-sm text-ink/60 dark:text-text-dark/60 file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border file:border-clay dark:file:border-border-dark file:bg-transparent file:font-body file:text-xs file:text-ink/60 dark:file:text-text-dark/60 file:cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            {[
              { name: 'isVeg',       label: 'Vegetarian' },
              { name: 'isPopular',   label: 'Mark as popular' },
              { name: 'isAvailable', label: 'Available' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name]}
                  onChange={handleChange}
                  className="w-4 h-4 accent-chili"
                />
                <span className="font-body text-sm text-ink/70 dark:text-text-dark/70">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-clay dark:border-border-dark flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-ink dark:bg-chili hover:bg-chili dark:hover:bg-chili-dark text-cream font-body font-semibold text-sm py-3 rounded-sm transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <button
            onClick={onClose}
            className="px-5 border border-clay dark:border-border-dark text-ink/65 dark:text-text-dark/65 font-body font-semibold text-sm rounded-sm hover:border-ink/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteModal({ product, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50 dark:bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm p-7 shadow-2xl">
        <h3 className="font-display text-xl font-bold text-ink dark:text-text-dark mb-1">
          Delete {product.name}?
        </h3>
        <p className="font-body text-sm text-ink/55 dark:text-text-dark/55 mb-6">
          This removes the product from the menu permanently.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-chili hover:bg-chili-dark text-cream font-body font-semibold text-sm py-3 rounded-sm transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-clay dark:border-border-dark text-ink/65 dark:text-text-dark/65 font-body font-semibold text-sm py-3 rounded-sm hover:border-ink/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const dispatch = useAppDispatch()
  const { products, productsStatus } = useAppSelector((s) => s.admin)
  const [modal, setModal] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchAllProductsAdmin())
  }, [dispatch])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter ? p.category === categoryFilter : true
    return matchSearch && matchCat
  })

  return (
    <>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-1">
            Manage
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-4xl font-bold text-ink dark:text-text-dark">Products</h1>
            <button
              onClick={() => setModal('create')}
              className="inline-flex items-center gap-2 bg-ink dark:bg-chili hover:bg-chili dark:hover:bg-chili-dark text-cream font-body font-semibold text-sm px-5 py-2.5 rounded-sm transition-colors mb-1"
            >
              <Plus size={15} />
              New product
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 bg-cream dark:bg-card-dark border border-clay dark:border-border-dark px-4 py-2 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 dark:placeholder:text-text-dark/30 outline-none focus:border-chili rounded-sm transition-colors"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-cream dark:bg-card-dark border border-clay dark:border-border-dark px-4 py-2 font-body text-sm text-ink dark:text-text-dark outline-none focus:border-chili rounded-sm transition-colors cursor-pointer"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
            ))}
          </select>
        </div>

        {productsStatus === 'loading' && (
          <div className="flex items-center gap-3 py-16">
            <div className="w-5 h-5 border-2 border-chili border-t-transparent rounded-full animate-spin" />
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">Loading products…</p>
          </div>
        )}

        {productsStatus === 'succeeded' && filtered.length === 0 && (
          <div className="py-20 text-center border border-clay/50 dark:border-border-dark rounded-sm">
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">No products found.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="border border-clay dark:border-border-dark rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-clay dark:border-border-dark bg-clay-light/50 dark:bg-surface-dark">
                    {['Product', 'Category', 'Price', 'Flags', 'Status', 'Rating', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-clay/50 dark:border-border-dark last:border-0 hover:bg-clay-light/25 dark:hover:bg-card-dark/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}${product.image}`}
                              alt={product.name}
                              className="w-9 h-9 rounded-sm object-cover shrink-0 bg-clay-light dark:bg-surface-dark"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-sm bg-clay-light dark:bg-surface-dark shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-body text-sm font-semibold text-ink dark:text-text-dark truncate max-w-40">
                              {product.name}
                            </p>
                            <p className="font-body text-xs text-ink/40 dark:text-text-dark/40 truncate max-w-40">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-body text-sm text-ink/60 dark:text-text-dark/60 whitespace-nowrap capitalize">
                        {CATEGORY_LABEL[product.category] || product.category}
                      </td>
                      <td className="px-4 py-3.5 font-body text-sm font-semibold text-ink dark:text-text-dark whitespace-nowrap">
                        Rs. {product.price.toLocaleString('en-NP')}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {product.isVeg && (
                            <span title="Vegetarian">
                              <Leaf size={13} className="text-cardamom" />
                            </span>
                          )}
                          {product.spiceLevel !== 'none' && (
                            <span title={`Spice: ${product.spiceLevel}`}>
                              <Flame size={13} className="text-chili" />
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="font-body text-xs font-semibold text-turmeric">Popular</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 font-body text-xs font-semibold ${
                          product.isAvailable ? 'text-cardamom' : 'text-ink/40 dark:text-text-dark/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.isAvailable ? 'bg-cardamom' : 'bg-clay'}`} />
                          {product.isAvailable ? 'Available' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-body text-sm text-ink/60 dark:text-text-dark/60 whitespace-nowrap">
                        {product.averageRating > 0
                          ? `${product.averageRating.toFixed(1)} (${product.totalReviews})`
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => dispatch(toggleProductStatus(product._id))}
                            title={product.isAvailable ? 'Hide product' : 'Show product'}
                            className="p-2 rounded-sm text-ink/40 dark:text-text-dark/40 hover:text-turmeric hover:bg-turmeric/10 transition-colors"
                          >
                            {product.isAvailable ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button
                            onClick={() => setModal(product)}
                            title="Edit product"
                            className="p-2 rounded-sm text-ink/40 dark:text-text-dark/40 hover:text-cardamom hover:bg-cardamom/10 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setPendingDelete(product)}
                            title="Delete product"
                            className="p-2 rounded-sm text-ink/40 dark:text-text-dark/40 hover:text-chili hover:bg-chili/10 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}

      {pendingDelete && (
        <DeleteModal
          product={pendingDelete}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => {
            dispatch(deleteProduct(pendingDelete._id))
            setPendingDelete(null)
          }}
        />
      )}
    </>
  )
}