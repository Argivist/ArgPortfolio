document.addEventListener("DOMContentLoaded", () => {
  // Path to your CSV file
  const csvPath = 'data/items.csv';

  // Fetch the CSV file
  fetch(csvPath)
    .then(response => response.text())
    .then(csvText => {
      // Parse CSV using PapaParse (with header: true)
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const data = results.data;
          // For each row in the CSV, create a preview box
          data.forEach(row => {
            createPreview(row);
          });
        },
        error: function(err) {
          console.error("Error parsing CSV:", err);
        }
      });
    })
    .catch(error => console.error("Error fetching CSV:", error));
});

/**
 * Creates a preview box element from a CSV row.
 * @param {Object} row - A row object from the CSV with keys: mainImage, header, description, otherImagesFolder.
 */
// function createPreview(row) {
//   // Create the container for the preview box
//   const previewBox = document.createElement('div');
//   previewBox.classList.add('preview-box');

//   // Create header element
//   const previewHeader = document.createElement('div');
//   previewHeader.classList.add('preview-header');
//   previewHeader.textContent = row.header;
  
//   // Create the image element
//   const previewImage = document.createElement('img');
//   // Adjust the image path if necessary
//   previewImage.src = `content/${row.mainImage}/main.jpg`;
//   previewImage.alt = row.header;
  
//   // Append header and image to the preview box
//   previewBox.appendChild(previewHeader);
//   previewBox.appendChild(previewImage);
  
//   // Add click event listener to open the modal
//   previewBox.addEventListener('click', () => {
//     openModal(row);
//   });
  
//   // Append the preview box to a container on the page.
//   // Make sure you have a container with id "previews" in your HTML.
//   document.getElementById('previews').appendChild(previewBox);
// }
function createPreview(row) {
  const previewBox = document.createElement('div');
  previewBox.classList.add('preview-box');

  let mediaElement;
  if (row.mediaType === 'video') {
    mediaElement = document.createElement('video');
    mediaElement.classList.add('preview-video');
    mediaElement.muted = true;
    mediaElement.loop = true;
    mediaElement.autoplay = true;
    const source = document.createElement('source');
    source.src = `content/${row.mainMedia}/main.${row.format}`; // video path
    source.type = 'video/mp4';
    mediaElement.appendChild(source);
  } else {
    mediaElement = document.createElement('img');
    mediaElement.classList.add('preview-image');
    mediaElement.src = `content/${row.mainMedia}/main.jpg`;
    mediaElement.alt = row.header;
  }
  previewBox.appendChild(mediaElement);

  const previewHeader = document.createElement('div');
  previewHeader.classList.add('preview-header');
  previewHeader.textContent = row.header;
  previewBox.appendChild(previewHeader);

  previewBox.addEventListener('click', () => {
    openModal(row);
  });
  document.getElementById('previews').appendChild(previewBox);
}

/**
 * Opens a modal window displaying the expanded image and sidebar.
 * @param {Object} row - The CSV row data.
//  */
// function openModal(row) {
//   // Create the modal container
//   const modal = document.createElement('div');
//   modal.classList.add('modal');

//   // Create modal content container
//   const modalContent = document.createElement('div');
//   modalContent.classList.add('modal-content');

//   // Create the close button
//   const closeBtn = document.createElement('span');
//   closeBtn.classList.add('close');
//   closeBtn.innerHTML = '&times;';
//   closeBtn.addEventListener('click', () => {
//     modal.style.display = 'none';
//     modal.remove();
//   });
//   modalContent.appendChild(closeBtn);

//   // Create the image container for the main image
//   const imageContainer = document.createElement('div');
//   imageContainer.classList.add('modal-image-container');
//   const modalImage = document.createElement('img');
//   modalImage.classList.add('modal-image');
//   modalImage.src = `content/${row.mainImage}/main.jpg`;
//   modalImage.alt = row.header;
//   imageContainer.appendChild(modalImage);
//   modalContent.appendChild(imageContainer);

//   // Create the sidebar for header, description, and extra images
//   const modalSidebar = document.createElement('div');
//   modalSidebar.classList.add('modal-sidebar');
  
//   // Sidebar Header
//   const sidebarHeader = document.createElement('h2');
//   sidebarHeader.textContent = row.header;
//   modalSidebar.appendChild(sidebarHeader);
  
//   // Description
//   const descriptionDiv = document.createElement('div');
//   descriptionDiv.classList.add('modal-description');
//   const descriptionPara = document.createElement('p');
//   descriptionPara.textContent = row.description;
//   descriptionDiv.appendChild(descriptionPara);
//   modalSidebar.appendChild(descriptionDiv);
  
//   // Extra Images Container
//   const extraImagesContainer = document.createElement('div');
//   extraImagesContainer.classList.add('extra-images-container');
//   // Load extra images recursively
//   loadExtraImages(row.otherImagesFolder, 1, extraImagesContainer);
  
//   // Append the extra images container to the sidebar
//   modalSidebar.appendChild(extraImagesContainer);
//   modalContent.appendChild(modalSidebar);

//   // Append the modal content to the modal container
//   modal.appendChild(modalContent);
//   // Append the modal to the body
//   document.body.appendChild(modal);

//   // Display the modal
//   modal.style.display = 'block';

//   // Optional: Close the modal when clicking outside of the modal content
//   modal.addEventListener('click', (event) => {
//     if (event.target === modal) {
//       modal.style.display = 'none';
//       modal.remove();
//     }
//   });
// }
function openModal(row) {
  // Create the modal container
  const modal = document.createElement('div');
  modal.classList.add('modal');

  // Create modal content container
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Create the close button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.remove();
  });
  modalContent.appendChild(closeBtn);

  // Create the media container for the main media (image or video)
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('modal-image-container');

  // Check the media type: if "video", create a video element; otherwise, create an image element
  if (row.mediaType && row.mediaType.toLowerCase() === 'video') {
    const modalVideo = document.createElement('video');
    modalVideo.classList.add('modal-video');
    modalVideo.controls = true;
    // Adjust the path as needed (e.g., folder and file name)
    const source = document.createElement('source');
    source.src = `content/${row.mainMedia}/main.mp4`;
    source.type = 'video/mp4';
    modalVideo.appendChild(source);
    mediaContainer.appendChild(modalVideo);
  } else {
    const modalImage = document.createElement('img');
    modalImage.classList.add('modal-image');
    // Adjust the path as needed (e.g., folder and file name)
    modalImage.src = `content/${row.mainMedia}/main.jpg`;
    modalImage.alt = row.header;
    mediaContainer.appendChild(modalImage);
  }
  modalContent.appendChild(mediaContainer);

  // Create the sidebar for header, description, and extra images
  const modalSidebar = document.createElement('div');
  modalSidebar.classList.add('modal-sidebar');

  // Sidebar Header
  const sidebarHeader = document.createElement('h2');
  sidebarHeader.textContent = row.header;
  modalSidebar.appendChild(sidebarHeader);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('modal-description');
  const descriptionPara = document.createElement('p');
  descriptionPara.textContent = row.description;
  descriptionDiv.appendChild(descriptionPara);
  modalSidebar.appendChild(descriptionDiv);

  // Extra Images Container (remains unchanged)
  const extraImagesContainer = document.createElement('div');
  extraImagesContainer.classList.add('extra-images-container');
  loadExtraImages(row.otherImagesFolder, 1, extraImagesContainer);
  modalSidebar.appendChild(extraImagesContainer);

  modalContent.appendChild(modalSidebar);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Display the modal
  modal.style.display = 'block';

  // Optional: Close the modal when clicking outside of the modal content
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      modal.remove();
    }
  });
}

/**
 * Recursively attempts to load extra images from the specified folder.
 * Stops when an image fails to load.
 * @param {string} folder - The folder containing extra images.
 * @param {number} index - The current image index to attempt.
 * @param {HTMLElement} container - The container to which extra images are appended.
 */
function loadExtraImages(folder, index, container) {
  const img = new Image();
  img.classList.add('extra-image');
  img.src = `content/${folder}/${index}.jpg`;
  img.alt = `Extra image ${index}`;
  
  // If the image loads, append it and try the next one
  img.onload = () => {
    container.appendChild(img);
    // Recursively attempt to load the next image
    loadExtraImages(folder, index + 1, container);
  };
  
  // If the image fails to load, stop the recursion
  img.onerror = () => {
    console.log(`No image found at content/${folder}/${index}.jpg, stopping extra images load.`);
  };
}
