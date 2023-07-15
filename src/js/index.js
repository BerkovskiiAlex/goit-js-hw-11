import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { UnsplashApi } from './unsplash-api';
import { generatePhotoCards } from './markup';

const body = document.querySelector('body');
const gallery = body.querySelector('.gallery');
const form = body.querySelector('form');
const loadMore = body.querySelector('.load-more');
form.addEventListener('submit', onSubmit);

const unsplashApi = new UnsplashApi();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const onLoadMoreBtnElClick = async event => {
  try {
    unsplashApi.page += 1;
    const response = await unsplashApi.fetchPhotos();
    const { total, totalHits, hits } = response.data;
    const totalPages = Math.ceil(total / unsplashApi.per_page);
    const photoCards = generatePhotoCards(hits);
    gallery.insertAdjacentHTML('beforeend', photoCards);
    lightbox.refresh();
    if (totalPages === unsplashApi.page) {
      loadMore.classList.add('is-hidden');
      loadMore.removeEventListener('click', onLoadMoreBtnElClick);
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        {
          timeout: 5000,
        }
      );
    }
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 3,
      behavior: 'smooth',
    });
  } catch (err) {
    if (err.response.status === 400) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        {
          timeout: 5000,
        }
      );
      loadMore.classList.add('is-hidden');
      loadMore.removeEventListener('click', onLoadMoreBtnElClick);
    }
    console.log(err);
  }
};

async function onSubmit(event) {
  unsplashApi.page = 1;
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    return;
  }
  unsplashApi.q = searchQuery;
  try {
    const response = await unsplashApi.fetchPhotos();
    const { total, totalHits, hits } = response.data;

    if (hits.length !== 0) {
      Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`, {
        timeout: 5000,
      });
    }
    const totalPages = Math.ceil(total / unsplashApi.per_page);
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`,
        {
          timeout: 5000,
        }
      );
      gallery.innerHTML = '';
      return;
    }
    if (totalPages === 1) {
      const photoCards = generatePhotoCards(hits);
      gallery.innerHTML = photoCards;
      lightbox.refresh();
      loadMore.classList.add('is-hidden');
      loadMore.removeEventListener('click', onLoadMoreBtnElClick);
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        {
          timeout: 5000,
        }
      );
      return;
    }
    const photoCards = generatePhotoCards(hits);
    gallery.innerHTML = photoCards;
    lightbox.refresh();
    loadMore.classList.remove('is-hidden');
    loadMore.addEventListener('click', onLoadMoreBtnElClick);
  } catch (error) {
    console.error(error);
  }
}
