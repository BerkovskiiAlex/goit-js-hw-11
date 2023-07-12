import axios from 'axios';

export class UnsplashApi {
  #BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.q = '';
    this.page = 1;
    this.per_page = 40;
  }

  fetchPhotos() {
    const searchParams = {
      key: '38197359-118db2b85359a92f3105f2f8e',
      q: this.q,
      page: this.page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
    };
    return axios.get(`${this.#BASE_URL}?`, {
      params: searchParams,
    });
  }
}
