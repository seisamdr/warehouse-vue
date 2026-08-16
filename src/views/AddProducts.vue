<template>
  <Layout pageTitle="Add New Product" breadcrumb-text="Add New Product" breadcrumb-link="/products">
    <main class="flex flex-col gap-6 flex-1">
      <div class="flex gap-6">
        <form
          @submit.prevent="handleSubmit"
          class="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
        >
          <h2 class="font-semibold text-xl capitalize">Complete the form</h2>

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
              <img :src="currentImage" class="size-full object-cover" alt="product image" />
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
                class="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div class="flex flex-col gap-2">
              <button
                type="button"
                @click="$refs.fileInput.click()"
                class="btn btn-black w-[152px] font-semibold text-nowrap"
              >
                Add Photo
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
            maxlength="100"
          />

          <FormInput
            v-model="form.barcode"
            label="Product Barcode"
            icon="/src/assets/images/icons/barcode-black.svg"
            required="true"
            maxlength="50"
          />

          <FormInput
            v-model="form.price"
            label="Product Price"
            icon="/src/assets/images/icons/moneys-grey.svg"
            required="true"
            type="number"
            min="0"
            step="1000"
          />

          <FormSelect
            v-model="form.category"
            label="Product Category"
            icon="/src/assets/images/icons/note-2-grey.svg"
            required
          >
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
            <router-link to="/products" class="btn btn-red font-semibold"> Cancel </router-link>
            <button
              :disabled="loading || imageUploading || !selectedFile"
              type="submit"
              class="btn btn-primary font-semibold"
            >
              Create Now
            </button>
          </div>
        </form>
        <div class="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
          <p class="font-semibold text-lg">Quick Guide to Adding Products</p>
          <ul class="flex flex-col gap-4">
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Use clear and high-quality photos to make the product more appealing
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Ensure the product name is relevant, descriptive, and easy to recognize
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Choose the correct product category to ensure accurate classification
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Keep image size under 2MB to ensure smooth and fast uploads
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Review all product details carefully before publishing
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
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { computed, onMounted, ref } from 'vue'
import { uploadProductImage } from '@/js/api/products'

export default {
  name: 'AddProducts',
  components: {
    Layout,
    FormInput,
    FormSelect,
    FormTextarea,
  },
  setup() {
    const productStore = useProductStore()
    const router = useRouter()

    const form = ref({
      name: '',
      barcode: '',
      price: '',
      popularity: false,
      category: '',
      description: '',
      image: '/src/assets/images/icons/gallery-default.svg',
    })

    const loading = ref(false)
    const imageUploading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const imagePreview = ref(null)
    const selectedFile = ref(null)
    const uploadProgress = ref(0)

    const defaultImage = '/src/assets/images/icons/gallery-default.svg'

    const categories = computed(() => productStore.categories)

    const currentImage = computed(() => {
      return imagePreview.value || defaultImage
    })

    onMounted(async () => {
      try {
        await Promise.all([
          await productStore.fetchCategories(),
          await productStore.fetchProducts(),
        ])
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

      if (!selectedFile.value) {
        throw new Error('Gambar produk harus dipilih')
      }

      // Validate barcode format if provided (optional field)
      if (form.value.barcode.trim() && !/^[0-9A-Za-z\-]+$/.test(form.value.barcode.trim())) {
        throw new Error('Barcode hanya boleh berisi angka, huruf, dan tanda hubung')
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
        throw new Error('Tidak ada gambar yang dipilih')
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

    const handleSubmit = async () => {
      loading.value = true
      error.value = ''
      successMessage.value = ''

      try {
        validateForm()

        const imageUrl = await uploadProductImageToServer()
        form.value.image = imageUrl

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
        await productStore.addProduct(productData)
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
      imageUploading,
      error,
      successMessage,
      imagePreview,
      currentImage,
      categories,
      defaultImage,
      selectedFile,
      uploadProgress,
      handleImageUpload,
      removeImage,
      uploadProductImageToServer,
      handleSubmit,
    }
  },
}
</script>
