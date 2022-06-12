
export default ({ error, query, store }: any) => {
  const hasCallback = !!(query.callback || store.getters.getCallback);
  if (!hasCallback) {
    error({
      statusCode: 500,
      msg: 'something went wrong'
    })
  }
}