import { PixabayAPI } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayAPI(40);

// pixabayApi.getPhotosByQuery().then(console.log);

const refs = {
  form: document.querySelector('.search-form'),
  container: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onSubmit(evt) {
  evt.preventDefault();
  const searchQuery = evt.target.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return alert('empty');
  }

  pixabayApi.query = searchQuery;
  pixabayApi.page = 1;

  try {
    const response = await pixabayApi.getPhotosByQuery();
    // console.log(response);
    alert(`Hooray! We found totalHits ${response.data.totalHits} images.`);
    const markup = createMarkup(response.data.hits).join(' ');
    refs.container.innerHTML = markup;

    lightbox.refresh();

    if (response.data.totalHits < pixabayApi.perPage) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }

    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.error(error);
    //   Добавить сообщение
  }
}

function onLoadMoreBtn(ent) {}

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
