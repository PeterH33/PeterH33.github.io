const BATCH_SIZE = 12;
let allImages = [];
let currentIndex = 0;

const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeModalBtn = document.getElementById('modal-close');


// loading indicator creation via js, not sure if here or in html atm
const loadingIndicator = document.createElement("div");
loadingIndicator.id = "loading-indicator";
loadingIndicator.textContent = "Loading more photos...";
loadingIndicator.style.textAlign = "center";
loadingIndicator.style.padding = "1em";
loadingIndicator.style.color = "#777";
document.body.appendChild(loadingIndicator);


function openModal(filename, caption) {
  modal.style.display = "block";
  modalImg.src = `photos/${filename}`;
  modalCaption.textContent = caption;
}

function closeModal() {
  modal.style.display = "none";
  modalImg.src = "";
  modalCaption.textContent = "";
}

function loadNextBatch() {
  const batch = allImages.slice(currentIndex, currentIndex + BATCH_SIZE);

  for (const item of batch) {
    const div = document.createElement("div");
    div.className = "gallery-item";

    const img = document.createElement("img");
    img.src = `photos/${item.filename}`;
    img.alt = item.caption;
    img.loading = "lazy";

    div.appendChild(img);

    div.addEventListener("click", () => {
      openModal(item.filename, item.caption);
    });

    gallery.appendChild(div);
  }

  currentIndex += BATCH_SIZE;

  if (currentIndex >= allImages.length) {
    window.removeEventListener("scroll", onScroll);
    loadingIndicator.style.display = "none";
  }
}

function onScroll() {
  const buffer = 300;
  if ((window.innerHeight + window.scrollY + buffer) >= document.body.offsetHeight) {
    loadNextBatch();
  }
}

fetch("galapagos/descriptions.txt")
  .then(res => res.text())
  .then(text => {
    allImages = text
      .trim()
      .split("\n")
      .map(line => {
        const [filename, caption] = line.split("|");
        return {
          filename: filename.trim(),
          caption: caption ? caption.trim() : ""
        };
      });

    loadNextBatch();
    window.addEventListener("scroll", onScroll);
  });

// Modal close events
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// OLD system
// async function loadGallery() {
//   try {
//     const descRes = await fetch('galapagos/descriptions.txt');
//     const descText = await descRes.text();
//     const descriptions = {};

//     descText.split('\n').forEach(line => {
//       const [filename, desc] = line.trim().split('|');
//       if (filename && desc) descriptions[filename.trim()] = desc.trim();
//     });

//     const photoList = Object.keys(descriptions);

//     photoList.forEach(filename => {
//       const imgSrc = `galapagos/photos/${filename}`;
//       const caption = descriptions[filename];

//       const item = document.createElement('div');
//       item.className = 'gallery-item';

//       const img = document.createElement('img');
//       img.src = imgSrc;
//       img.alt = caption;
//       img.loading = 'lazy';

//       const cap = document.createElement('div');
//       cap.className = 'caption';
//       cap.textContent = caption;

//       item.appendChild(img);
//       item.appendChild(cap);
//       gallery.appendChild(item);

//       // Click to open modal
//       item.addEventListener('click', () => {
//         modal.style.display = 'block';
//         modalImg.src = imgSrc;
//         modalCaption.textContent = caption;
//       });
//     });
//   } catch (err) {
//     gallery.innerHTML = "<p>Error loading gallery. Make sure descriptions.txt is present.</p>";
//     console.error(err);
//   }
// }

// // Modal close
// closeModalBtn.onclick = () => modal.style.display = 'none';
// modal.onclick = (e) => {
//   if (e.target === modal) modal.style.display = 'none';
// };

// loadGallery();