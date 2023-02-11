export const useHTTPOptions = {
  responseType: 'json',
  url: 'https://apieczane.afetharita.com/api',
  // url: 'http://localhost:8080/api',
  interceptors: {
    // every time we make an http request, this will run 1st before the request is made
    // url, path and route are supplied to the interceptor
    // request options can be modified and must be returned
    request: async ({ options, url, path, route }) => {
      const token = localStorage.getItem('token')
      if (token && token?.length > 0) options.headers.Authorization = `${token}`
      return options
    },
  }
}
