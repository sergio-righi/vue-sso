
export default ({ error, query, redirect, store }: any) => {
  const hasCallback = query.callback;
  const isAuthenticated = store.getters.isAuthenticated
  if (isAuthenticated && hasCallback) {
    return redirect(query.callback)
  } else if (isAuthenticated) {
    error({ statusCode: 400 })
  }
}