
export default ({ query, redirect, store }: any) => {
  const isAuthenticated = store.getters.isAuthenticated
  if (isAuthenticated) {
    return redirect(query.redirect)
  }
}