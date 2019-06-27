import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
  },
  mutations: {
    signIn(state, user) {
      state.currentUser = user;
    },
    signOut(state) {
      state.currentUser = null;
    },
    setProfileImage(state, profileImageSrc) {
      if (state.currentUser !== null) {
        // @ts-ignore
        state.currentUser.profileImageSrc = profileImageSrc;
      }
    }
  },
  actions: {

  },
  getters: {
    currentUser: state => {
      return state.currentUser;
    },
  }
});
