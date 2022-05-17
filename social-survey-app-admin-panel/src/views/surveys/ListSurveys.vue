<template>
  <div class="main centered-main">
    <el-table :data="filteredTableData" height="100vh" style="width: 100%">
      <el-table-column fixed prop="name" label="Name" sortable width="240" />
      <el-table-column prop="description" label="Description" width="360" />
      <el-table-column prop="expireDate" label="Expire Date" width="240" />
      <el-table-column
        prop="numFeatures"
        label="Geographic Features"
        width="240"
      />
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
      <el-form-item label="Name" label-width="180px">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Description" label-width="180px">
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Category" label-width="180px">
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
      <el-form-item label="Expiration Date" label-width="180px">
        <el-date-picker
          v-model="form.expireDate"
          type="date"
          placeholder="Pick a day"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
        <el-button style="margin-left: 1em" @click="form.expireDate = null">
          Remove Expiration
        </el-button>
      </el-form-item>
      <el-form-item label="Geographic Constraints" label-width="180px">
        <el-select
          v-model="geoFeaturesList"
          multiple
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in geoOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button
          style="margin-left: 1em"
          @click="showCustomGeoBox = !showCustomGeoBox"
        >
          Add Custom Geographic Constraint
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="showCustomGeoBox"
        label="Add Custom Constraint"
        label-width="180px"
      >
        <a href="https://geojson.io/" target="_blank"> geojson.io </a>
        <el-input
          v-model="customGeoForm.name"
          placeholder="Custom constraint name"
        />
        <el-input
          v-model="customGeoForm.geojson"
          :rows="2"
          type="textarea"
          placeholder="GeoJSON"
        />
        <el-button @click="addCustomGeo">
          Add Custom Geographic Constraint
        </el-button>
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

import geoFeaturesJson from '@/assets/json/geoFeatures.json';
const customGeoFeatures = {};

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
const geoFeaturesList = ref([]);
const form = reactive({
  id: '',
  name: '',
  description: '',
  category: '',
  expireDate: null,
  geoFeatures: [],
});

const geoOptions = Object.keys(geoFeaturesJson);
const showCustomGeoBox = ref(false);
const customGeoForm = reactive({
  name: '',
  geojson: '',
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
      expireDate: res.expireDate
        ? new Date(res.expireDate).toISOString().split('T')[0]
        : null,
      numFeatures: res.geoFeatures ? res.geoFeatures.length : 0,
      geoFeatures: res.geoFeatures,
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
    `https://socialsurveyapp.software/results/#/?surveyId=${id}`,
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
      form.expireDate = item.expireDate;
      form.geoFeatures = item.geoFeatures;
      updateDialogVisible.value = true;
      geoFeaturesList.value = [];

      for (const geoItem of form.geoFeatures) {
        geoFeaturesList.value.push(geoItem.name);
        if (!geoOptions.includes(geoItem.name))
          geoOptions.push(customGeoForm.name);

        if (!Object.keys(geoFeaturesJson).includes(geoItem.name))
          customGeoFeatures[geoItem.name] = {
            name: geoItem.name,
            type: geoItem.type,
            coordinates: geoItem.coordinates,
          };
      }

      return;
    }
  }
}

function addCustomGeo() {
  if (!customGeoForm.name || !customGeoForm.geojson) {
    return ElMessageBox.alert('Please fill all areas!', 'Error', {
      confirmButtonText: 'OK',
    });
  }

  let parsedInput = {};
  try {
    parsedInput.name = customGeoForm.name;

    const parsedStr = JSON.parse(customGeoForm.geojson);
    parsedInput.type = parsedStr.features[0].geometry.type;
    parsedInput.coordinates = parsedStr.features[0].geometry.coordinates;
  } catch (e) {
    return ElMessageBox.alert(
      'An error happened while trying to parse your input: ' + e.message,
      'Error',
      {
        confirmButtonText: 'OK',
      }
    );
  }

  customGeoFeatures[customGeoForm.name] = parsedInput;

  geoOptions.push(customGeoForm.name);
  geoFeaturesList.value.push(customGeoForm.name);

  customGeoForm.name = '';
  customGeoForm.geojson = '';

  showCustomGeoBox.value = false;
}

async function updateSurveyById() {
  form.geoFeatures = [];

  if (geoFeaturesList.value.length > 0) {
    for (const geoItem of geoFeaturesList.value) {
      if (Object.keys(geoFeaturesJson).includes(geoItem))
        form.geoFeatures.push(geoFeaturesJson[geoItem]);
      else if (Object.keys(customGeoFeatures).includes(geoItem))
        form.geoFeatures.push(customGeoFeatures[geoItem]);
    }
  }

  try {
    await updateSurvey(
      accountStore.access.token,
      form.id,
      form.name,
      form.description,
      form.category,
      form.expireDate,
      form.geoFeatures
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
