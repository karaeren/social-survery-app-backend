<template>
  <div class="main centered-main">
    <el-table
      :data="filteredCategoryData"
      :default-sort="{ prop: 'rank' }"
      height="100vh"
      style="width: 100%"
    >
      <el-table-column fixed prop="rank" label="Rank" sortable width="90" />
      <el-table-column prop="name" label="name" width="360" />
      <el-table-column prop="color" label="Color Hex" width="120" />
      <el-table-column prop="id" label="ID" sortable width="360" />
      <el-table-column fixed="right" align="right" min-width="240">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template v-slot:default="table">
          <el-button
            type="primary"
            size="small"
            @click="updateCategoryDialog(table.row.id)"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteCategoryById(table.row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="updateDialogVisible" title="Update Category">
    <el-form :model="form">
      <el-form-item label="Name" label-width="140px">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Color Hex" label-width="140px">
        <el-input v-model="form.color" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Rank" label-width="140px">
        <el-input v-model="form.rank" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateCategoryById">
          Update
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

import { useAccountStore } from '@/stores/account';
import { useSurveyApi } from '@/composables/api/survey';

import { ElMessageBox, ElMessage } from 'element-plus';

const accountStore = useAccountStore(); // account store
const { getCategories, updateCategory, deleteCategory } = useSurveyApi(); // survey api

const categoryData = ref([]);
const filteredCategoryData = computed(() =>
  categoryData.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const search = ref('');

const updateDialogVisible = ref(false);
const form = reactive({
  id: '',
  rank: '',
  name: '',
  description: '',
  category: '',
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

function updateCategoryDialog(id) {
  for (const item of categoryData.value) {
    if (item.id === id) {
      form.id = id;
      form.rank = item.rank;
      form.name = item.name;
      form.color = item.color;
      form.rank = item.rank;
      updateDialogVisible.value = true;
      return;
    }
  }
}

async function updateCategoryById() {
  try {
    await updateCategory(
      accountStore.access.token,
      form.id,
      form.name,
      form.color,
      form.rank
    );
    ElMessage({
      type: 'success',
      message: 'Category updated',
    });
    await updateCategoryList();
    updateDialogVisible.value = false;
  } catch (e) {
    console.error(e);
    let errorText = "Couldn't update category, an unknown error happened...";
    if (e.response && e.response.data.message)
      errorText = e.response.data.message;

    return ElMessageBox.alert(errorText, 'Error', {
      confirmButtonText: 'OK',
    });
  }
}

function deleteCategoryById(id) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this category? This is irreversible!',
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteCategory(accountStore.access.token, id);
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        });
        await updateCategoryList();
      } catch (e) {
        console.error(e);
        return ElMessageBox.alert(
          "Couldn't delete category, an unknown error happened...",
          'Error',
          {
            confirmButtonText: 'OK',
          }
        );
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
}
</script>
