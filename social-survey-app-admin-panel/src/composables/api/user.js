import axios from 'axios';

export function useUserApi() {
  async function getAllUsers(
    accessToken,
    name,
    role,
    sortBy,
    limit = 1000,
    page = 1
  ) {
    const response = await axios.get(
      `https://socialsurveyapp.software/api/v1/users`,
      {
        params: {
          ...(name && { name }),
          ...(role && { role }),
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

  async function getUser(accessToken, userId) {
    const response = await axios.get(
      `https://socialsurveyapp.software/api/v1/users/${userId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const data = response.data;
    return data;
  }

  async function deleteUser(accessToken, userId) {
    const response = await axios.delete(
      `https://socialsurveyapp.software/api/v1/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data;
    return data;
  }

  return { getAllUsers, getUser, deleteUser };
}
