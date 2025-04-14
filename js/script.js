document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel-item img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        const smallSrc = src.replace(/(\.[a-z]+)$/, '-small$1');
        if (window.innerWidth < 992) {
            img.setAttribute('src', smallSrc);
        }
    });

    // Load More functionality for wedding gallery
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (loadMoreBtn && galleryGrid) {
        // Calculate items per row based on screen width and grid layout
        const getItemsPerRow = () => {
            const width = window.innerWidth;
            if (width <= 576) return 2;
            if (width <= 768) return 4;
            return 6;
        };

        let itemsPerRow = getItemsPerRow();
        const hiddenItems = Array.from(galleryGrid.querySelectorAll('.gallery-item.hidden'));

        // If there are no hidden items, hide the button
        if (hiddenItems.length === 0) {
            loadMoreBtn.style.display = 'none';
            return;
        }

        loadMoreBtn.addEventListener('click', function() {
            // Get all remaining hidden items
            const currentHiddenItems = Array.from(galleryGrid.querySelectorAll('.gallery-item.hidden'));
            
            // Show 3 rows of items
            for (let row = 0; row < 3; row++) {
                let totalWidthUnits = 0;
                let itemsToShow = [];
                
                for (let item of currentHiddenItems) {
                    if (item.classList.contains('hidden')) {  // Only process items that are still hidden
                        const isLarge = item.classList.contains('large');
                        const isHorizontal = item.classList.contains('horizontal');
                        const isVertical = item.classList.contains('vertical');
                        
                        // Calculate width units this item will take
                        let widthUnits = isLarge ? 3 : (isHorizontal ? 2 : 1);
                        
                        // If adding this item would exceed the row width, skip to next row
                        if (totalWidthUnits + widthUnits > itemsPerRow) {
                            break;
                        }
                        
                        totalWidthUnits += widthUnits;
                        itemsToShow.push(item);
                        
                        // If we've filled the row exactly, move to next row
                        if (totalWidthUnits === itemsPerRow) {
                            break;
                        }
                    }
                }
                
                // Show the items in this row
                itemsToShow.forEach(item => {
                    item.classList.remove('hidden');
                });
            }

            // Check if there are any hidden items left
            const remainingHiddenItems = galleryGrid.querySelectorAll('.gallery-item.hidden');
            if (remainingHiddenItems.length === 0) {
                loadMoreBtn.style.display = 'none';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            const newItemsPerRow = getItemsPerRow();
            if (newItemsPerRow !== itemsPerRow) {
                itemsPerRow = newItemsPerRow;
            }
        });
    }

    // Modal functionality
    const modal = document.querySelector("#bookSessionModal");
    const trigger = document.querySelector("#bookSessionTrigger");
    const closeButton = document.querySelector(".close-button");

    if (!modal || !trigger || !closeButton) {
        console.error("Modal elements not found");
        return;
    }

    // Toggle modal visibility
    const toggleModal = () => {
        modal.classList.toggle("show-modal");
    };

    // Close modal when clicking outside
    const windowOnClick = (event) => {
        if (event.target === modal) {
            toggleModal();
        }
    };

    // Event listeners for modal
    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);

    // Form validation for all forms with 'needs-validation' class
    (function () {
        'use strict'

        // Validation patterns
        const patterns = {
            phone: '^(?:(?:\\+44)|(?:0))(?:(?:(?:7(?:[1-4]\\d\\d|5(?:[0-5]\\d|6[0-9]|7[0-3]|74|75|79|80|81|82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98|99)|6(?:[0-6]\\d\\d|7(?:[0-57-9]\\d|6[0-7])|8[0-9]\\d|9[0-9]\\d)|8(?:[014-9]\\d\\d|[23]\\d\\d)|9(?:[04-9]\\d\\d|[123]\\d\\d)))|(?:1(?:[02-9]\\d{1,3}|1\\d{1,3})|2\\d{4}|3\\d{4}|4\\d{4}|5\\d{4}|6\\d{4}|8\\d{4}|9\\d{4}))\\d{6}|(?:(?:1624|28)\\d{6}))$',
            email: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        };

        // Custom validation messages
        const messages = {
            phone: 'Please enter a valid UK mobile phone number (e.g., 07123456789 or +447123456789).',
            email: 'Please enter a valid email address (e.g., name@example.com).'
        };

        // Add validation patterns to form inputs
        function addValidationPatterns() {
            const phoneInputs = document.querySelectorAll('input[type="tel"]');
            const emailInputs = document.querySelectorAll('input[type="email"]');

            phoneInputs.forEach(input => {
                input.pattern = patterns.phone;
                input.dataset.validationMessage = messages.phone;
            });

            emailInputs.forEach(input => {
                input.pattern = patterns.email;
                input.dataset.validationMessage = messages.email;
            });
        }

        // Custom validation function
        function validateInput(input) {
            if (input.type === 'tel') {
                const regex = new RegExp(patterns.phone);
                if (!regex.test(input.value)) {
                    input.setCustomValidity(messages.phone);
                    return false;
                }
            } else if (input.type === 'email') {
                const regex = new RegExp(patterns.email);
                if (!regex.test(input.value)) {
                    input.setCustomValidity(messages.email);
                    return false;
                }
            }
            input.setCustomValidity('');
            return true;
        }

        // Initialize validation patterns
        addValidationPatterns();

        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                // Add input event listeners for real-time validation
                form.querySelectorAll('input[type="tel"], input[type="email"]').forEach(input => {
                    input.addEventListener('input', function() {
                        validateInput(this);
                        if (this.checkValidity()) {
                            this.classList.remove('is-invalid');
                            this.classList.add('is-valid');
                        } else {
                            this.classList.remove('is-valid');
                            this.classList.add('is-invalid');
                        }
                    });
                });

                form.addEventListener('submit', function (event) {
                    let isValid = true;
                    
                    // Validate phone and email inputs
                    form.querySelectorAll('input[type="tel"], input[type="email"]').forEach(input => {
                        if (!validateInput(input)) {
                            isValid = false;
                        }
                    });

                    if (!form.checkValidity() || !isValid) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        event.preventDefault();
                        // Get form data
                        const formData = {
                            firstName: form.querySelector('[id$="FirstName"]').value,
                            lastName: form.querySelector('[id$="LastName"]').value,
                            phone: form.querySelector('[id$="Phone"]').value,
                            email: form.querySelector('[id$="Email"]').value,
                            package: form.querySelector('[id$="Package"]')?.value || '',
                            message: form.querySelector('[id$="Message"]').value
                        };
                        
                        // Log form submission (replace with your actual form submission logic)
                        console.log("Form submitted:", formData);
                        
                        // Reset form
                        form.reset();
                        form.classList.remove('was-validated');
                        
                        // Show success message
                        alert("Thank you for your message! We'll contact you soon.");
                        
                        // If this is the booking form, close the modal
                        if (form.id === 'bookingForm') {
                            modal.classList.remove('show-modal');
                        }
                    }
                    form.classList.add('was-validated');
                }, false);
            });
    })();

    // Lightbox Gallery functionality
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    let galleryImages = [];

    // Get all gallery images
    function updateGalleryImages() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img'));
    }

    // Open lightbox
    function openLightbox(image, index) {
        updateGalleryImages();
        currentImageIndex = index;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Navigate to previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        const prevImage = galleryImages[currentImageIndex];
        lightboxImage.src = prevImage.src;
        lightboxImage.alt = prevImage.alt;
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        const nextImage = galleryImages[currentImageIndex];
        lightboxImage.src = nextImage.src;
        lightboxImage.alt = nextImage.alt;
    }

    // Add click event listeners to all gallery images
    document.querySelectorAll('.gallery-item img').forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(img, index));
    });

    // Event listeners for lightbox controls
    if (lightbox) {
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'Escape':
                    closeLightbox();
                    break;
            }
        });

        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});
