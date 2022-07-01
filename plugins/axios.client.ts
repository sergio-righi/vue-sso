import { initializeAxios } from '@/utils/api'

const accessor: any = ({ $axios, store, $config: { apiKey } }: any) => {
  initializeAxios($axios)

  $axios.onRequest((config: any) => {
    config.headers.common.Authorization = [apiKey, store.getters.getToken].filter(Boolean).join('&');
  })

  $axios.onError((error: any) => {
    if (error.response === undefined) {
      console.log('Network Error: Please refresh and try again.')
      throw error
    }
    throw error
  })
}

export default accessor
