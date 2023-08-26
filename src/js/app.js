import { PixabayAPI } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const pixabayApi = new PixabayAPI(40);

const refs = {
  form: document.querySelector('.search-form'),
  container: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-btn'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onSubmit(evt) {
  searchBtnAddHidden();
  evt.preventDefault();
  const searchQuery = evt.target.elements.searchQuery.value.trim();
  pixabayApi.resetPage();
  if (!searchQuery) {
    Notify.warning(`Specify search criteria.`);
    searchBtnRemoveHidden();

    return;
  }

  pixabayApi.query = searchQuery;

  try {
    const response = await pixabayApi.getPhotosByQuery().then();

    if (response.data.totalHits <= 0) {
      Notify.warning(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      searchBtnRemoveHidden();
      loadMoreBtnAddHidden();

      return;
    }
    Notify.success(
      `Hooray! We found totalHits ${response.data.totalHits} images.`
    );
    searchBtnRemoveHidden();

    const markup = createMarkup(response.data.hits).join(' ');
    refs.container.innerHTML = markup;

    lightbox.refresh();

    if (response.data.totalHits < pixabayApi.perPage) {
      loadMoreBtnAddHidden();
      return;
    }

    loadMoreBtnRemoveHidden();
  } catch (error) {
    console.error(error);
    Notify.failure(`message: ${error}; code: ${error.code}`);
    searchBtnRemoveHidden();
  }
}

async function onLoadMoreBtn(evt) {
  pixabayApi.page += 1;
  const response = await pixabayApi.getPhotosByQuery().then();

  if (response.data.hits.length < pixabayApi.perPage) {
    Notify.warning(`Sorry, it's all...`);

    loadMoreBtnAddHidden();
  }

  const markup = createMarkup(response.data.hits).join(' ');
  refs.container.insertAdjacentHTML('beforeend', markup);
}

function createMarkup(arr) {
  return arr.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<li class='photo-card'>
    <a href='${largeImageURL}'>
      <img src='${webformatURL}' alt='${tags}' loading='lazy' />
    </a>
    <div class='info'>
      <p class='info-item'>
        <b>Likes ${likes}</b>
      </p>
      <p class='info-item'>
        <b>Views ${views}</b>
      </p>
      <p class='info-item'>
        <b>Comments ${comments}</b>
      </p>
      <p class='info-item'>
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </li>`;
    }
  );
}

function searchBtnAddHidden() {
  refs.searchBtn.classList.add('is-hidden');
}

function searchBtnRemoveHidden() {
  refs.searchBtn.classList.remove('is-hidden');
}

function loadMoreBtnAddHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function loadMoreBtnRemoveHidden() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
