const resultElem = document.querySelector('#result');

async function main() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params && params.surveyId) {
    try {
      const response = await axios.get(
        `/api/v1/survey/results/${params.surveyId}`
      );

      resultElem.innerText = JSON.stringify(response.data);
    } catch (error) {
      alert(error);
    }
  } else {
    alert('Error, surveyId not found!');
  }
}

window.onload = main;
