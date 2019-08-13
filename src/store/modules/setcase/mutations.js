const mutations = {
  addPlantiffId (state) {
    state.plantiffNum ++;
    state.plantiffId = state.plantiffStr + state.plantiffNum;
  },
  addAgentId (state) {
    state.agentNum ++ ;
    state.agentId = state.agentStr + state.agentNum;
  }
}

export default mutations
