import axios, {AxiosResponse} from 'axios';
axios.defaults.baseURL = 'https://www.gutenberg.org';

const responseBody = (response: AxiosResponse) => response.data;
const sleep = (ms: number) => (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url:string) => axios.get(url).then(responseBody),
}
const requestHandler = {
    directoryListings: (book:string) => requests.get(`/files/${book}/`),
    bookContent: (book:string) => requests.get(`${book}`),
}
export default {
    requestHandler
}