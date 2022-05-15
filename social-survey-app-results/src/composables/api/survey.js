import axios from 'axios';

export function useSurveyApi() {
  async function getSurveyResults(surveyId) {
    const response = await axios.get(
      `https://socialsurveyapp.software/api/v1/survey/results/${surveyId}`
    );

    const data = response.data;
    return data;
  }

  return { getSurveyResults };
}
