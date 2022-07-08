import Cookies from 'js-cookie'

export default {
  setUser: (state: any, { user, key }: any) => {
    if (user) {
      Cookies.set(key, JSON.stringify(user), {
        secure: true,
        expires: 3,
      })
    } else {
      Cookies.remove(key)
    }
    state.sso = user
  },
  setToken: (state: any, payload: any) => (state.token = payload),
  setFeedback: (state: any, payload: any) => (state.feedback = payload),
  setCallback: (state: any, payload: any) => (state.callback = payload),
}
