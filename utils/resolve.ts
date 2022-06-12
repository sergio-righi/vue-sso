
const controller = {
  auth: {
    home: '/',
    login: '/login',
    register: '/register',
    password: '/forget-password',
    authorization: '/authorization'
  }
}

const Resolve = (localePath: Function) => ({

  // authentication

  home: (...args: any[]) => localePath({ path: controller.auth.home + args.join('/') }),
  login: (...args: any[]) => localePath({ path: controller.auth.login + args.join('/') }),
  register: (...args: any[]) => localePath({ path: controller.auth.register + args.join('/') }),
  password: (...args: any[]) => localePath({ path: controller.auth.password + args.join('/') }),
  authorization: (...args: any[]) => localePath({ path: controller.auth.authorization + args.join('/') }),

  image: {

    root: (name: string) => {
      return `/${name}`
    }
  }

});

export const initializeResolve = (localePath: Function) => ({
  ...Resolve(localePath)
});