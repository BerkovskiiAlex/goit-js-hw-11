export function generatePhotoCards(hits) {
  return hits
    .map(image => {
      return `<div class="gallery__item">
  <a class="gallery__link" href="${image.largeImageURL}">
      <img class="gallery__image" src="${image.webformatURL}" data-source="${image.webformatURL}" alt="${image.tags}" title=""/>
  </a>
  <div class="info">
      <p class="info-item">Likes
          <b>${image.likes}</b>
      </p>
      <p class="info-item">Views
          <b>${image.views}</b>
      </p>
      <p class="info-item">Comments
          <b>${image.comments}</b>
      </p>
      <p class="info-item">Downloads
          <b>${image.downloads}</b>
      </p>
  </div>
</div>`;
    })
    .join('');
}
