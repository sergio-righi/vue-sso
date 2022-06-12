import Cookies from 'js-cookie'
import VuexPersistence from "vuex-persist";

export default ({ store }: any) => {
  new VuexPersistence({
    key: 'j5b63kl5b6345jb456l4k', storage: navigator.cookieEnabled ? {
      getItem: (key: any) => {
        const value = Cookies.get(key);
        return value ? JSON.parse(String(value)) : null
      },
      setItem: (key: any, value: any): any => Cookies.set(key, JSON.stringify(value), { expires: 3, secure: true }),
      removeItem: (key: any) => Cookies.remove(key)
    } as any : window.sessionStorage
  }).plugin(store);
};
