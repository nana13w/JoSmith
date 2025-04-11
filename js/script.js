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
        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
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
});
