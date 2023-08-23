import axios from 'axios';

export class PixabayAPI {
  #BASIC_URL = 'https://pixabay.com/api';
  #API_KEY = '8383420-2fd3a74e6fa7f1c43c1b3aa8e';

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
}
