import { createProduct, getCategories, getProducts, updateProduct } from '@/js/api/products'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    loading: false,
    error: null,
  }),
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find((product) => product.id === parseInt(id))
    },

    getProductByCategory: (state) => (category) => {
      return state.products.filter((product) => product.category === category)
    },

    getLowStockProducts: (state) => {
      return state.products.filter((product) => product.stock < 10)
    },

    totalProducts: (state) => state.products.length,

    totalValue: (state) => {
      return state.products.reduce((total, product) => {
        return total + product.price * product.stock
      }, 0)
    },
  },
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const response = await getProducts()

        // ✅ Normalisasi: Pastikan products selalu array
        let productsData = []

        // Cek struktur response
        if (response?.data?.products) {
          // Jika response.data.products adalah array
          if (Array.isArray(response.data.products)) {
            productsData = response.data.products
          }
          // Jika response.data.products adalah object dengan data.products
          else if (response.data.products?.data?.products) {
            productsData = Array.isArray(response.data.products.data.products)
              ? response.data.products.data.products
              : []
          }
          // Jika response.data.products adalah object biasa
          else if (typeof response.data.products === 'object') {
            productsData = []
          }
        }
        // Jika response.data langsung array
        else if (Array.isArray(response.data)) {
          productsData = response.data
        }
        // Jika response langsung array
        else if (Array.isArray(response)) {
          productsData = response
        }

        this.products = productsData
        console.log('✅ Products loaded:', this.products.length)
      } catch (error) {
        console.error('Error fetching products:', error)
        this.error = error.message || 'Gagal mengambil data produk'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async addProduct(productData) {
      this.loading = true
      this.error = null

      try {
        const response = await createProduct(productData)
        const newProduct = response.data || response

        // ✅ Cek apakah products adalah array
        if (Array.isArray(this.products)) {
          this.products.push(newProduct)
        } else {
          // Kalo bukan array, buat array baru
          this.products = [newProduct]
        }

        return newProduct
      } catch (error) {
        console.error('Error creating product:', error)
        this.error = error.message || 'Gagal membuat produk'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await getCategories()
        this.categories = response.data?.categories || response || []
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    async updateProduct(productId, productData) {
      this.loading = true
      this.error = null

      try {
        const response = await updateProduct(productId, productData)
        const updatedProduct = response.data || response

        const index = this.products.findIndex((product) => product.id === parseInt(productId))
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        return updatedProduct
      } catch (error) {
        console.error('Error updating product:', error)
        this.error = error.message || 'Gagal memperbarui produk'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addCategory(categoryData) {
      try {
        const newCategory = {
          id: this.categories.length + 1,
          ...categoryData,
        }

        this.categories.push(newCategory)
        return newCategory
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
  },
})
