export default {
  setUser: ({ commit }: any, { user, key }: any) =>
    commit('setUser', { user, key }),
  setToken: ({ commit }: any, payload: any) => commit('setToken', payload),
  setFeedback: ({ commit }: any, payload: any) =>
    commit('setFeedback', payload),
  setCallback: ({ commit }: any, payload: any) =>
    commit('setCallback', payload),
}
