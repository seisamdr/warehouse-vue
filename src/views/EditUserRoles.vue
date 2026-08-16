<template>
  <Layout pageTitle="Edit User Role" breadcrumb-text="Edit User Role" breadcrumb-link="/user-roles">
    <main class="flex flex-col gap-6 flex-1">
      <div class="flex gap-6">
        <form
          @submit.prevent="handleSubmit"
          class="flex flex-col w-full h-fit rounded-3xl p-[18px] gap-5 bg-white"
        >
          <h2 class="font-semibold text-xl capitalize">Complete the form</h2>
          <FormSelect
            v-model="formData.userId"
            label="Select User"
            icon="/src/assets/images/icons/profile-circle-grey.svg"
            required
            placeholderText="Choose a user"
          >
            <option v-for="user in availableUsers" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </FormSelect>
          <FormSelect
            v-model="formData.roleId"
            label="Select Role"
            icon="/src/assets/images/icons/profile-tick-grey.svg"
            required
            placeholderText="Choose a role"
          >
            <option v-for="role in availableRoles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </FormSelect>
          <div class="flex items-center justify-end gap-4">
            <router-link to="/user-roles" class="btn btn-red font-semibold"> Cancel </router-link>
            <button type="submit" class="btn btn-primary font-semibold" :disabled="isSubmitting">
              {{ isSubmitting ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>
        </form>
        <div class="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
          <p class="font-semibold text-lg">Quick Guide to Edit User Role</p>
          <ul class="flex flex-col gap-4">
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">Select a user from the available list</p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Choose the appropriate role based on job responsibilities
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Review user details and permissions before updating
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Double-check to avoid assigning incorrect roles
              </p>
            </li>
            <li class="flex gap-[6px]">
              <img
                src="/src/assets/images/icons/Checklist-green-circle.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
              <p class="font-medium leading-[140%]">
                Confirm the updated role is assigned to the right person
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
import FormSelect from '@/components/FormSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
// ✅ Import sudah bener
import { getUserRoleById, updateUserRole, getUsers, getRoles } from '@/js/api/users'

export default {
  name: 'EditUserRoles',
  components: {
    Layout,
    FormSelect,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const isSubmitting = ref(false)
    const userRoleId = ref(null)
    const availableUsers = ref([])
    const availableRoles = ref([])

    const formData = reactive({
      userId: '',
      roleId: '',
    })

    const errors = reactive({
      userId: '',
      roleId: '',
    })

    const validateForm = () => {
      errors.userId = ''
      errors.roleId = ''

      if (!formData.userId) {
        errors.userId = 'Please select a user'
      }

      if (!formData.roleId) {
        errors.roleId = 'Please select a role'
      }

      return !errors.userId && !errors.roleId
    }

    const fetchUsers = async () => {
      try {
        const response = await getUsers()
        availableUsers.value = response.data.data?.users || response.data.users || []
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }

    const fetchRoles = async () => {
      try {
        const response = await getRoles()
        availableRoles.value = response.data || []
      } catch (err) {
        console.error('Error fetching roles:', err)
      }
    }

    const loadCurrentAssignment = async () => {
      userRoleId.value = route.params.id

      if (!userRoleId.value) {
        alert('User role ID is required')
        router.push('/user-roles')
        return
      }

      try {
        const response = await getUserRoleById(userRoleId.value)
        const data = response.data.data || response.data
        formData.userId = data.user_id
        formData.roleId = data.role_id
      } catch (error) {
        console.error('Error loading user role:', error)
        alert('Error loading user role')
        router.push('/user-roles')
      }
    }

    onMounted(async () => {
      await Promise.all([fetchUsers(), fetchRoles()])
      await loadCurrentAssignment()
    })

    const handleSubmit = async () => {
      if (!validateForm()) {
        return
      }

      if (!userRoleId.value) {
        alert('User role ID is missing')
        return
      }

      isSubmitting.value = true

      try {
        await updateUserRole(userRoleId.value, {
          user_id: parseInt(formData.userId),
          role_id: parseInt(formData.roleId),
        })
        alert('User role updated successfully!')
        router.push('/user-roles')
      } catch (error) {
        console.error('Error updating user role:', error)
        alert('Failed to update user role')
      } finally {
        isSubmitting.value = false
      }
    }
    return {
      formData,
      errors,
      isSubmitting,
      userRoleId,
      availableUsers,
      availableRoles,
      handleSubmit,
    }
  },
}
</script>
