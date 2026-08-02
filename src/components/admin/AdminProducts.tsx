import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { formatPrice, type ProductRow } from '../../data/products'
import { Button } from '../Button'
import { Modal } from './Modal'
import { useToast } from './toast-context'
import {
  ADMIN_CATEGORY_OPTIONS,
  categoryOptionLabel,
  categoryOptionValue,
  formatDate,
  PRODUCT_FILES_BUCKET,
} from './utils'

const MAX_PDF_MB = 25

type ProductForm = {
  title: string
  description: string
  price: string
  category: string
}

const EMPTY_FORM: ProductForm = {
  title: '',
  description: '',
  price: '',
  category: '',
}

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; product: ProductRow }

async function uploadPdf(file: File): Promise<string> {
  const ext =
    (file.name.split('.').pop() ?? 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '') ||
    'pdf'
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  const { error } = await supabase.storage
    .from(PRODUCT_FILES_BUCKET)
    .upload(filePath, file)

  if (error) {
    throw new Error(
      /bucket|row-level|not found|denied/i.test(error.message)
        ? 'PDF uploads are not set up yet. Create the "product-files" public storage bucket and its policies in Supabase, then try again.'
        : error.message,
    )
  }

  const { data } = supabase.storage
    .from(PRODUCT_FILES_BUCKET)
    .getPublicUrl(filePath)
  return data.publicUrl
}

export function AdminProducts() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const { data, error: loadError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<ProductRow[]>()
      if (cancelled) return
      if (loadError) {
        setError(loadError.message)
        setLoading(false)
        return
      }
      setProducts(data ?? [])
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setPdfFile(null)
    setFormError(null)
    setModal({ mode: 'add' })
  }

  const openEdit = (product: ProductRow) => {
    setForm({
      title: product.title,
      description: product.description ?? '',
      price: String(Number(product.price) || 0),
      category: categoryOptionValue(product.categories),
    })
    setPdfFile(null)
    setFormError(null)
    setModal({ mode: 'edit', product })
  }

  const closeModal = () => {
    setModal({ mode: 'closed' })
    setFormError(null)
    setPdfFile(null)
  }

  const updateForm = (field: keyof ProductForm) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((f) => ({ ...f, [field]: event.target.value }))
    setFormError(null)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.type !== 'application/pdf') {
      setFormError('Please choose a PDF file.')
      return
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setFormError(`PDF must be ${MAX_PDF_MB}MB or smaller.`)
      return
    }
    setPdfFile(file)
    setFormError(null)
  }

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Please enter a product title.'
    if (!form.category) return 'Please select a category.'
    if (
      form.price === '' ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      return 'Please enter a valid price.'
    }
    if (modal.mode === 'add' && !pdfFile) {
      return 'Please upload a PDF file for the product.'
    }
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setFormError(validationError)
      return
    }
    if (modal.mode === 'closed') return

    setSaving(true)
    setFormError(null)

    try {
      const base = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        categories: form.category,
      }

      if (modal.mode === 'edit') {
        let pdfUrl: string | undefined
        if (pdfFile) pdfUrl = await uploadPdf(pdfFile)
        const payload: Record<string, unknown> = { ...base }
        if (pdfUrl) payload['pdf-url'] = pdfUrl

        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', modal.product.id)
        if (updateError) throw new Error(updateError.message)
        toast('success', 'Product updated.')
      } else {
        if (!pdfFile) throw new Error('Please upload a PDF file for the product.')
        const pdfUrl = await uploadPdf(pdfFile)
        const { error: insertError } = await supabase.from('products').insert({
          ...base,
          'pdf-url': pdfUrl,
        })
        if (insertError) throw new Error(insertError.message)
        toast('success', 'Product added.')
      }

      setModal({ mode: 'closed' })
      setPdfFile(null)
      setReloadKey((key) => key + 1)
    } catch (err) {
      toast(
        'error',
        err instanceof Error ? err.message : 'Something went wrong.',
      )
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      const pdfUrl = deleteTarget['pdf-url']
      if (pdfUrl) {
        try {
          const path = new URL(pdfUrl).pathname.split(
            `/object/public/${PRODUCT_FILES_BUCKET}/`,
          )[1]
          if (path) {
            await supabase.storage
              .from(PRODUCT_FILES_BUCKET)
              .remove([decodeURIComponent(path)])
          }
        } catch {
          // Ignore storage cleanup failures — the row delete below still runs.
        }
      }

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteTarget.id)
      if (deleteError) throw new Error(deleteError.message)

      toast('success', 'Product deleted.')
      setDeleteTarget(null)
      setReloadKey((key) => key + 1)
    } catch (err) {
      toast(
        'error',
        err instanceof Error ? err.message : 'Could not delete the product.',
      )
    } finally {
      setDeleting(false)
    }
  }

  const editingProduct = modal.mode === 'edit' ? modal.product : null
  const isAdd = modal.mode === 'add'
  const currentPdfUrl = editingProduct?.['pdf-url']

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, and remove store products. PDFs upload automatically.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add New Product
        </Button>
      </div>

      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span
              role="status"
              aria-label="Loading products"
              className="spinner"
            />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-sm font-semibold text-gray-900">
              Couldn&apos;t load products
            </p>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-6"
            >
              Try again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-gray-900">
              No products yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first product to get started.
            </p>
            <Button onClick={openAdd} className="mt-6">
              <Plus className="size-4" />
              Add New Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={String(product.id)}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="max-w-56 truncate px-5 py-4 font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {categoryOptionLabel(product.categories)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.title}`}
                          className="grid size-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          aria-label={`Delete ${product.title}`}
                          className="grid size-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modal.mode !== 'closed'}
        onClose={closeModal}
        title={isAdd ? 'Add new product' : 'Edit product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {formError}
            </p>
          ) : null}

          <div>
            <label
              htmlFor="admin-product-title"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="admin-product-title"
              className="input"
              value={form.title}
              onChange={updateForm('title')}
              placeholder="The Complete HR Contact List"
            />
          </div>

          <div>
            <label
              htmlFor="admin-product-description"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="admin-product-description"
              className="input resize-none"
              rows={4}
              value={form.description}
              onChange={updateForm('description')}
              placeholder="Short description shown on the product page"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin-product-price"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Price (₹)
              </label>
              <input
                id="admin-product-price"
                type="number"
                min="0"
                step="1"
                className="input"
                value={form.price}
                onChange={updateForm('price')}
                placeholder="49"
              />
            </div>
            <div>
              <label
                htmlFor="admin-product-category"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="admin-product-category"
                className="input"
                value={form.category}
                onChange={updateForm('category')}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {ADMIN_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              PDF file
            </label>
            {currentPdfUrl ? (
              <div className="mb-2 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm">
                <FileText className="size-4 shrink-0 text-gray-400" />
                <span className="min-w-0 flex-1 truncate text-gray-600">
                  {decodeURIComponent(currentPdfUrl.split('/').pop() ?? '')}
                </span>
                <a
                  href={currentPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
                >
                  View
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => handleFileChange(event)}
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                {pdfFile ? (
                  <FileText className="size-4" />
                ) : (
                  <Upload className="size-4" />
                )}
                {pdfFile
                  ? 'Replace PDF'
                  : currentPdfUrl
                    ? 'Upload new PDF'
                    : 'Choose PDF'}
              </Button>
              {pdfFile ? (
                <span className="min-w-0 truncate text-sm text-gray-500">
                  {pdfFile.name}
                </span>
              ) : null}
            </div>
            {isAdd ? (
              <p className="mt-2 text-xs text-gray-400">
                Uploaded to the &quot;product-files&quot; storage bucket and
                saved as the product&apos;s download URL automatically.
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {isAdd ? 'Add product' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete product"
      >
        <p className="text-sm leading-relaxed text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">
            {deleteTarget?.title}
          </span>
          ? This removes it from the store, and its PDF file will also be
          deleted from storage. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => void confirmDelete()}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete product
          </Button>
        </div>
      </Modal>
    </div>
  )
}
