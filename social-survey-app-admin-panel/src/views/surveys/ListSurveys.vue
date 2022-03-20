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
      <el-table-column fixed="right" align="right">
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
          <el-button type="primary" size="small">Edit</el-button>
          <el-button type="danger" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import { useAccountStore } from '@/stores/account';
import { useSurveyApi } from '@/composables/api/survey';

import { ElMessageBox } from 'element-plus';

const accountStore = useAccountStore(); // account store
const { getSurveys, getCategories } = useSurveyApi(); // survey api

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
    categoryFilterables.value.push({ text: cat.name, value: cat.name });
  }

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
});

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
</script>

<style>
.main {
  padding: 32px;
}
.centered-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
</style>
