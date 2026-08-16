<template>
  <Layout pageTitle="Manage Warehouses">
    <main class="flex flex-col gap-6 flex-1">
      <section id="Products" class="flex flex-col gap-6 flex-1 rounded-3xl p-[18px] px-0 bg-white">
        <div id="Header" class="flex items-center justify-between px-[18px]">
          <div class="flex flex-col gap-[6px]">
            <p class="flex items-center gap-[6px]">
              <img
                src="/src/assets/images/icons/buildings-2-black.svg"
                class="size-6 flex shrink-0"
                alt="icon"
              />
              <span class="font-semibold text-2xl">{{ warehouses.length }} Total Warehouses</span>
            </p>
            <p class="font-semibold text-lg text-monday-gray">
              View and update your Warehouses list here.
            </p>
          </div>
          <router-link to="/add-warehouses" class="btn btn-primary font-semibold">
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
            <p class="font-semibold text-xl">All Warehouses</p>
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6 py-12"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="font-semibold text-monday-gray">Memuat data gudang...</p>
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
            <button @click="fetchWarehouses" class="btn btn-primary font-semibold">
              Coba Lagi
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="warehouses.length === 0"
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
            <template v-for="warehouse in paginatedWarehouses" :key="warehouse.id">
              <div class="card flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 w-[360px] shrink-0">
                  <div
                    class="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden"
                  >
                    <img
                      :src="warehouse.photo || '/src/assets/images/icons/gallery-grey.svg'"
                      class="size-full object-contain"
                      alt="icon"
                    />
                  </div>
                  <div class="flex flex-col gap-2 flex-1">
                    <p class="font-semibold text-xl">{{ warehouse.name }}</p>
                    <p class="flex items-center gap-1 font-medium text-lg text-monday-gray">
                      <span>{{ warehouse.phone || '-' }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 w-full justify-center">
                  <img
                    src="/src/assets/images/icons/bag-black.svg"
                    class="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <p class="font-semibold text-lg text-nowrap">
                    {{ warehouse.count_product || 0 }} Products
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <router-link
                    :to="`/detail-warehouses/${warehouse.id}`"
                    class="btn btn-primary-opacity min-w-[130px] font-semibold"
                  >
                    Details
                  </router-link>
                  <router-link
                    :to="`/edit-warehouses/${warehouse.id}`"
                    class="btn btn-black min-w-[130px] font-semibold"
                  >
                    <img
                      src="/src/assets/images/icons/edit-white.svg"
                      class="flex size-6 shrink-0"
                      alt="icon"
                    />
                    Edit
                  </router-link>
                </div>
              </div>
              <hr
                v-if="index < paginatedWarehouses.length - 1"
                class="border-monday-border last:hidden"
              />
            </template>
          </div>
        </div>

        <!-- ✅ PAGINATION - Client Side (Layout Sebelahan) -->
        <div
          v-if="warehouses.length > 0"
          class="flex items-center justify-between px-[18px] py-4 border-t border-monday-border"
        >
          <!-- KIRI: Showing + Dropdown (SEBELAHAN) -->
          <div class="flex items-center gap-4">
            <p class="font-medium text-monday-gray">
              Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ warehouses.length }} warehouses
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
import { getWarehouses } from '@/js/api/warehouse'

export default {
  name: 'ManageWarehouses',
  components: {
    Layout,
  },
  data() {
    return {
      warehouses: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 5,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.warehouses.length / this.itemsPerPage)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.warehouses.length)
    },
    paginatedWarehouses() {
      return this.warehouses.slice(this.startIndex, this.endIndex)
    },
  },
  async mounted() {
    await this.fetchWarehouses()
  },
  methods: {
    async fetchWarehouses() {
      this.loading = true
      this.error = null

      try {
        const response = await getWarehouses()
        const data = response.data?.warehouses || response.data || response || []
        this.warehouses = Array.isArray(data) ? data : []
        this.currentPage = 1
      } catch (error) {
        console.error('Error fetching warehouses:', error)
        this.error = error.message || 'Gagal mengambil data gudang'
        this.warehouses = []
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
  },
}
</script>
