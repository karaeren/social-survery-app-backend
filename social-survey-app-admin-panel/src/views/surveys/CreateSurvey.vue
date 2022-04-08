<template>
  <div class="main centered-main">
    <el-scrollbar class="scrollbar-box">
      <el-form :model="form" label-position="left">
        <el-form-item label="Name" label-width="180px">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Description" label-width="180px">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Category" label-width="180px">
          <el-select
            v-model="form.categoryId"
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

      <div class="question-box-no" style="margin-bottom: 16px">
        <h3 style="margin-right: 12px">Questions</h3>
        <el-button @click="addQuestion">Add Question</el-button>
      </div>
      <el-timeline style="padding-left: 0">
        <el-timeline-item
          v-for="(question, question_index) in form.questions"
          :key="question.question_id"
          center
        >
          <el-card>
            <div class="question-box-no">
              <el-button
                type="primary"
                :icon="ArrowUpBold"
                size="small"
                circle
                @click="moveQuestion(question_index, 'up')"
              />
              <el-button
                type="primary"
                :icon="ArrowDownBold"
                size="small"
                circle
                @click="moveQuestion(question_index, 'down')"
              />
              <h4 style="margin: 0 12px">
                Question #{{ question.question_id }}
              </h4>
              <el-button
                type="danger"
                :icon="CloseBold"
                size="small"
                circle
                @click="removeQuestion(question_index)"
              />
            </div>

            <el-form
              ref="formRef"
              :model="question"
              label-width="120px"
              label-position="left"
              style="margin-top: 1rem"
            >
              <el-form-item prop="name" label="Question">
                <el-input v-model="question.question_text" />
              </el-form-item>
              <el-form-item
                v-for="(answer, answer_index) in question.answers"
                :key="answer.key"
                :label="'Answer'"
                :prop="'answers.' + answer_index + '.value'"
              >
                <el-input v-model="answer.answer_text" />
                <el-button
                  style="margin-top: 0.5rem"
                  @click.prevent="removeAnswer(question_index, answer_index)"
                >
                  Delete
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="addAnswer(question_index)">
                  Add Answer
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-button type="primary" @click="createSurveyButton">
        Create Survey
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
import { ArrowUpBold, ArrowDownBold, CloseBold } from '@element-plus/icons-vue';

import geoFeaturesJson from '@/assets/json/geoFeatures.json';
const customGeoFeatures = {};

const accountStore = useAccountStore(); // account store
const { getSurveys, createSurvey, getCategories } = useSurveyApi(); // survey api

const router = useRouter();

const categoryData = ref([]);
const categoryFilterables = ref([]);
const tableData = ref([]);

const idList = {
  lastId: 3,
  1: 3,
  2: 3,
};

const geoFeaturesList = ref([]);
const form = reactive({
  name: '',
  description: '',
  categoryId: '',
  expireDate: null,
  geoFeatures: [],
  questions: [
    {
      question_id: 1,
      question_text: 'Question 1',
      answers: [
        {
          answer_id: 1,
          answer_text: 'Answer 1',
        },
        {
          answer_id: 2,
          answer_text: 'Answer 2',
        },
      ],
    },
    {
      question_id: 2,
      question_text: 'Question 2',
      answers: [
        {
          answer_id: 1,
          answer_text: 'Answer 1',
        },
        {
          answer_id: 2,
          answer_text: 'Answer 2',
        },
      ],
    },
  ],
});

const geoOptions = Object.keys(geoFeaturesJson);
const showCustomGeoBox = ref(false);
const customGeoForm = reactive({
  name: '',
  geojson: '',
});

const swapArrayElements = (arr, indexA, indexB) => {
  const temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
};

const removeQuestion = (questionIndex) => {
  form.questions.splice(questionIndex, 1);
};

const addQuestion = () => {
  const newId = idList.lastId;
  idList[newId] = 3;
  idList.lastId++;

  form.questions.push({
    question_id: newId,
    question_text: 'Question ' + newId,
    answers: [
      {
        answer_id: 1,
        answer_text: 'Answer 1',
      },
      {
        answer_id: 2,
        answer_text: 'Answer 2',
      },
    ],
  });
};

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

function moveQuestion(questionIndex, direction) {
  if (
    (direction === 'up' && questionIndex === 0) ||
    (direction === 'down' && questionIndex === form.questions.length - 1)
  )
    return;

  if (direction === 'up')
    swapArrayElements(form.questions, questionIndex, questionIndex - 1);
  else if (direction === 'down')
    swapArrayElements(form.questions, questionIndex, questionIndex + 1);
}

function removeAnswer(questionIndex, answerIndex) {
  form.questions[questionIndex].answers.splice(answerIndex, 1);
}

function addAnswer(questionIndex) {
  const newId = idList[form.questions[questionIndex].question_id];
  idList[form.questions[questionIndex].question_id]++;

  form.questions[questionIndex].answers.push({
    answer_id: newId,
    answer_text: 'Answer ' + newId,
  });
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

async function createSurveyButton() {
  form.geoFeatures = [];

  if (geoFeaturesList.value.length > 0) {
    for (const geoItem of geoFeaturesList.value) {
      if (Object.keys(geoFeaturesJson).includes(geoItem))
        form.geoFeatures.push(geoFeaturesJson[geoItem]);
      else if (Object.keys(customGeoFeatures).includes(geoItem))
        form.geoFeatures.push(customGeoFeatures[geoItem]);
    }
  }

  let data;
  try {
    data = await createSurvey(accountStore.access.token, form);
  } catch (e) {
    console.error(e);
    let errorText =
      'An unknown error happened while trying to create the survey...';
    if (e.response && e.response.data.message)
      errorText = e.response.data.message;

    return ElMessageBox.alert(errorText, 'Error', {
      confirmButtonText: 'OK',
    });
  }
  console.log(data);

  ElMessageBox.alert('Survey created successfully.', 'Success!', {
    confirmButtonText: 'OK',
    callback: () => {
      router.push('list-surveys');
    },
  });
}
</script>

<style>
.question-box-no {
  display: flex;
  align-items: baseline;
}
</style>
