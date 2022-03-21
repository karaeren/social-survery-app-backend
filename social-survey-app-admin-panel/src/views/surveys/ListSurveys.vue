<template>
  <div class="main centered-main">
    <el-table :data="filteredTableData" height="100vh" style="width: 100%">
      <el-table-column fixed prop="name" label="Name" sortable width="240" />
      <el-table-column prop="description" label="Description" width="360" />
      <el-table-column
        prop="submissionCount"
        label="Submission Count"
        width="240"
      />
      <el-table-column
        prop="category"
        label="Category"
        sortable
        :filters="categoryFilterables"
        :filter-method="filterCategory"
        width="240"
      />
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
            type="success"
            size="small"
            @click="openResults(table.row.id)"
          >
            Results
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="updateSurveyDialog(table.row.id)"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteSurveyById(table.row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="updateDialogVisible" title="Update Survey">
    <el-form :model="form">
      <el-form-item label="Name" label-width="140px">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Description" label-width="140px">
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Category" label-width="140px">
        <el-select
          v-model="form.category"
          placeholder="Please select a category"
        >
          <el-option
            v-for="cat in categoryFilterables"
            :key="cat.id"
            :label="cat.value"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateSurveyById"> Update </el-button>
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
const { getSurveys, updateSurvey, deleteSurvey, getCategories } =
  useSurveyApi(); // survey api

const categoryData = ref([]);
const categoryFilterables = ref([]);
const tableData = ref([]);
const search = ref('');
const filteredTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const updateDialogVisible = ref(false);
const form = reactive({
  id: '',
  name: '',
  description: '',
  category: '',
});

onMounted(async () => {
  if (!accountStore.access.token) return;

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

  for await (const cat of categoryData.value) {
    categoryFilterables.value.push({
      id: cat.id,
      text: cat.name,
      value: cat.name,
    });
  }

  await updateSurveyList();
});

async function updateSurveyList() {
  tableData.value = []; // reset table data
  let surveyData;
  try {
    surveyData = await getSurveys(accountStore.access.token);
  } catch (e) {
    console.error(e);
    return ElMessageBox.alert(
      'An unknown error happened while trying to retrieve list of surveys...',
      'Error',
      {
        confirmButtonText: 'OK',
      }
    );
  }
  await generateTableData(surveyData);
}

async function generateTableData(data) {
  for await (const res of data.results) {
    const category = categoryData.value.filter((c) => c.id === res.categoryId);

    tableData.value.push({
      id: res.id,
      name: res.name,
      description: res.description,
      categoryId: res.categoryId,
      category: category.length ? category[0].name : 'Unknown Category',
      submissionCount: res.submissionCount,
    });
  }
}

function filterCategory(value, row) {
  return row.category === value;
}

function openResults(id) {
  window.open(
    `https://socialsurveyapp.software/results.html?surveyId=${id}`,
    '_blank'
  );
}

function updateSurveyDialog(id) {
  for (const item of tableData.value) {
    if (item.id === id) {
      form.id = id;
      form.name = item.name;
      form.description = item.description;
      form.category = item.categoryId;
      updateDialogVisible.value = true;
      return;
    }
  }
}

async function updateSurveyById() {
  try {
    await updateSurvey(
      accountStore.access.token,
      form.id,
      form.name,
      form.description,
      form.category
    );
    ElMessage({
      type: 'success',
      message: 'Survey updated',
    });
    await updateSurveyList();
    updateDialogVisible.value = false;
  } catch (e) {
    console.error(e);
    return ElMessageBox.alert(
      "Couldn't update survey, an unknown error happened...",
      'Error',
      {
        confirmButtonText: 'OK',
      }
    );
  }
}

function deleteSurveyById(id) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this survey? This is irreversible!',
    'Warning',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteSurvey(accountStore.access.token, id);
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        });
        await updateSurveyList();
      } catch (e) {
        console.error(e);
        return ElMessageBox.alert(
          "Couldn't delete survey, an unknown error happened...",
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

<style>
.main {
  padding: 32px;
}
.centered-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 64px);
}
</style>
