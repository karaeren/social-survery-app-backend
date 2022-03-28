<template>
  <div class="main centered-main">
    <el-scrollbar class="scrollbar-box">
      <el-form :model="form" label-position="left">
        <el-form-item label="Name" label-width="140px">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Color" label-width="140px">
          <el-input v-model="form.color" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Rank" label-width="140px">
          <el-input v-model="form.rank" autocomplete="off" />
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="createCategoryButton">
        Create Category
      </el-button>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useAccountStore } from '@/stores/account';
import { useSurveyApi } from '@/composables/api/survey';

import { ElMessageBox } from 'element-plus';

const accountStore = useAccountStore(); // account store
const { getCategories, createCategory } = useSurveyApi(); // survey api

const router = useRouter();

const categoryData = ref([]);

const form = reactive({
  name: '',
  color: '',
  rank: '0',
});

onMounted(async () => {
  if (!accountStore.access.token) return;
  await updateCategoryList();
});

async function updateCategoryList() {
  try {
    categoryData.value = await getCategories(accountStore.access.token);
  } catch (e) {
    console.error(e);
    return ElMessageBox.alert(
      'An unknown error happened while trying to retrieve categories...',
      'Error',
      {
        confirmButtonText: 'OK',
      }
    );
  }
}

async function createCategoryButton() {
  try {
    await createCategory(accountStore.access.token, form);
  } catch (e) {
    console.error(e);
    let errorText =
      'An unknown error happened while trying to create the category...';
    if (e.response && e.response.data.message)
      errorText = e.response.data.message;

    return ElMessageBox.alert(errorText, 'Error', {
      confirmButtonText: 'OK',
    });
  }

  ElMessageBox.alert('Category created successfully.', 'Success!', {
    confirmButtonText: 'OK',
    callback: () => {
      router.push('list-categories');
    },
  });
}
</script>
