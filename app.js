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
       7. Interactive Map Pin Drag & Drop Coordinate Editor
       ========================================================================== */
    const editBtn = document.getElementById('enable-map-edit');
    const mapContainer = document.querySelector('.map-container');

    if (editBtn && mapContainer) {
        let editMode = false;
        let dragTarget = null;
        
        // Create floating output box
        const outputPanel = document.createElement('div');
        outputPanel.id = 'map-coordinates-panel';
        outputPanel.style.display = 'none';
        outputPanel.innerHTML = `
            <div class="panel-header">
                <h4>Map Coordinates Editor</h4>
                <button id="close-coords-panel" aria-label="Close panel">&times;</button>
            </div>
            <p>Drag any pin on the map. Copy the updated coordinates below:</p>
            <textarea id="coords-output" readonly></textarea>
            <button id="copy-coords-btn" class="btn btn-primary btn-sm"><i class="fa-solid fa-copy"></i> Copy Coordinates</button>
        `;
        document.body.appendChild(outputPanel);
        
        const closeBtn = document.getElementById('close-coords-panel');
        const copyBtn = document.getElementById('copy-coords-btn');
        const textarea = document.getElementById('coords-output');
        
        const updateCoordinatesOutput = () => {
            const pins = mapContainer.querySelectorAll('.map-pin');
            let coordsLines = [];
            pins.forEach(pin => {
                const name = pin.querySelector('h4').textContent;
                const top = pin.style.top;
                const left = pin.style.left;
                coordsLines.push(`/* ${name} */\ntop: ${top}; left: ${left};`);
            });
            textarea.value = coordsLines.join('\n\n');
        };
        
        editBtn.addEventListener('click', () => {
            editMode = !editMode;
            if (editMode) {
                editBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Done Editing</span>';
                editBtn.classList.remove('btn-secondary');
                editBtn.classList.add('btn-primary');
                mapContainer.classList.add('edit-mode');
                outputPanel.style.display = 'flex';
                updateCoordinatesOutput();
            } else {
                editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> <span>Drag Pins (Fine-tune)</span>';
                editBtn.classList.remove('btn-primary');
                editBtn.classList.add('btn-secondary');
                mapContainer.classList.remove('edit-mode');
                outputPanel.style.display = 'none';
            }
        });
        
        closeBtn.addEventListener('click', () => {
            editBtn.click();
        });
        
        copyBtn.addEventListener('click', () => {
            textarea.select();
            document.execCommand('copy');
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Coordinates';
            }, 2000);
        });
        
        // Mouse dragging logic
        mapContainer.addEventListener('mousedown', (e) => {
            if (!editMode) return;
            const pin = e.target.closest('.map-pin');
            if (!pin) return;
            
            e.preventDefault();
            dragTarget = pin;
            
            const mapRect = mapContainer.getBoundingClientRect();
            
            const onMouseMove = (moveEvent) => {
                if (!dragTarget) return;
                const x = moveEvent.clientX - mapRect.left;
                const y = moveEvent.clientY - mapRect.top;
                
                let pctX = (x / mapRect.width) * 100;
                let pctY = (y / mapRect.height) * 100;
                
                pctX = Math.max(0, Math.min(100, pctX));
                pctY = Math.max(0, Math.min(100, pctY));
                
                dragTarget.style.left = `${pctX.toFixed(1)}%`;
                dragTarget.style.top = `${pctY.toFixed(1)}%`;
                
                updateCoordinatesOutput();
            };
            
            const onMouseUp = () => {
                dragTarget = null;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // Touch dragging logic for mobile/tablet devices
        mapContainer.addEventListener('touchstart', (e) => {
            if (!editMode) return;
            const pin = e.target.closest('.map-pin');
            if (!pin) return;
            
            dragTarget = pin;
            const mapRect = mapContainer.getBoundingClientRect();
            
            const onTouchMove = (moveEvent) => {
                if (!dragTarget) return;
                const touch = moveEvent.touches[0];
                const x = touch.clientX - mapRect.left;
                const y = touch.clientY - mapRect.top;
                
                let pctX = (x / mapRect.width) * 100;
                let pctY = (y / mapRect.height) * 100;
                
                pctX = Math.max(0, Math.min(100, pctX));
                pctY = Math.max(0, Math.min(100, pctY));
                
                dragTarget.style.left = `${pctX.toFixed(1)}%`;
                dragTarget.style.top = `${pctY.toFixed(1)}%`;
                
                updateCoordinatesOutput();
            };
            
            const onTouchEnd = () => {
                dragTarget = null;
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
            
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        });
    }
});
