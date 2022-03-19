export default {
  methods: {
    async refreshTokens(refreshToken) {
      const response = await this.axios.post(
        'https://socialsurveyapp.software/api/v1/auth/refresh-tokens',
        {
          refreshToken: refreshToken,
        }
      );
      const data = response.data;
      return data;
    },
    async getUser(accessToken, userId) {
      console.log({ headers: { Authorization: `Bearer ${accessToken}` } });
      const response = await this.axios.get(
        `https://socialsurveyapp.software/api/v1/users/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = response.data;
      return data;
    },
  },
};
