document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Light / Dark Theme Management
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        themeIcon.className = 'fa-solid fa-moon';
    }
    
    // Toggle action
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });

    /* ==========================================================================
       2. Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.fade-in-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       3. Stat Counters Animation
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500; // ms
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        const timer = setInterval(() => {
            current += 1;
            el.textContent = current;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, stepTime);
    };
    
    const statsSection = document.querySelector('.card-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => animateCounter(num));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       4. Dynamic Career Timeline Progress & Activation
       ========================================================================== */
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineProgressBar = document.getElementById('timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const handleTimelineScroll = () => {
        if (!timelineContainer) return;
        
        const rect = timelineContainer.getBoundingClientRect();
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the timeline has scrolled past the trigger threshold
        // We set the threshold at 65% of the window viewport height
        const triggerPoint = windowHeight * 0.65;
        const scrolledDistance = triggerPoint - rect.top;
        
        let progressPercent = 0;
        if (scrolledDistance > 0) {
            progressPercent = Math.min((scrolledDistance / containerHeight) * 100, 100);
        }
        
        timelineProgressBar.style.height = `${progressPercent}%`;
        
        // Activate timeline nodes based on position
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            // Activate when node passes above the trigger point
            if (itemRect.top < triggerPoint) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };
    
    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll(); // Run initially in case page loaded mid-way

    /* ==========================================================================
       5. Top Navigation Active Sync & Smooth Scrolling
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.hero-navigation .nav-link');
    
    const syncNavActiveItem = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + window.innerHeight * 0.4;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    };
    
    window.addEventListener('scroll', syncNavActiveItem);
    syncNavActiveItem();

    /* ==========================================================================
       6. Contact Form Mock Submission
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('form-submit-btn');
            
            // Disable button and show sending state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending Message...';
            formStatus.className = 'form-status-message';
            formStatus.textContent = '';
            
            const nameValue = document.getElementById('form-name').value;
            const emailValue = document.getElementById('form-email').value;
            const messageValue = document.getElementById('form-message').value;

            // Submit using FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/patriciamww.chang@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameValue,
                    email: emailValue,
                    message: messageValue
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Show success status
                formStatus.classList.add('success');
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent to Patricia.';
                
                // Reset form fields
                contactForm.reset();
                
                // Auto-clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.style.opacity = '1';
                    }, 500);
                }, 5000);
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                formStatus.classList.add('error');
                formStatus.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Oops! Something went wrong. Please try again.';
                console.error('Error submitting form:', error);
            });
        });
    }

    /* ==========================================================================
       7. Map Pin Edit & Save Mode with LocalStorage Persistence
       ========================================================================== */
    const mapContainer = document.querySelector('.map-container');
    const mapPins = document.querySelectorAll('.map-pin');
    
    if (mapContainer && mapPins.length > 0) {
        // Capture default (hardcoded) coordinates for reset capability
        const defaultCoords = {};
        mapPins.forEach(pin => {
            const loc = pin.getAttribute('data-location');
            defaultCoords[loc] = {
                top: pin.style.top,
                left: pin.style.left
            };
        });
        
        // Function to apply coordinates to all pins
        const applyCoordinates = (coords) => {
            mapPins.forEach(pin => {
                const loc = pin.getAttribute('data-location');
                if (coords[loc]) {
                    pin.style.top = coords[loc].top;
                    pin.style.left = coords[loc].left;
                }
            });
        };
        
        // Load and apply saved coordinates from LocalStorage on page load
        const savedCoordsStr = localStorage.getItem('pmc-map-pin-coords');
        if (savedCoordsStr) {
            try {
                const savedCoords = JSON.parse(savedCoordsStr);
                applyCoordinates(savedCoords);
            } catch (e) {
                console.error("Error parsing saved coordinates from LocalStorage:", e);
            }
        }
        
        // Control elements
        const editToggleBtn = document.getElementById('map-edit-toggle-btn');
        const activeActions = document.getElementById('map-edit-active-actions');
        const saveBtn = document.getElementById('map-save-btn');
        const resetBtn = document.getElementById('map-reset-btn');
        const cancelBtn = document.getElementById('map-cancel-btn');
        
        let editMode = false;
        let dragTarget = null;
        let tempCoords = {}; // Stores coordinates before edit session to allow cancel
        
        // Sleek custom toast notification helper
        const showToast = (message, isError = false) => {
            const existingToast = document.querySelector('.map-toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            const toast = document.createElement('div');
            toast.className = 'map-toast';
            if (isError) {
                toast.style.backgroundColor = '#E63946';
            }
            toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${message}</span>`;
            document.body.appendChild(toast);
            
            // Trigger reflow to initialize smooth transition
            toast.offsetHeight;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        };
        
        // Enter edit mode
        const enterEditMode = () => {
            editMode = true;
            mapContainer.classList.add('edit-mode');
            editToggleBtn.style.display = 'none';
            activeActions.style.display = 'flex';
            
            // Capture current coordinates before dragging starts (temp state)
            tempCoords = {};
            mapPins.forEach(pin => {
                const loc = pin.getAttribute('data-location');
                tempCoords[loc] = {
                    top: pin.style.top,
                    left: pin.style.left
                };
            });
            showToast("Edit mode active. Drag pins to reposition.");
        };
        
        // Exit edit mode
        const exitEditMode = () => {
            editMode = false;
            mapContainer.classList.remove('edit-mode');
            editToggleBtn.style.display = 'inline-flex';
            activeActions.style.display = 'none';
            dragTarget = null;
        };
        
        // Event Listeners for Controls
        if (editToggleBtn) editToggleBtn.addEventListener('click', enterEditMode);
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                // Revert all pins to pre-edit coordinates
                applyCoordinates(tempCoords);
                exitEditMode();
                showToast("Edits cancelled.");
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // Gather current locations and serialize to LocalStorage
                const coords = {};
                mapPins.forEach(pin => {
                    const loc = pin.getAttribute('data-location');
                    coords[loc] = {
                        top: pin.style.top,
                        left: pin.style.left
                    };
                });
                localStorage.setItem('pmc-map-pin-coords', JSON.stringify(coords));
                exitEditMode();
                showToast("Layout saved and persisted!");
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm("Are you sure you want to reset all pins to their original calibrated geographic coordinates?")) {
                    localStorage.removeItem('pmc-map-pin-coords');
                    applyCoordinates(defaultCoords);
                    exitEditMode();
                    showToast("Layout reset to default.");
                }
            });
        }
        
        // Core Dragging Logic
        const handleDragMove = (clientX, clientY) => {
            if (!dragTarget) return;
            const mapRect = mapContainer.getBoundingClientRect();
            
            let pctX = ((clientX - mapRect.left) / mapRect.width) * 100;
            let pctY = ((clientY - mapRect.top) / mapRect.height) * 100;
            
            // Constrain pins to stay inside map container boundaries
            pctX = Math.max(0, Math.min(100, pctX));
            pctY = Math.max(0, Math.min(100, pctY));
            
            dragTarget.style.left = `${pctX.toFixed(1)}%`;
            dragTarget.style.top = `${pctY.toFixed(1)}%`;
        };
        
        // Mouse dragging event handlers
        mapContainer.addEventListener('mousedown', (e) => {
            if (!editMode) return;
            const pin = e.target.closest('.map-pin');
            if (!pin) return;
            
            e.preventDefault();
            dragTarget = pin;
            
            const onMouseMove = (moveEvent) => {
                handleDragMove(moveEvent.clientX, moveEvent.clientY);
            };
            
            const onMouseUp = () => {
                dragTarget = null;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // Touch dragging event handlers (mobile support)
        mapContainer.addEventListener('touchstart', (e) => {
            if (!editMode) return;
            const pin = e.target.closest('.map-pin');
            if (!pin) return;
            
            dragTarget = pin;
            
            const onTouchMove = (moveEvent) => {
                if (moveEvent.touches.length > 0) {
                    const touch = moveEvent.touches[0];
                    handleDragMove(touch.clientX, touch.clientY);
                }
            };
            
            const onTouchEnd = () => {
                dragTarget = null;
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
            
            document.addEventListener('touchmove', onTouchMove, { passive: true });
            document.addEventListener('touchend', onTouchEnd);
        });
    }

});
