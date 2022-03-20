import { defineStore } from 'pinia';

export const useAccountStore = defineStore({
  id: 'account',
  state: () => ({
    access: {
      expires: '',
      token: '',
    },
    refresh: {
      expires: '',
      token: '',
    },
    user: {
      id: '',
      email: '',
      name: '',
      role: '',
    },
    loggedIn: false,
  }),
  getters: {
    /* doubleCount: (state) => state.counter * 2, */
  },
  actions: {
    setTokens(tokens) {
      this.access = tokens.access;
      this.refresh = tokens.refresh;
      this.saveTokensToLocalStorage();
    },
    setUser(user) {
      this.user = user;
      this.saveUserToLocalStorage();
    },
    saveTokensToLocalStorage() {
      console.log('Saving Tokens...');
      localStorage.setItem('ref', btoa(JSON.stringify(this.refresh)));
    },
    saveUserToLocalStorage() {
      console.log('Saving User...');
      localStorage.setItem('usr', btoa(JSON.stringify(this.user)));
    },
    getFromLocalStorage() {
      const ref = localStorage.getItem('ref');
      if (ref) this.refresh = JSON.parse(atob(ref));

      const usr = localStorage.getItem('usr');
      if (usr) this.user = JSON.parse(atob(usr));
    },
    resetLocalStorage() {
      localStorage.removeItem('ref');
      localStorage.removeItem('usr');
    },
  },
});
