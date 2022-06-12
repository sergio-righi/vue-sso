import { initializeAxios } from '@/utils/api'

const accessor: any = ({ $axios, store }: any) => {
  initializeAxios($axios)

  // const authToken = store.getters.getToken;

  $axios.onRequest((config: any) => {
    config.headers.common.Authorization = store.getters.getToken
  })

  // $axios.onRequest((config: any) => {
  //   config.headers.common.Authorization = "D2GZvPTl8c5GAQX8ZyvOlq72Jnukl5Tu"
  // })

  // axios error handler
  $axios.onError((error: any) => {
    if (error.response === undefined) {
      console.log('Network Error: Please refresh and try again.');
      throw error
    }
    throw error
  })
}

export default accessor