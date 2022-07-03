import Cookies from 'js-cookie'
import VuexPersistence from 'vuex-persist'

export default ({ store, $config: { cookieKey } }: any) => {
  new VuexPersistence({
    key: cookieKey,
    storage: navigator.cookieEnabled
      ? ({
          getItem: (key: any) => {
            const value = Cookies.get(key)
            return value ? JSON.parse(String(value)) : null
          },
          setItem: (key: any, value: any): any =>
            Cookies.set(key, JSON.stringify(value), {
              expires: 3,
              secure: true,
            }),
          removeItem: (key: any) => Cookies.remove(key),
        } as any)
      : window.sessionStorage,
  }).plugin(store)
}
