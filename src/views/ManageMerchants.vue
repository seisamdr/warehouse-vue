<template>
  <Layout pageTitle="Manage Merchants">
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
              <span class="font-semibold text-2xl"
                >{{ pagination.total_records }} Total Merchants</span
              >
            </p>
            <p class="font-semibold text-lg text-monday-gray">
              View and update your Merchants list here.
            </p>
          </div>
          <router-link to="/add-merchants" class="btn btn-primary font-semibold">
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
            <p class="font-semibold text-xl">All Merchants</p>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6"
          >
            <img
              src="/src/assets/images/icons/loading.svg"
              class="size-[52px] animate-spin"
              alt="loading"
            />
            <p class="font-semibold text-monday-gray">Loading merchants...</p>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-red-300 gap-6"
          >
            <img
              src="/src/assets/images/icons/close-circle-black.svg"
              class="size-[52px]"
              alt="icon"
            />
            <p class="font-semibold text-red-600">{{ error }}</p>
            <button @click="fetchMerchants" class="btn btn-primary font-semibold">Coba Lagi</button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="merchants.length === 0"
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6"
          >
            <img
              src="/src/assets/images/icons/document-text-grey.svg"
              class="size-[52px]"
              alt="icon"
            />
            <p class="font-semibold text-monday-gray">Oops, it looks like there's no data yet.</p>
          </div>

          <!-- Merchants List -->
          <div v-else class="flex flex-col gap-5">
            <template v-for="(merchant, index) in merchants" :key="merchant.id">
              <div class="card flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 w-[326px] shrink-0">
                  <div
                    class="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden"
                  >
                    <img
                      :src="merchant.photo || '/src/assets/images/icons/gallery-grey.svg'"
                      class="size-full object-contain"
                      alt="icon"
                    />
                  </div>
                  <div class="flex flex-col gap-2 flex-1">
                    <p class="font-semibold text-xl w-[228px] truncate">{{ merchant.name }}</p>
                    <p class="flex items-center gap-1 font-medium text-lg text-monday-gray">
                      <img
                        src="/src/assets/images/icons/user-thin-grey.svg"
                        class="size-6 flex shrink-0"
                        alt="icon"
                      />
                      <span>{{ merchant.keeper_name || '-' }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 min-w-[266px]">
                  <img
                    src="/src/assets/images/icons/bag-black.svg"
                    class="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <p class="font-semibold text-lg text-nowrap">
                    {{ merchant.product_count || 0 }} Products
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <router-link
                    :to="`/detail-merchants/${merchant.id}`"
                    class="btn btn-primary-opacity min-w-[130px] font-semibold"
                  >
                    Details
                  </router-link>
                  <router-link
                    :to="`/edit-merchants/${merchant.id}`"
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
              <hr v-if="index < merchants.length - 1" class="border-monday-border last:hidden" />
            </template>
          </div>
        </div>

        <!-- ✅ PAGINATION - Layout Sebelahan -->
        <div
          v-if="merchants.length > 0"
          class="flex items-center justify-between px-[18px] py-4 border-t border-monday-border"
        >
          <!-- KIRI: Showing + Dropdown -->
          <div class="flex items-center gap-4">
            <p class="font-medium text-monday-gray">
              Showing {{ startIndex + 1 }}-{{ endIndex }} of
              {{ pagination.total_records }} merchants
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
              :disabled="!pagination.has_prev"
              class="btn btn-primary-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
            >
              Previous
            </button>
            <button
              v-for="page in pagination.total_pages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 rounded-2xl font-semibold transition-300',
                page === pagination.current_page
                  ? 'bg-monday-blue text-white'
                  : 'bg-monday-gray-background text-monday-gray hover:bg-monday-border',
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="nextPage"
              :disabled="!pagination.has_next"
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
import { getMerchants } from '@/js/api/merchants'

export default {
  name: 'ManageMerchants',
  components: {
    Layout,
  },
  data() {
    return {
      merchants: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 5,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        limit: 10,
        has_next: false,
        has_prev: false,
      },
    }
  },
  computed: {
    startIndex() {
      return (this.pagination.current_page - 1) * this.itemsPerPage
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.pagination.total_records)
    },
  },
  async created() {
    await this.fetchMerchants()
  },
  methods: {
    async fetchMerchants() {
      this.isLoading = true
      this.error = null

      try {
        const response = await getMerchants(
          '?page=' + this.currentPage + '&limit=' + this.itemsPerPage,
        )

        const data = response.data?.data || response.data || response
        this.merchants = data.merchants || data || []

        if (data.pagination) {
          this.pagination = data.pagination
          this.itemsPerPage = data.pagination.limit || this.itemsPerPage
        }

        // ✅ FIX: Kalo total_records = 0 tapi merchants ada, pake merchants.length
        if (this.pagination.total_records === 0 && this.merchants.length > 0) {
          this.pagination.total_records = this.merchants.length
          this.pagination.total_pages = Math.ceil(this.merchants.length / this.itemsPerPage)
          this.pagination.has_next = this.currentPage < this.pagination.total_pages
          this.pagination.has_prev = this.currentPage > 1
        }

        this.currentPage = this.pagination.current_page || 1

        console.log('✅ Merchants loaded:', this.merchants.length)
        console.log('✅ Total Records:', this.pagination.total_records)
        console.log('✅ Total Pages:', this.pagination.total_pages)
      } catch (error) {
        console.error('Error fetching merchants:', error)
        this.error = error.message || 'Gagal mengambil data merchant'
        this.merchants = []
      } finally {
        this.isLoading = false
      }
    },

    onLimitChange() {
      this.currentPage = 1
      this.fetchMerchants()
    },

    goToPage(page) {
      if (page === this.currentPage) return
      this.currentPage = page
      this.fetchMerchants()
    },

    nextPage() {
      if (this.pagination.has_next) {
        this.currentPage++
        this.fetchMerchants()
      }
    },

    previousPage() {
      if (this.pagination.has_prev) {
        this.currentPage--
        this.fetchMerchants()
      }
    },
  },
}
</script>
