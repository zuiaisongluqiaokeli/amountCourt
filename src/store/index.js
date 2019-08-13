import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import setcaseModules from './modules/setcase/index';
import caseModules from './modules/case.js';
import message from './modules/message.js';
import search from './modules/search.js';
import batch from './modules/batch.js';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    setcaseModules,
    caseModules,
    message,
    search,
    batch
  },
  getters
});

export default store;
