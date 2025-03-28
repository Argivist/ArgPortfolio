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
  function createPreview(row) {
    // Create the container for the preview box
    const previewBox = document.createElement('div');
    previewBox.classList.add('preview-box');
  
    // Create header element
    const previewHeader = document.createElement('div');
    previewHeader.classList.add('preview-header');
    previewHeader.textContent = row.header;
    
    // Create the image element
    const previewImage = document.createElement('img');
    // Adjust the image path if necessary
    // previewImage.src = `../img/${row.mainImage}`;
    previewImage.src = `content/${row.mainImage}`;
    previewImage.alt = row.header;
    
    // Append header and image to the preview box
    previewBox.appendChild(previewHeader);
    previewBox.appendChild(previewImage);
    
    // Add click event listener to open the modal
    previewBox.addEventListener('click', () => {
      openModal(row);
    });
    
    // Append the preview box to a container on the page.
    // Make sure you have a container with id "previews" in your HTML.
    document.getElementById('previews').appendChild(previewBox);
  }
  
  /**
   * Opens a modal window displaying the expanded image and sidebar.
   * @param {Object} row - The CSV row data.
   */
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
  
    // Create the image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('modal-image-container');
    const modalImage = document.createElement('img');
    modalImage.classList.add('modal-image');
    modalImage.src = `content/${row.mainImage}`;
    modalImage.alt = row.header;
    imageContainer.appendChild(modalImage);
    modalContent.appendChild(imageContainer);
  
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
    
    // Extra Images Container
    // Assume three images with filenames 1.jpg, 2.jpg, and 3.jpg in the folder specified by row.otherImagesFolder.
    const extraImagesContainer = document.createElement('div');
    extraImagesContainer.classList.add('extra-images-container');
    
    // Modify the number of images or naming convention as needed.
    const numExtraImages = 3;
    for (let i = 1; i <= numExtraImages; i++) {
      const extraImg = document.createElement('img');
      // Construct the src using the folder name from the CSV row.
      extraImg.src = `content/${row.otherImagesFolder}/${i}.jpg`;
      extraImg.alt = `${row.header} - extra image ${i}`;
      extraImg.classList.add('extra-image');
      extraImagesContainer.appendChild(extraImg);
    }
    
    // Append the extra images container to the sidebar
    modalSidebar.appendChild(extraImagesContainer);
    modalContent.appendChild(modalSidebar);
  
    // Append the modal content to the modal container
    modal.appendChild(modalContent);
    // Append the modal to the body
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
  