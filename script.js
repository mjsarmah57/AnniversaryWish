// script2.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Element References ---
    const welcomePage = document.getElementById('welcome-page');
    const yesButton = document.getElementById('enter-yes');
    const noButton = document.getElementById('enter-no');
    const datePopup = document.getElementById('date-popup');
    const dateInput = document.getElementById('anniversary-date-input');
    const submitDateButton = document.getElementById('submit-date');
    const anniversaryPage = document.getElementById('anniversary-page');
    const timerDisplay = document.getElementById('relationship-timer');
    const timelineContainer = document.querySelector('.timeline-container');
    const viewGalleryButton = document.getElementById('view-gallery-button');
    const photoGallery = document.getElementById('photo-gallery');
    const galleryGrid = document.querySelector('.gallery-grid');
    const backToAnniversaryButton = document.getElementById('back-to-anniversary');
    const closePopupButton = document.querySelector('.close-popup');
    const dateErrorMessage = document.getElementById('date-error-message');
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    const heartsContainer = document.querySelector('.anniversary-message .hearts-container');
    const bgMusic = document.getElementById('bg-music'); // Get the audio element

    // --- Constants and Variables ---
    const ANNIVERSARY_DATE = "24/02/2022";
    let relationshipStartDate;
    let timelineData = [];
    let photosData = [];  // This will hold the photo data from photos.json

    // --- Event Listeners ---

    yesButton.addEventListener('click', function() {
        datePopup.style.display = 'flex';
        welcomePage.style.display = 'none';
    });

    noButton.addEventListener('click', function() {
        alert("Okay, my love! We'll be here whenever you're ready.");
    });

    closePopupButton.addEventListener('click', () => {
        datePopup.style.display = 'none';
        welcomePage.style.display = 'flex';
    });

    submitDateButton.addEventListener('click', function() {
        const enteredDate = dateInput.value;
        if (isValidDate(enteredDate)) {
            if (enteredDate === ANNIVERSARY_DATE) {
                relationshipStartDate = parseDate(ANNIVERSARY_DATE);
                datePopup.style.display = 'none';
                anniversaryPage.style.display = 'block';
                startRelationshipTimer();
                createHearts(heartsContainer, 20);
            } else {
                dateErrorMessage.style.display = 'block';
            }
        } else {
            dateErrorMessage.style.display = 'block';
        }
    });

    viewGalleryButton.addEventListener('click', function() {
        anniversaryPage.style.display = 'none';
        photoGallery.style.display = 'block';
        // createFilterButtons and displayPhotos are now called AFTER data is fetched.
        createConfetti(document.querySelector('.gallery-page .confetti-container'), 50);
    });

    backToAnniversaryButton.addEventListener('click', function() {
        photoGallery.style.display = 'none';
        anniversaryPage.style.display = 'block';
    });

    // --- Audio Control ---

    function playBackgroundMusic() {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
            })
            .catch(error => {
                console.error("Error playing music:", error);
                // Handle autoplay restrictions (see below)
            });
    }

    // --- Initialization ---

    function initialize() {
        relationshipStartDate = parseDate(ANNIVERSARY_DATE);

        timelineData = [
           { year: 2022, title: "Our First Chapter", description: "The magical beginning of our journey together." },
            { year: 2023, title: "Adventures Abroad", description: "Exploring new horizons and making unforgettable memories." },
            { year: 2024, title: "Building Our Nest", description: "Creating a home filled with love, laughter, and dreams." }
        ];
        createTimeline();

        // Fetch photo data from JSON file
        fetch('photos.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                photosData = data;
                createFilterButtons(); // Create filter buttons *after* data is loaded
                displayPhotos('all');   // Display photos *after* data is loaded
            })
            .catch(error => {
                console.error('Error fetching photo data:', error);
                galleryGrid.innerHTML = '<p>Error loading photos. Please try again later.</p>';
            });

        createStars(document.querySelector('.welcome-container .starry-bg'), 50);
        createStars(document.querySelector('.main-page .starry-bg'), 50);
        createStars(document.querySelector('.gallery-page .starry-bg'), 50);
      createConfetti(document.querySelector('.welcome-container .confetti-container'), 50); // Welcome page confetti
    }


    // --- Helper Functions ---

    function isValidDate(dateString) {
        const regEx = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateString.match(regEx)) return false;

        const [day, month, year] = dateString.split('/');
        const d = new Date(year, month - 1, day);
        return d.getFullYear() == year && d.getMonth() == month - 1 && d.getDate() == day;
    }

    function parseDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    }

    function startRelationshipTimer() {
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (!relationshipStartDate) {
            timerDisplay.textContent = "Our Time Together: ...";
            return;
        }
        const now = new Date();
        const diff = now.getTime() - relationshipStartDate.getTime();

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        timerDisplay.textContent = `Our Time Together: ${years} Years, ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
    }

  function createTimeline() {
        timelineContainer.innerHTML = '';
        timelineData.sort((a, b) => a.year - b.year);

        timelineData.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.classList.add('timeline-item');
            timelineItem.innerHTML = `
                <div class="year">${item.year}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            timelineContainer.appendChild(timelineItem);
        });
    }
    function createFilterButtons() {
        filterButtonsContainer.innerHTML = '';
        const years = [...new Set(photosData.map(photo => photo.year))];
        years.sort();

        const allButton = document.createElement('button');
        allButton.textContent = 'All';
        allButton.setAttribute('data-year', 'all');
        allButton.classList.add('btn');
        allButton.addEventListener('click', () => displayPhotos('all')); // Simplified
        filterButtonsContainer.appendChild(allButton);

        years.forEach(year => {
            const button = document.createElement('button');
            button.textContent = year;
            button.setAttribute('data-year', year);
            button.classList.add('btn');
            button.addEventListener('click', () => displayPhotos(year)); // Simplified
            filterButtonsContainer.appendChild(button);
        });
    }
    function displayPhotos(year) {
        galleryGrid.innerHTML = ''; // Clear previous photos
        const filteredPhotos = (year === 'all') ? photosData : photosData.filter(photo => photo.year === year);

        filteredPhotos.forEach(photo => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.alt;
            galleryItem.appendChild(img);

            const infoOverlay = document.createElement('div');
            infoOverlay.classList.add('gallery-item-info');

            const dateElement = document.createElement('p');
            dateElement.classList.add('gallery-item-date');
            dateElement.textContent = photo.date || '';
            infoOverlay.appendChild(dateElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('gallery-item-description');
            descriptionElement.textContent = photo.alt || '';
            infoOverlay.appendChild(descriptionElement);

            galleryItem.appendChild(infoOverlay);
            galleryGrid.appendChild(galleryItem);
        });
    }
    function createStars(container, numStars) {
        if (!container) {
            console.error("createStars: Container not found.");
            return;
        }
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3 + 1}px`; // Vary star size
            star.style.height = star.style.width;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`; // Vary animation speed
            container.appendChild(star);
        }
    }

     function createHearts(container, numHearts) {
        if(!container){
            console.error("createHearts: Container not found.");
            return;
        }
        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('i'); // Use <i> for Font Awesome
            heart.classList.add('fas', 'fa-heart', 'heart'); // Add Font Awesome classes
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heart.style.transform = `scale(${Math.random()})`;
            container.appendChild(heart);

            // Set CSS variables for animation
            heart.style.setProperty('--x-end', `${(Math.random() - 0.5) * 500}px`); // -250px to 250px
            heart.style.setProperty('--rotate', `${(Math.random() * 360) - 180}deg`);
        }
    }

      function createConfetti(container, numConfetti) {
          if(!container){
             console.error("createConfetti: Container not found.");
            return;
          }
        for (let i = 0; i < numConfetti; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = `-10px`; // Start above the viewport
             confetti.style.backgroundColor = getRandomColor(); // Get a random color
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`; // Vary animation duration

              // Set CSS variables for animation.  Key change!
            confetti.style.setProperty('--x-offset', `${(Math.random() * 200) - 100}px`); // -100 to 100
            confetti.style.setProperty('--x-offset-end', `${(Math.random() * 400) - 200}px`);//-200 to 200
            confetti.style.setProperty('--angle', `${Math.random() * 360}deg`);
            confetti.style.setProperty('--angle-end', `${(Math.random() * 720) - 360}deg`);

            container.appendChild(confetti);
             // Add a class for different colors
            const colorClass = 'c' + Math.floor(Math.random() * 5 + 1); // c1, c2, c3, c4, or c5
            confetti.classList.add(colorClass);
        }
    }

    function getRandomColor() {
        const colors = ['#f06292', '#ba68c8', '#ffd54f', '#4fc3f7', '#81c784']; // Example colors
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // --- Initialize ---
    initialize(); // Call initialize to start the process
});