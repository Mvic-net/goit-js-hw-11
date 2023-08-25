import axios from 'axios';

export class PixabayAPI {
  #BASIC_URL = 'https://pixabay.com/api';
  #API_KEY = '39039602-31d0a00351b79d32f3f661f83';

  constructor(perpage) {
    this.page = 1;
    this.query = null;
    this.perPage = perpage;
  }

  getPhotosByQuery() {
    return axios.get(`${this.#BASIC_URL}/?`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.perPage,
      },
    });
  }

  resetPage() {
    this.page = 1;
  }
}
