import axios from 'axios';

export function useSurveyApi() {
  async function getSurveys(
    accessToken,
    name,
    searchForName,
    categoryId,
    sortBy,
    limit = 1000,
    page = 1
  ) {
    const response = await axios.get(
      `https://socialsurveyapp.software/api/v1/survey`,
      {
        params: {
          ...(name && { name }),
          ...(searchForName && { searchForName }),
          ...(categoryId && { categoryId }),
          ...(sortBy && { sortBy }),
          limit,
          page,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data;
    return data;
  }

  async function createSurvey(accessToken, body) {
    const response = await axios.post(
      `https://socialsurveyapp.software/api/v1/survey`,
      body,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data;
    return data;
  }

  async function updateSurvey(
    accessToken,
    surveyId,
    name,
    description,
    categoryId
  ) {
    const response = await axios.patch(
      `https://socialsurveyapp.software/api/v1/survey/${surveyId}`,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(categoryId && { categoryId }),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data;
    return data;
  }

  async function deleteSurvey(accessToken, surveyId) {
    const response = await axios.delete(
      `https://socialsurveyapp.software/api/v1/survey/${surveyId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data;
    return data;
  }

  async function getCategories(accessToken) {
    const response = await axios.get(
      `https://socialsurveyapp.software/api/v1/survey/categories`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data;
    return data;
  }

  return {
    getSurveys,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getCategories,
  };
}
