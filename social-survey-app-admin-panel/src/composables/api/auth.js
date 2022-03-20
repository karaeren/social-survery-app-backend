import axios from 'axios';

export function useAuthApi() {
  async function login(email, password) {
    const response = await axios.post(
      'https://socialsurveyapp.software/api/v1/auth/login',
      {
        email,
        password,
      }
    );
    const data = response.data;
    return data;
  }

  async function refreshTokens(refreshToken) {
    const response = await axios.post(
      'https://socialsurveyapp.software/api/v1/auth/refresh-tokens',
      {
        refreshToken,
      }
    );
    const data = response.data;
    return data;
  }

  return { login, refreshTokens };
}
