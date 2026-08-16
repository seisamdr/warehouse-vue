<template>
  <Layout pageTitle="Manage Categories">
    <main class="flex flex-col gap-6 flex-1">
      <section id="Products" class="flex flex-col gap-6 flex-1 rounded-3xl p-[18px] px-0 bg-white">
        <div id="Header" class="flex items-center justify-between px-[18px]">
          <div class="flex flex-col gap-[6px]">
            <p class="flex items-center gap-[6px]">
              <img
                src="/src/assets/images/icons/note-2-black.svg"
                class="size-6 flex shrink-0"
                alt="icon"
              />
              <span class="font-semibold text-2xl">{{ categories.length }} Total Category</span>
            </p>
            <p class="font-semibold text-lg text-monday-gray">
              View and update your Category list here.
            </p>
          </div>
          <router-link to="/add-categories" class="btn btn-primary font-semibold">
            Add New
            <img
              src="/src/assets/images/icons/add-square-white.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </router-link>
        </div>
        <hr class="border-monday-border" />
        <div id="Product-List" class="flex flex-col px-4 gap-5 flex-1">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-xl">All Categories</p>
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6 py-12"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="font-semibold text-monday-gray">Memuat data kategori...</p>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-red-300 gap-6 py-12"
          >
            <img
              src="/src/assets/images/icons/close-circle-black.svg"
              class="size-[52px]"
              alt="icon"
            />
            <p class="font-semibold text-red-600">{{ error }}</p>
            <button @click="fetchCategories" class="btn btn-primary font-semibold">
              Coba Lagi
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="categories.length === 0"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6 py-12"
          >
            <img
              src="/src/assets/images/icons/document-text-grey.svg"
              class="size-[52px]"
              alt="icon"
            />
            <p class="font-semibold text-monday-gray">Oops, it looks like there's no data yet.</p>
          </div>

          <!-- Data List -->
          <div v-else class="flex flex-col gap-5">
            <template v-for="(category, index) in paginatedCategories" :key="category.id || index">
              <div class="card flex items-center justify-between gap-3">
                <div class="flex w-full items-center gap-3">
                  <div
                    class="flex size-16 rounded-full bg-monday-background items-center justify-center overflow-hidden shrink-0"
                  >
                    <img
                      :src="getCategoryIcon(category)"
                      class="size-[30px] object-contain"
                      alt="icon"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="flex flex-col gap-2 flex-1">
                    <p class="font-semibold text-xl w-[297px] truncate">
                      {{ category.name || 'Un-named Category' }}
                    </p>
                    <p class="font-semibold text-lg text-monday-gray">
                      {{ category.description || category.tagline || 'No description available' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 w-full">
                  <img
                    src="/src/assets/images/icons/bag-black.svg"
                    class="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <p class="font-semibold text-lg text-nowrap">
                    {{ formatNumber(category.count_product) }} Products
                  </p>
                  <div
                    :class="
                      getCategoryStatus(category).status === 'protected'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    "
                    class="flex items-center gap-1 px-2 py-1 rounded-full"
                  >
                    <img
                      :src="
                        getCategoryStatus(category).status === 'protected'
                          ? '/src/assets/images/icons/notification-black.svg'
                          : '/src/assets/images/icons/tick-square-blue.svg'
                      "
                      class="size-4"
                      alt="status"
                    />
                    <span class="text-xs font-medium">
                      {{
                        getCategoryStatus(category).status === 'protected' ? 'Protected' : 'Safe'
                      }}
                    </span>
                  </div>
                </div>

                <router-link
                  :to="`/edit-categories/${category.id}`"
                  class="btn btn-black min-w-[130px] font-semibold"
                >
                  Edit
                </router-link>
                <button
                  @click="deleteCategory(category.id, category.name)"
                  :disabled="!getCategoryStatus(category).canDelete"
                  :title="getCategoryStatus(category).message"
                  class="btn btn-red-opacity min-w-[130px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src="/src/assets/images/icons/trash-red.svg"
                    class="flex size-6 shrink-0"
                    alt="icon"
                  />
                  Delete
                </button>
              </div>
              <hr v-if="index < paginatedCategories.length - 1" class="border-monday-border" />
            </template>
          </div>
        </div>

        <!-- ✅ PAGINATION - Layout Sebelahan + Dropdown Limit -->
        <div
          v-if="categories.length > 0"
          class="flex items-center justify-between px-[18px] py-4 border-t border-monday-border"
        >
          <!-- KIRI: Showing + Dropdown (SEBELAHAN) -->
          <div class="flex items-center gap-4">
            <p class="font-medium text-monday-gray">
              Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ categories.length }} categories
            </p>
            <div class="flex items-center gap-2">
              <select
                v-model="itemsPerPage"
                @change="onLimitChange"
                class="px-3 py-2 rounded-xl border border-monday-border bg-white font-medium text-sm focus:outline-none focus:border-monday-blue cursor-pointer"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>

          <!-- KANAN: Pagination Buttons -->
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn btn-primary-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
            >
              Previous
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 rounded-2xl font-semibold transition-300',
                page === currentPage
                  ? 'bg-monday-blue text-white'
                  : 'bg-monday-gray-background text-monday-gray hover:bg-monday-border',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn btn-primary-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue'
import { deleteCategory, getCategories } from '@/js/api/products'

export default {
  name: 'ManageCategories',
  components: {
    Layout,
  },
  data() {
    return {
      categories: [],
      loading: false,
      error: null,
      defaultIcon: '/src/assets/images/icons/note-2-black.svg',
      currentPage: 1,
      itemsPerPage: 5,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.categories.length / this.itemsPerPage)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.categories.length)
    },
    paginatedCategories() {
      return this.categories.slice(this.startIndex, this.endIndex)
    },
  },
  async mounted() {
    await this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const response = await getCategories()
        const rawData = response.data?.categories || response.data || response || []

        this.categories = Array.isArray(rawData)
          ? rawData.map((item) => ({
              id: item.id || item.category_id,
              name: item.name || item.category_name || item.title || '',
              description: item.description || item.desc || item.tagline || '',
              count_product: Number(
                item.count_product ?? item.total_products ?? item.products_count ?? 0,
              ),
              photo: item.photo || item.icon || item.image || item.icon_url || null,
            }))
          : []

        this.currentPage = 1
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.error = error.message || 'Gagal mengambil data kategori'
        this.categories = []
      } finally {
        this.loading = false
      }
    },

    // ✅ Ketika limit berubah, reset ke halaman 1
    onLimitChange() {
      this.currentPage = 1
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    getCategoryIcon(category) {
      if (category.photo && typeof category.photo === 'string' && category.photo.trim() !== '') {
        return category.photo
      }
      return this.defaultIcon
    },

    handleImageError(event) {
      event.target.src = this.defaultIcon
    },

    formatNumber(num) {
      const parsedNumber = Number(num)
      if (isNaN(parsedNumber)) return '0'
      return new Intl.NumberFormat('en-US').format(parsedNumber)
    },

    getCategoryStatus(category) {
      const count = Number(category.count_product || 0)
      if (count > 0) {
        return {
          status: 'protected',
          message: `Protected - ${this.formatNumber(count)} products`,
          canDelete: false,
        }
      }
      return {
        status: 'deletable',
        message: 'No products - Safe to delete',
        canDelete: true,
      }
    },

    async deleteCategory(categoryId, categoryName) {
      const category = this.categories.find((cat) => cat.id === categoryId)
      if (category && Number(category.count_product) > 0) {
        alert(
          `Cannot delete category "${categoryName}" because it has ${this.formatNumber(
            category.count_product,
          )} products. Please remove all products first.`,
        )
        return
      }

      if (confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"?`)) {
        try {
          await deleteCategory(categoryId)
          this.categories = this.categories.filter((cat) => cat.id !== categoryId)
          alert(`Kategori "${categoryName}" berhasil dihapus!`)
        } catch (error) {
          console.error('Error deleting category:', error)
          alert(`Gagal menghapus kategori: ${error.message}`)
        }
      }
    },
  },
}
</script>
