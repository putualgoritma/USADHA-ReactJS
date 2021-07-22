import axios from 'axios';
const cancelToken = axios.CancelToken
const source = cancelToken.source()

export const Source = source;
// export const RootPath = 'https://cors-anywhere.herokuapp.com/' +  process.env.REACT_APP_BASE_URL;
export const RootPath = process.env.REACT_APP_BASE_URL;
export const OnlineRoot = '';
