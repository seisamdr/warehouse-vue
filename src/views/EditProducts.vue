<template>
  <Layout pageTitle="Edit Product" breadcrumb-text="Edit Product" breadcrumb-link="/products">
    <main class="flex flex-col gap-6 flex-1">
      <div class="flex gap-6">
        <form
          @submit.prevent="handleSubmit"
          class="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
        >
          <h2 class="font-semibold text-xl capitalize">Edit the form</h2>
          <div v-if="isLoadingProduct" class="flex items-center justify-center py-8">
            <div class="text-center">
              <img
                src="/src/assets/images/icons/loading.svg"
                class="h-8 w-8 mx-auto mb-4 text-blue-600"
                alt="loading"
              />
              <p class="text-gray-600">Memuat data produk...</p>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between w-full">
            <div
              class="group relative flex size-[100px] rounded-2xl overflow-hidden items-center justify-center bg-monday-background"
            >
              <img :src="currentImage" class="size-full object-cover" alt="icon" />
              <div
                v-if="imageUploading"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <div class="text-white text-center">
                  <div
                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"
                  ></div>
                  <p class="text-xs">Uploading...</p>
                </div>
              </div>

              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                id="File-Input"
                class="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div class="flex flex-col gap-2">
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="btn btn-black w-[152px] font-semibold text-nowrap"
              >
                {{ selectedFile ? 'Change Photo' : 'Add Photo' }}
              </button>
              <div v-if="imageUploading" class="w-[152px] bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>

              <button
                v-if="selectedFile"
                type="button"
                @click="removeImage"
                class="btn btn-red w-[152px] font-semibold text-nowrap text-sm"
              >
                Remove Photo
              </button>
            </div>

            <input
              ref="fileInput"
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
            />
          </div>
          <FormSelect
            v-model="form.popularity"
            label="Popularity"
            icon="/src/assets/images/icons/strongbox-grey.svg"
            required
          >
            <option :value="true">Popular</option>
            <option :value="false">Regular</option>
          </FormSelect>
          <FormInput
            v-model="form.name"
            label="Product Name"
            icon="/src/assets/images/icons/bag-grey.svg"
            required="true"
          />

          <FormInput
            v-model="form.barcode"
            label="Product Barcode"
            icon="/src/assets/images/icons/barcode-black.svg"
            required="true"
          />

          <FormInput
            v-model="form.price"
            label="Product Price"
            icon="/src/assets/images/icons/moneys-grey.svg"
            required="true"
            type="number"
          />
          <FormSelect
            v-model="form.category"
            label="Product Category"
            icon="/src/assets/images/icons/note-2-grey.svg"
            required
          >
            <option value="" disabled>Select Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </FormSelect>
          <FormTextarea
            v-model="form.description"
            label="Product About"
            icon="/src/assets/images/icons/note-2-grey.svg"
            required
            maxlength="1000"
            :show-counter="true"
          />
          <div class="flex items-center justify-end gap-4">
            <a href="/products" class="btn btn-red font-semibold"> Cancel </a>
            <button type="submit" class="btn btn-primary font-semibold">Save Changes</button>
          </div>
        </form>
        <div class="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
          <p class="font-semibold text-lg">Quick Guide to Edit Products</p>
          <ul class="flex flex-col gap-4">
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Update product photos if needed to keep the display fresh and appealing
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Ensure the product name is clear, relevant, and easy to recognize
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Verify the product category is correct for proper classification
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Replace images if they exceed 2MB to ensure smooth uploads
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Double-check all changes carefully before saving
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
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import { useProductStore } from '@/stores/products'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { uploadProductImage } from '@/js/api/products'

export default {
  name: 'EditProducts',
  components: {
    Layout,
    FormInput,
    FormSelect,
    FormTextarea,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()

    const form = ref({
      name: '',
      barcode: '',
      price: '',
      popularity: false,
      category: 0,
      description: '',
      image: '/src/assets/images/icons/gallery-default.svg',
    })

    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const imagePreview = ref(null)
    const selectedFile = ref(null)
    const uploadProgress = ref(0)
    const imageUploading = ref(false)
    const originalImage = ref(null)
    const isLoadingProduct = ref(false)
    const defaultImage = '/src/assets/images/icons/gallery-default.svg'

    const categories = computed(() => productStore.categories)

    const currentImage = computed(() => {
      return imagePreview.value || form.value.image || defaultImage
    })

    onMounted(async () => {
      try {
        await productStore.fetchCategories()
        await productStore.fetchProducts()
        await loadProduct()
      } catch (error) {
        console.error('Error fetching data:', error)
        error.value = error.message || 'Gagal mengambil data'
      }
    })
    const validateForm = () => {
      if (!form.value.name.trim()) {
        throw new Error('Nama produk harus diisi')
      }

      if (!form.value.category) {
        throw new Error('Kategori produk harus dipilih')
      }

      if (!form.value.price || form.value.price <= 0) {
        throw new Error('Harga produk harus lebih dari 0')
      }

      if (!form.value.description.trim()) {
        throw new Error('Deskripsi produk harus diisi')
      }

      return true
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        error.value = 'Ukuran file terlalu besar. Maksimal 2MB.'
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        error.value = 'File harus berupa gambar.'
        return
      }

      selectedFile.value = file
      error.value = ''

      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }

    const removeImage = () => {
      imagePreview.value = null
      selectedFile.value = null
      form.value.image = defaultImage
      error.value = ''
    }

    const uploadProductImageToServer = async () => {
      if (!selectedFile.value) {
        return form.value.image
      }

      imageUploading.value = true
      uploadProgress.value = 0

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          if (uploadProgress.value < 90) {
            uploadProgress.value += 10
          }
        }, 100)

        const response = await uploadProductImage(selectedFile.value)
        const imageUrl = response.data?.url || response.url

        clearInterval(progressInterval)
        uploadProgress.value = 100

        if (!imageUrl) {
          throw new Error('URL gambar tidak valid dari server')
        }

        return imageUrl
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        throw new Error(`Gagal mengupload gambar: ${uploadError.message}`)
      } finally {
        imageUploading.value = false
        uploadProgress.value = 0
      }
    }

    const loadProduct = async () => {
      const productId = route.params.id
      if (!productId) {
        router.push('/products')
        return
      }

      isLoadingProduct.value = true
      error.value = ''

      try {
        if (productStore.products.length === 0) {
          await productStore.fetchProducts()
        }

        const product = productStore.getProductById(productId)
        if (product) {
          Object.assign(form.value, {
            name: '',
            category: 0,
            price: '',
            popularity: false,
            description: '',
            image: defaultImage,
            barcode: '',
          })

          let categoryId = null
          if (product.category_id !== undefined && product.category_id !== null) {
            categoryId = parseInt(product.category_id)
          }

          Object.assign(form.value, {
            name: product.name || '',
            category: categoryId,
            price: product.price || '',
            popularity: product.is_popular !== undefined ? product.is_popular : false,
            description: product.about || product.description || '',
            image: product.thumbnail || product.image || defaultImage,
            barcode: product.barcode || '',
          })

          originalImage.value = product.thumbnail || product.image || defaultImage
          imagePreview.value = null
          selectedFile.value = null
        } else {
          console.log('Produk tidak ditemukan: ', productId)
          error.value = 'Produk tidak ditemukan'
        }
      } catch (error) {
        console.error('Error loading product:', error)
        error.value = error.message || 'Gagal memuat produk'
      } finally {
        isLoadingProduct.value = false
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      successMessage.value = ''

      try {
        console.log(form.value)
        validateForm()

        const imageUrl = await uploadProductImageToServer()
        form.value.image = imageUrl
        const productId = route.params.id

        let isPopular = false
        if (form.value.popularity === 'true') {
          isPopular = true
        }
        const productData = {
          name: form.value.name.trim(),
          category_id: parseInt(form.value.category),
          price: parseFloat(form.value.price),
          is_popular: isPopular,
          about: form.value.description.trim(),
          barcode: form.value.barcode.trim(),
          thumbnail: imageUrl,
        }
        await productStore.updateProduct(productId, productData)
        successMessage.value = 'Produk berhasil dibuat'
        setTimeout(() => {
          router.push('/products')
        }, 2000)
      } catch (submitError) {
        console.error('Error submitting form:', submitError)
        error.value = submitError.message || 'Gagal membuat produk'
      } finally {
        loading.value = false
      }
    }
    return {
      form,
      loading,
      error,
      successMessage,
      imagePreview,
      currentImage,
      categories,
      defaultImage,
      handleSubmit,
      handleImageUpload,
      removeImage,
      uploadProductImageToServer,
      loadProduct,
      validateForm,
      uploadProgress,
      imageUploading,
      originalImage,
      isLoadingProduct,
    }
  },
}
</script>
