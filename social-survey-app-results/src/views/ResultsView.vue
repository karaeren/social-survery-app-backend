<template>
  <div class="main">
    <el-card v-if="resultData.submissions.length === 0" class="box-card">
      <template #header>
        <div class="card-header">
          <span>No data</span>
        </div>
      </template>
      Nobody voted on this survey yet...
    </el-card>
    <div v-else>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <!-- <span
              >Question #{{ currentQuestionIndex + 1 }} (Type:
              {{
                resultData.survey.questions[currentQuestionIndex].questionType
              }})</span
            > -->
            <el-select
              v-model="currentQuestionIndex"
              class="m-2 w-100"
              placeholder="Select question"
              size="large"
            >
              <el-option
                v-for="(question, index) in resultData.survey.questions"
                :key="question.questionId"
                :label="`#${index + 1}: ${question.questionText}`"
                :value="index"
              />
            </el-select>
          </div>
        </template>
        {{ resultData.survey.questions[currentQuestionIndex].questionText }}
        <div
          v-if="
            resultData.survey.questions[currentQuestionIndex].questionType !==
            'slider'
          "
          style="margin-top: 16px"
        >
          <el-radio-group v-model="disabledData" disabled>
            <el-radio
              v-for="answer in resultData.survey.questions[currentQuestionIndex]
                .answers"
              :key="answer.answerId"
              :label="answer.answerId"
              border
            >
              {{ answer.answerText }}
            </el-radio>
          </el-radio-group>
        </div>
        <div v-else>
          <el-slider
            v-model="disabledData"
            disabled
            range
            :marks="marks.marks"
            :min="
              resultData.survey.questions[currentQuestionIndex].answers[0]
                .sliderMin
            "
            :max="
              resultData.survey.questions[currentQuestionIndex].answers[0]
                .sliderMax
            "
          />
        </div>
      </el-card>
      <apexchart
        v-if="
          resultData.survey.questions[currentQuestionIndex].questionType !==
            'slider' && ageHeatmapSeries.length > 0
        "
        style="margin: 32px 0"
        :options="ageHeatmapOptions"
        :series="ageHeatmapSeries"
      ></apexchart>

      <apexchart
        v-if="
          resultData.survey.questions[currentQuestionIndex].questionType !==
            'slider' && genderHeatmapSeries.length > 0
        "
        style="margin: 32px 0"
        :options="genderHeatmapOptions"
        :series="genderHeatmapSeries"
      ></apexchart>
    </div>
    <div id="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { booleanPointInPolygon } from '@turf/turf';
import { ElMessageBox } from 'element-plus';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import trCitiesJson from '@/assets/json/tr-cities.json';

import { useSurveyApi } from '@/composables/api/survey';
const { getSurveyResults } = useSurveyApi(); // survey api composable

const route = useRoute();

const mapboxAccessToken =
  'pk.eyJ1IjoiZXJlbmt5aSIsImEiOiJja3h4cjdwbm8xdGU4Mm9venBubDh5ZW1tIn0.Ba4FsZ-XKJgK1CPk5m8fSw';
let map;
const info = L.control();
const legend = L.control({ position: 'bottomright' });
let geojson,
  geoData = JSON.parse(JSON.stringify(trCitiesJson));

const ageGroups = [
  { min: 0, max: 16, text: '0-16', count: 0 },
  { min: 17, max: 30, text: '17-30', count: 0 },
  { min: 31, max: 45, text: '31-45', count: 0 },
  { min: 46, max: 60, text: '46-60', count: 0 },
  { min: 61, max: 999, text: '61+', count: 0 },
];
const age = (bdate, now = new Date(), then = new Date(bdate)) =>
  now.getFullYear() -
  then.getFullYear() -
  (now < new Date(now.getFullYear(), then.getMonth(), then.getDate()));
const genderGroups = ['male', 'female', 'other'];

const ageHeatmapOptions = ref({
  chart: {
    type: 'heatmap',
    height: 256,
    background: '#fff',
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: 'Age Groups Heatmap Chart',
  },
});
const genderHeatmapOptions = ref({
  chart: {
    type: 'heatmap',
    height: 256,
    background: '#fff',
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: 'Gender Heatmap Chart',
  },
});
const marks = reactive({
  marks: {},
});
// Data
const disabledData = ref(0);
const currentQuestionIndex = ref(0);
watch(currentQuestionIndex, () => {
  createMap();
  calculateAnswers();
});

const resultData = reactive({
  survey: {},
  submissions: [],
  responseMap: {},
});

const ageHeatmapSeries = ref([]);
const genderHeatmapSeries = ref([]);

function createMap() {
  if (!map) map = L.map('mapContainer').setView([38.9637, 35.2433], 7);

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
      mapboxAccessToken,
    {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(map);
}

function getColor(d) {
  return d == 1
    ? '#a6cee3'
    : d == 2
    ? '#1f78b4'
    : d == 3
    ? '#b2df8a'
    : d == 4
    ? '#33a02c'
    : d == 5
    ? '#fb9a99'
    : d == 6
    ? '#e31a1c'
    : d == 7
    ? '#fdbf6f'
    : d == 8
    ? '#ff7f00'
    : d == 9
    ? '#cab2d6'
    : d == 10
    ? '#6a3d9a'
    : d == 11
    ? '#ffff99'
    : d == 12
    ? '#b15928'
    : '#000000';
}

function style(feature) {
  return {
    fillColor: getColor(mapColors[feature.properties.data]),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);

  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

function createMapData() {
  const questionNumber = currentQuestionIndex.value;
  const newGeoData = createGeoData(questionNumber);

  if (geojson) map.removeLayer(geojson);

  geojson = L.geoJson(newGeoData, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);

  info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h4>Location Heatmap</h4>';
    if (props) {
      this._div.innerHTML +=
        '<b>' + props.name + '(' + props.number + ')</b><br />';
      for (const ans of Object.keys(props.answers)) {
        this._div.innerHTML += ans + ': ' + props.answers[ans] + '<br />';
      }
      if (Object.keys(props.answers).length == 0) {
        this._div.innerHTML += 'No data for this city';
      }
    } else {
      this._div.innerHTML += 'Tap a city';
    }
  };

  info.addTo(map);

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');

    for (const col of Object.keys(mapColors)) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(mapColors[col]) +
        '"></i> ' +
        col +
        '<br />';
    }

    return div;
  };

  legend.addTo(map);
}

onMounted(async () => {
  const queryParams = Object.keys(route.query);
  if (queryParams.length <= 0 || !queryParams.includes('surveyId')) {
    return ElMessageBox.alert(
      "Couldn't find a survey id in the URL.",
      'Error',
      {
        confirmButtonText: 'OK',
      }
    );
  }

  let data;
  try {
    data = await getSurveyResults(route.query['surveyId']);
  } catch (e) {
    let errorText = 'Unknown error...';
    if (e.response.data && e.response.data.message)
      errorText = e.response.data.message;
    ElMessageBox.alert(errorText, 'Error', {
      confirmButtonText: 'OK',
    });
  }

  if (data && data.results && data.results.survey) {
    resultData.survey = data.results.survey;
    resultData.submissions = data.results.submissions;
  }

  createMap();
  calculateAnswers();
});

function getQuestion(id) {
  for (const question of resultData.survey.questions) {
    if (question.questionId === id) return question;
  }
}

function calculateAnswers() {
  const submissions = resultData.submissions;

  let sliderSubmissions = [];
  marks.marks = {};

  for (const submission of submissions) {
    for (const answer of submission.answers) {
      const _q = 'question_' + answer.questionId;
      if (!Object.keys(resultData.responseMap).includes(_q)) {
        resultData.responseMap[_q] = JSON.parse(
          JSON.stringify(getQuestion(answer.questionId))
        );
      }

      if (
        resultData.responseMap[_q].questionType === 'multiple-choice' ||
        resultData.responseMap[_q].questionType === 'ranking'
      ) {
        let _a;
        if (resultData.responseMap[_q].questionType === 'multiple-choice')
          _a = 'answer_' + answer.multipleChoiceValue;
        else if (resultData.responseMap[_q].questionType === 'ranking')
          _a = 'answer_' + answer.rankingValue[0];

        if (!Object.keys(resultData.responseMap[_q]).includes(_a)) {
          resultData.responseMap[_q][_a] = {
            count: 0,
            locations: [],
            genders: {},
            ages: JSON.parse(JSON.stringify(ageGroups)),
          };
        }

        resultData.responseMap[_q][_a].count += 1;
        resultData.responseMap[_q][_a].locations.push(submission.location);

        if (submission.shadowId.gender) {
          if (
            !Object.keys(resultData.responseMap[_q][_a].genders).includes(
              submission.shadowId.gender
            )
          ) {
            resultData.responseMap[_q][_a].genders[
              submission.shadowId.gender
            ] = 0;
          }
          resultData.responseMap[_q][_a].genders[
            submission.shadowId.gender
          ] += 1;
        }

        if (submission.shadowId.birthdate) {
          const submissionAge = age(submission.shadowId.birthdate);
          for (let i = 0; i < resultData.responseMap[_q][_a].ages.length; i++) {
            const curGroup = resultData.responseMap[_q][_a].ages[i];
            if (
              submissionAge >= curGroup.min &&
              submissionAge <= curGroup.max
            ) {
              resultData.responseMap[_q][_a].ages[i].count += 1;
            }
          }
        }

        ageHeatmapSeries.value = generateAgeHeatmapSeries();
        genderHeatmapSeries.value = generateGenderHeatmapSeries();
      } else {
        if (answer.sliderValue) sliderSubmissions.push(answer.sliderValue);
      }
    }
  }

  const _min = Math.min(...sliderSubmissions);
  marks.marks[_min] = `Minimum: ${_min}`;
  const _max = Math.max(...sliderSubmissions);
  marks.marks[_max] = `Minimum: ${_max}`;
  const _sum = sliderSubmissions.reduce((a, b) => a + b, 0);
  const _avg = _sum / sliderSubmissions.length || 0;
  marks.marks[_avg] = `Average: ${_avg}`;

  createMapData();
}

function generateAgeHeatmapSeries() {
  const questionNumber = currentQuestionIndex.value + 1;
  const answers =
    resultData.survey.questions[currentQuestionIndex.value].answers;

  let series = [];

  for (const group of ageGroups) {
    let data = [];
    for (const answer of answers) {
      let y = 0;
      const questionAnswerN =
        resultData.responseMap['question_' + questionNumber][
          'answer_' + answer.answerId
        ];

      if (questionAnswerN) {
        for (const _y of resultData.responseMap['question_' + questionNumber][
          'answer_' + answer.answerId
        ].ages) {
          if (_y.text == group.text) y = _y.count;
        }
      }

      data.push({
        x: answer.answerText,
        y: y,
      });
    }

    series.push({
      name: group.text,
      data: data,
    });
  }

  return series;
}

function generateGenderHeatmapSeries() {
  const questionNumber = currentQuestionIndex.value + 1;
  const answers =
    resultData.survey.questions[currentQuestionIndex.value].answers;

  let series = [];

  for (const group of genderGroups) {
    let data = [];
    for (const answer of answers) {
      let _ans =
        resultData.responseMap['question_' + questionNumber][
          'answer_' + answer.answerId
        ];
      if (_ans) _ans = _ans.genders[group];

      if (!_ans) _ans = 0;

      data.push({
        x: answer.answerText,
        y: _ans,
      });
    }

    series.push({
      name: group,
      data: data,
    });
  }

  return series;
}

let mapColors;

function createGeoData(questionNumber) {
  mapColors = {};

  let copyGeoData = JSON.parse(JSON.stringify(geoData));
  const question =
    resultData.responseMap['question_' + (questionNumber + 1).toString()];

  for (const feature of copyGeoData.features) {
    feature.properties.answers = {};

    for (const answer of Object.keys(question)) {
      if (!answer.startsWith('answer_')) continue;
      for (const loc of question[answer].locations) {
        if (booleanPointInPolygon([loc.long, loc.lat], feature)) {
          if (!Object.keys(feature.properties.answers).includes(answer))
            feature.properties.answers[answer] = 0;

          feature.properties.answers[answer] += 1;
        }
      }
    }
    let highest = 0;
    for (const key of Object.keys(feature.properties.answers)) {
      if (feature.properties.answers[key] > highest) {
        feature.properties.data = key;
        highest = feature.properties.answers[key];
        if (!Object.keys(mapColors).includes(key))
          mapColors[key] = Object.keys(mapColors).length + 1;
      }
    }
  }

  return copyGeoData;
}
</script>

<style>
.main {
  padding: 32px;
  width: 100%;
}
@media only screen and (min-width: 992px) {
  .main {
    width: 50%;
  }
}

.w-100 {
  width: 100%;
}

#mapContainer {
  height: 512px;
}
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.info h4 {
  margin: 0 0 5px;
  color: #777;
}
.legend {
  line-height: 18px;
  color: #555;
}
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

.br-0 {
  border-radius: 0;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
