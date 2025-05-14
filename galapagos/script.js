const galleryEl = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeBtn = document.getElementById('modal-close');

async function loadGallery() {
  try {
    const descRes = await fetch('galapagos/descriptions.txt');
    const descText = await descRes.text();
    const descriptions = {};

    descText.split('\n').forEach(line => {
      const [filename, desc] = line.trim().split('|');
      if (filename && desc) descriptions[filename.trim()] = desc.trim();
    });

    const photoList = Object.keys(descriptions);

    photoList.forEach(filename => {
      const imgSrc = `galapagos/photos/${filename}`;
      const caption = descriptions[filename];

      const item = document.createElement('div');
      item.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = caption;
      img.loading = 'lazy';

      const cap = document.createElement('div');
      cap.className = 'caption';
      cap.textContent = caption;

      item.appendChild(img);
      item.appendChild(cap);
      galleryEl.appendChild(item);

      // Click to open modal
      item.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = imgSrc;
        modalCaption.textContent = caption;
      });
    });
  } catch (err) {
    galleryEl.innerHTML = "<p>Error loading gallery. Make sure descriptions.txt is present.</p>";
    console.error(err);
  }
}

// Modal close
closeBtn.onclick = () => modal.style.display = 'none';
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

loadGallery();