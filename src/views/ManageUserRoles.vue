<template>
  <Layout pageTitle="Manage User Roles">
    <main class="flex flex-col gap-6 flex-1">
      <section id="Products" class="flex flex-col gap-6 flex-1 rounded-3xl p-[18px] px-0 bg-white">
        <div id="Header" class="flex items-center justify-between px-[18px]">
          <div class="flex flex-col gap-[6px]">
            <p class="flex items-center gap-[6px]">
              <img
                src="/src/assets/images/icons/profile-2user-black.svg"
                class="size-6 flex shrink-0"
                alt="icon"
              />
              <span class="font-semibold text-2xl">{{ totalRecords }} Total Users</span>
            </p>
            <p class="font-semibold text-lg text-monday-gray">
              View and update Total User list here.
            </p>
          </div>
          <router-link to="/add-user-roles" class="btn btn-primary font-semibold">
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
            <p class="font-semibold text-xl">All Users</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <img
              src="/src/assets/images/icons/loading.svg"
              class="size-12 animate-spin"
              alt="loading"
            />
            <p class="font-medium text-monday-gray mt-4">Loading user roles data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
            <img
              src="/src/assets/images/icons/document-text-grey.svg"
              class="size-[52px]"
              alt="error"
            />
            <p class="font-semibold text-red-500 mt-4">{{ error }}</p>
            <button @click="fetchUserRoles()" class="btn btn-primary mt-4">Try Again</button>
          </div>

          <!-- Data List -->
          <div v-else-if="userRoles.length > 0" class="flex flex-col gap-5">
            <template v-for="(userRole, index) in userRoles" :key="userRole.id">
              <div class="card flex items-center justify-between gap-6">
                <div class="flex items-center gap-3">
                  <div
                    class="flex size-[76px] rounded-full bg-monday-background items-center justify-center overflow-hidden"
                  >
                    <img
                      :src="userRole.user?.photo || '/src/assets/images/photos/photos-2.png'"
                      class="size-full object-cover"
                      alt="icon"
                    />
                  </div>
                  <div class="flex flex-col gap-2 flex-1">
                    <p class="font-semibold text-xl">{{ userRole.user?.name || 'Unknown' }}</p>
                    <p class="flex items-center gap-1 font-medium text-lg text-monday-gray">
                      <img
                        src="/src/assets/images/icons/call-grey.svg"
                        class="size-6 flex shrink-0"
                        alt="icon"
                      />
                      <span>{{ userRole.user?.phone || '-' }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3 w-[226px] shrink-0">
                  <div
                    class="flex size-[54px] rounded-2xl bg-monday-gray-background items-center justify-center"
                  >
                    <img
                      src="/src/assets/images/icons/user-octagon-grey.svg"
                      class="flex size-6 shrink-0"
                      alt="icon"
                    />
                  </div>
                  <div class="flex flex-col gap-1">
                    <p class="font-medium text-sm text-monday-gray">User Role:</p>
                    <p class="font-semibold text-lg text-nowrap">
                      {{ userRole.role?.name || 'No Role' }}
                    </p>
                  </div>
                </div>
                <router-link
                  :to="`/edit-user-roles/${userRole.id}`"
                  class="btn btn-black min-w-[130px] font-semibold"
                >
                  Edit Role
                </router-link>
              </div>
              <hr v-if="index < userRoles.length - 1" class="border-monday-border last:hidden" />
            </template>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6 py-12"
          >
            <img
              src="/src/assets/images/icons/document-text-grey.svg"
              class="size-[52px]"
              alt="icon"
            />
            <p class="font-semibold text-monday-gray">Oops, it looks like there's no data yet.</p>
          </div>
        </div>

        <!-- ✅ PAGINATION - Layout Sebelahan + Dropdown Limit -->
        <div
          v-if="userRoles.length > 0"
          class="flex items-center justify-between px-[18px] py-4 border-t border-monday-border"
        >
          <!-- KIRI: Showing + Dropdown (SEBELAHAN) -->
          <div class="flex items-center gap-4">
            <p class="font-medium text-monday-gray">
              Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ totalRecords }} users
            </p>
            <div class="flex items-center gap-2">
              <select
                v-model="limit"
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
              @click="goToPage(currentPage - 1)"
              :disabled="!hasPrev"
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
              @click="goToPage(currentPage + 1)"
              :disabled="!hasNext"
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
import { getUserRoles } from '@/js/api/users'
import { computed, onMounted, ref, watch } from 'vue'

export default {
  name: 'ManageUserRoles',
  components: {
    Layout,
  },
  setup() {
    const userRoles = ref([])
    const loading = ref(false)
    const error = ref(null)

    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalRecords = ref(0)
    const limit = ref(5)
    const hasNext = ref(false)
    const hasPrev = ref(false)

    const startIndex = computed(() => {
      return (currentPage.value - 1) * limit.value
    })

    const endIndex = computed(() => {
      return Math.min(startIndex.value + limit.value, totalRecords.value)
    })

    const fetchUserRoles = async (page = 1) => {
      loading.value = true
      error.value = null

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.value.toString(),
        })

        const response = await getUserRoles(`?${params.toString()}`)

        const data = response.data?.data || response.data || response
        userRoles.value = data.user_roles || []

        if (data.pagination) {
          currentPage.value = data.pagination.current_page
          totalPages.value = data.pagination.total_pages
          totalRecords.value = data.pagination.total_records
          limit.value = data.pagination.limit || limit.value
          hasNext.value = data.pagination.has_next
          hasPrev.value = data.pagination.has_prev
        }

        console.log('✅ User Roles loaded:', userRoles.value.length)
        console.log('✅ Total Pages:', totalPages.value)
        console.log('✅ Total Records:', totalRecords.value)
        console.log('✅ Limit:', limit.value)
      } catch (error) {
        console.error('Error fetching user roles:', error)
        error.value = error.message || 'Failed to fetch user roles'
        userRoles.value = []
      } finally {
        loading.value = false
      }
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchUserRoles(page)
      }
    }

    // ✅ Ketika limit berubah, reset ke halaman 1
    const onLimitChange = () => {
      currentPage.value = 1
      fetchUserRoles(1)
    }

    onMounted(() => {
      fetchUserRoles()
    })

    return {
      userRoles,
      loading,
      error,
      currentPage,
      totalPages,
      totalRecords,
      limit,
      hasNext,
      hasPrev,
      goToPage,
      startIndex,
      endIndex,
      onLimitChange,
    }
  },
}
</script>
