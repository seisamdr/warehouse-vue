<template>
  <Layout
    pageTitle="Assign Merchants Products"
    breadcrumb-text="Assign Merchants Products"
    :breadcrumb-link="`/detail-merchants/${$route.params.id}`"
  >
    <main class="flex flex-col gap-6 flex-1">
      <div class="flex gap-6">
        <div class="flex flex-col gap-6 w-full">
          <!-- Loading State for Merchant Details -->
          <div
            v-if="isLoadingMerchant"
            class="flex flex-col items-center justify-center rounded-3xl p-[18px] gap-6 bg-white"
          >
            <img
              src="/src/assets/images/icons/loading.svg"
              class="size-[52px] animate-spin"
              alt="loading"
            />
            <p class="font-semibold text-monday-gray">Loading merchant details...</p>
          </div>

          <div v-else class="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
            <p class="font-semibold text-xl">Merchant Details</p>
            <div class="flex items-center gap-3">
              <div
                class="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden"
              >
                <img
                  :src="merchantDetails.photo || '/src/assets/images/thumbnails/merchant-1.png'"
                  class="size-full object-cover"
                  alt="icon"
                />
              </div>
              <div class="flex flex-col gap-2 flex-1">
                <p class="font-semibold text-lg">{{ merchantDetails.name }}</p>
                <p class="flex items-center gap-1 font-medium text-lg text-monday-gray">
                  <img
                    src="/src/assets/images/icons/user-thin-grey.svg"
                    class="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <span>{{ merchantDetails.keeper }}</span>
                </p>
              </div>
            </div>
          </div>

          <form
            @submit.prevent="handleSubmit"
            class="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
          >
            <h2 class="font-semibold text-xl capitalize">Complete the form</h2>

            <!-- ✅ GANTI pake FormSelect Component -->
            <FormSelect
              v-model="formData.productId"
              label="Product"
              icon="/src/assets/images/icons/bag-grey.svg"
              required
              :disabled="isLoadingProducts"
              placeholderText="Select Product"
            >
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </FormSelect>

            <FormSelect
              v-model="formData.warehouseId"
              label="Warehouse"
              icon="/src/assets/images/icons/buildings-2-grey.svg"
              required
              :disabled="isLoadingWarehouses || !formData.productId"
              :placeholderText="!formData.productId ? 'Select Product First' : 'Select Warehouse'"
            >
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </FormSelect>

            <FormInput
              v-model="formData.stock"
              label="Stock"
              icon="/src/assets/images/icons/box-grey.svg"
              type="number"
              min="0"
              step="1"
              required
            />

            <div class="flex items-center justify-end gap-4">
              <router-link
                :to="`/detail-merchants/${$route.params.id}`"
                class="btn btn-red font-semibold"
              >
                Cancel
              </router-link>
              <button type="submit" class="btn btn-primary font-semibold" :disabled="isLoading">
                {{ isLoading ? 'Assigning...' : 'Assign Now' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Guide -->
        <div class="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
          <p class="font-semibold text-lg">Quick Guide to Assign New Product</p>
          <ul class="flex flex-col gap-4">
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Verify and confirm merchant information to ensure accuracy
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Double-check all details for accuracy before proceeding
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Enter the stock quantity correctly to maintain precise inventory records
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Review warehouse and product details carefully to ensure everything is correct
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Click "Assign Now" to finalize the assignment process
              </p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </Layout>
</template>
<script>
import Layout from '@/components/Layout.vue'
import { assignProductToMerchant, getMerchantById } from '@/js/api/merchants'
import { getProducts } from '@/js/api/products'
import { getWarehousesForProduct } from '@/js/api/warehouse'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'

export default {
  name: 'AssignMerchantsProducts',
  components: {
    Layout,
    FormInput,
    FormSelect,
  },
  data() {
    return {
      merchantDetails: {
        name: '',
        keeper: '',
        photo: '',
      },
      formData: {
        warehouseId: '',
        productId: '',
        stock: '',
      },
      warehouses: [],
      products: [],
      isLoading: false,
      isLoadingMerchant: false,
      isLoadingProducts: false,
      isLoadingWarehouses: false,
    }
  },
  async created() {
    await this.loadMerchantDetails()
    await this.loadProducts()
  },

  methods: {
    async loadMerchantDetails() {
      const merchantId = this.$route.params.id

      if (!merchantId) {
        console.error('No merchant ID provided')
        this.$router.push('/merchants')
        return
      }

      this.isLoadingMerchant = true

      try {
        const response = await getMerchantById(merchantId)
        const merchantData = response.data

        this.merchantDetails = {
          name: merchantData.name || '',
          keeper: merchantData.keeper_name || 'Keeper tidak ditemukan',
          photo: merchantData.photo || '',
        }
      } catch (error) {
        console.error('Error loading merchant details:', error)
        this.$router.push('/merchants')
      } finally {
        this.isLoadingMerchant = false
      }
    },

    async loadProducts() {
      this.isLoadingProducts = true

      try {
        const response = await getProducts()
        this.products = response.data?.products || response.data || []
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
      } finally {
        this.isLoadingProducts = false
      }
    },

    async loadWarehouseByProductId(productId) {
      if (!productId) {
        this.warehouses = []
        return
      }

      this.isLoadingWarehouses = true
      try {
        const response = await getWarehousesForProduct(productId)
        this.warehouses = response.data || []
      } catch (error) {
        console.error('Error loading warehouses:', error)
        this.warehouses = []
      } finally {
        this.isLoadingWarehouses = false
      }
    },

    async handleSubmit() {
      if (!this.formData.productId || !this.formData.warehouseId || !this.formData.stock) {
        alert('Mohon lengkapi semua data!')
        return
      }

      if (this.formData.stock <= 0) {
        alert('Stock harus lebih dari 0')
        return
      }

      this.isLoading = true

      const merchantId = this.$route.params.id
      try {
        // ✅ Parse semua ke number!
        const requestData = {
          product_id: parseInt(this.formData.productId),
          warehouse_id: parseInt(this.formData.warehouseId),
          stock: parseInt(this.formData.stock),
          merchant_id: parseInt(merchantId),
        }

        console.log('📦 Request Data:', requestData)

        await assignProductToMerchant(requestData)
        alert('Produk berhasil ditugaskan ke merchant!')
        this.$router.push(`/detail-merchants/${merchantId}`)
      } catch (error) {
        console.error('Error assigning product to merchant:', error)
        alert(`Gagal menugaskan produk: ${error.message}`)
      } finally {
        this.isLoading = false
      }
    },
  },
  watch: {
    'formData.productId': {
      handler(newProductId) {
        if (newProductId) {
          this.loadWarehouseByProductId(newProductId)
          this.formData.warehouseId = ''
        } else {
          this.warehouses = []
          this.formData.warehouseId = ''
        }
      },
      immediate: false,
    },
  },
}
</script>
