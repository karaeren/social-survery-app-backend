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

  return { getSurveys, getCategories };
}
