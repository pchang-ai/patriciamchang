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
            
            // Mock server request latency
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Show success status
                formStatus.classList.add('success');
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been received.';
                
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
                
            }, 1500);
        });
    }
});
