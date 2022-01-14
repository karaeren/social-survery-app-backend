const mapboxAccessToken =
  'pk.eyJ1IjoiZXJlbmt5aSIsImEiOiJja3h4cjdwbm8xdGU4Mm9venBubDh5ZW1tIn0.Ba4FsZ-XKJgK1CPk5m8fSw';
const map = L.map('map').setView([38.9637, 35.2433], 7);
const info = L.control();
const legend = L.control({ position: 'bottomright' });

const age = (bdate, now = new Date(), then = new Date(bdate)) =>
  now.getFullYear() -
  then.getFullYear() -
  (now < new Date(now.getFullYear(), then.getMonth(), then.getDate()));
const ageGroups = [
  { min: 0, max: 16, text: '0-16', count: 0 },
  { min: 17, max: 30, text: '17-30', count: 0 },
  { min: 31, max: 45, text: '31-45', count: 0 },
  { min: 46, max: 60, text: '46-60', count: 0 },
  { min: 61, max: 999, text: '61+', count: 0 },
];
const genderGroups = ['male', 'female', 'other'];

let responseData;
let responseMap = {};
let geojson;
let geoData;

const questionSelect = document.querySelector('#question-select');
const questionTitle = document.querySelector('#question-title');

async function main() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params && params.surveyId) {
    try {
      const response = await axios.get(
        `/api/v1/survey/results/${params.surveyId}`
      );

      responseData = response.data;
      calculateAnswers();

      for (const question of responseData.results.survey.questions) {
        questionSelect.add(
          new Option('Question #' + question.question_id, question.question_id)
        );
      }

      questionSelect.addEventListener('change', function (e) {
        changeQuestion(e.target.value);
        updateCustomViews();
      });

      changeQuestion(1);

      geoData = await getData('/api/static/json/tr-cities.json');
      createMap();
      updateCustomViews();
    } catch (error) {
      alert(error);
    }
  } else {
    alert('Error, surveyId not found!');
  }
}

function calculateAnswers() {
  const submissions = responseData.results.submissions;

  for (const submission of submissions) {
    for (const answer of submission.answers) {
      const _q = 'question_' + answer.question_id,
        _a = 'answer_' + answer.answer_id;

      if (!Object.keys(responseMap).includes(_q)) {
        responseMap[_q] = {};
      }

      if (!Object.keys(responseMap[_q]).includes(_a)) {
        responseMap[_q][_a] = {
          count: 0,
          locations: [],
          genders: {},
          ages: JSON.parse(JSON.stringify(ageGroups)),
        };
      }

      responseMap[_q][_a].count += 1;
      responseMap[_q][_a].locations.push(submission.location);

      if (
        !Object.keys(responseMap[_q][_a].genders).includes(
          submission.shadowId.gender
        )
      ) {
        responseMap[_q][_a].genders[submission.shadowId.gender] = 0;
      }
      responseMap[_q][_a].genders[submission.shadowId.gender] += 1;

      const submissionAge = age(submission.shadowId.birthdate);
      for (let i = 0; i < responseMap[_q][_a].ages.length; i++) {
        const curGroup = responseMap[_q][_a].ages[i];
        if (submissionAge >= curGroup.min && submissionAge <= curGroup.max) {
          responseMap[_q][_a].ages[i].count += 1;
        }
      }
    }
  }
}

function changeQuestion(questionNumber) {
  const question = responseData.results.survey.questions[questionNumber - 1];

  // Question title
  questionTitle.innerText = question.question_text;

  // Answer chart
  let answerSeries = [];
  let answerCategories = [];

  for (const answer of question.answers) {
    answerCategories.push(answer.answer_text);
    answerSeries.push(
      responseMap['question_' + questionNumber]['answer_' + answer.answer_id]
        .count
    );
  }

  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    series: [
      {
        data: answerSeries,
      },
    ],
    xaxis: {
      categories: answerCategories,
    },
  };

  const chart = new ApexCharts(
    document.querySelector('#answer-chart'),
    options
  );

  chart.render();
}

function generateAgeHeatmapSeries(questionNumber, answers) {
  let series = [];

  for (const group of ageGroups) {
    let data = [];
    for (const answer of answers) {
      let y = 0;
      for (const _y of responseMap['question_' + questionNumber][
        'answer_' + answer.answer_id
      ].ages) {
        if (_y.text == group.text) y = _y.count;
      }

      data.push({
        x: answer.answer_text,
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

function generateGenderHeatmapSeries(questionNumber, answers) {
  let series = [];

  for (const group of genderGroups) {
    let data = [];
    for (const answer of answers) {
      let _ans =
        responseMap['question_' + questionNumber]['answer_' + answer.answer_id]
          .genders[group];
      if (!_ans) _ans = 0;

      data.push({
        x: answer.answer_text,
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

// customViewNumber; 1 = age heatmap, 2 = gender heatmap, 3 = location heatmap
function updateCustomViews() {
  document.querySelector('#custom-view-chart1').innerHTML = '';
  document.querySelector('#custom-view-chart2').innerHTML = '';

  const questionNumber = questionSelect.value;

  let options1 = {
    chart: {
      type: 'heatmap',
      height: 256,
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: 'Age Groups Heatmap Chart',
    },
  };
  let series1 = generateAgeHeatmapSeries(
    questionNumber,
    responseData.results.survey.questions[questionNumber - 1].answers
  );
  options1.series = series1;
  const chart1 = new ApexCharts(
    document.querySelector('#custom-view-chart1'),
    options1
  );
  chart1.render();

  let options2 = {
    chart: {
      type: 'heatmap',
      height: 256,
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: 'Gender Groups Heatmap Chart',
    },
  };
  let series2 = generateGenderHeatmapSeries(
    questionNumber,
    responseData.results.survey.questions[questionNumber - 1].answers
  );
  options2.series = series2;
  const chart2 = new ApexCharts(
    document.querySelector('#custom-view-chart2'),
    options2
  );
  chart2.render();

  createMapData();
}

let mapColors;

function createGeoData(questionNumber) {
  mapColors = {};

  let copyGeoData = JSON.parse(JSON.stringify(geoData));

  const question = responseMap['question_' + questionNumber];

  for (const feature of copyGeoData.features) {
    feature.properties.answers = {};

    for (const answer of Object.keys(question)) {
      for (const loc of question[answer].locations) {
        var pt = turf.point([loc.long, loc.lat]);
        if (turf.booleanPointInPolygon(pt, feature)) {
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
        if (!Object.keys(mapColors).includes(key))
          mapColors[key] = Object.keys(mapColors).length + 1;
      }
    }
  }

  return copyGeoData;
}
// 39
function createMap() {
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

function createMapData() {
  const questionNumber = questionSelect.value;
  const newGeoData = createGeoData(questionNumber);

  if(geojson)
    map.removeLayer(geojson);

  geojson = L.geoJson(newGeoData, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);

  info.onAdd = function (map) {
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

  legend.onAdd = function (map) {
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

async function getData(url = '') {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  return response.json();
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

window.onload = main;
