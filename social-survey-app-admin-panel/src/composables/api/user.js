import axios from 'axios';

export function useUserApi() {
  async function getUser(accessToken, userId) {
    const response = await axios.get(
      `https://socialsurveyapp.software/api/v1/users/${userId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const data = response.data;
    return data;
  }

  return { getUser };
}
