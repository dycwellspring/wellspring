function lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe[data-src]');
    const observerOptions = {
        rootMargin: '200px 0px', 
        threshold: 0.01 
    };

    const iframeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                const dataSrc = iframe.getAttribute('data-src');

                if (dataSrc) {
                    iframe.setAttribute('src', dataSrc); 
                    iframe.removeAttribute('data-src');
                }
                observer.unobserve(iframe);
            }
        });
    }, observerOptions);

    iframes.forEach(iframe => {
        iframeObserver.observe(iframe);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    const allMobileLinks = document.querySelectorAll('#mobile-menu a'); 
    const header = document.querySelector('.main-header');
    
    const qsBtn = document.getElementById('qs-btn');
    const qsSubmenu = document.getElementById('qs-submenu');
    const nivelesBtn = document.getElementById('niveles-btn');
    const nivelesSubmenu = document.getElementById('niveles-submenu');
    
    // Preloader
    const PRELOADER_SEEN_KEY = 'preloaderSeen';
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        const hasPreloaderBeenSeen = sessionStorage.getItem(PRELOADER_SEEN_KEY);

        if (hasPreloaderBeenSeen) {
            preloader.remove(); 
        } else {
            sessionStorage.setItem(PRELOADER_SEEN_KEY, 'true');
            preloader.classList.remove('initial-hidden'); 

            setTimeout(() => {
                preloader.classList.add('preloader-hidden');

                setTimeout(() => {
                    preloader.remove(); 
                }, 500); 
            }, 10);
        }
    }
    const closeMobileMenu = () => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            if (iconOpen && iconClose) {
                iconOpen.classList.remove('hidden'); 
                iconClose.classList.add('hidden'); 
            }
            document.querySelectorAll('.mobile-submenu').forEach(sub => {
                sub.classList.add('hidden');
                const associatedButton = sub.previousElementSibling;
                if (associatedButton && associatedButton.tagName === 'BUTTON') {
                   associatedButton.setAttribute('aria-expanded', 'false');
                }
            });
        }
    };
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); 
            const isExpanded = !mobileMenu.classList.contains('hidden');
            
            if (iconOpen && iconClose) {
                iconOpen.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
            menuBtn.setAttribute('aria-expanded', String(isExpanded));
        });
    }
    allMobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMobileMenu, 150); 
        });
    });
    const setupButtonToggle = (button, submenu, targetUrl) => {
        if (button && submenu) {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                const isCurrentlyExpanded = button.getAttribute('aria-expanded') === 'true';

                if (isCurrentlyExpanded) {
                    closeMobileMenu(); 
                    window.location.href = targetUrl; 
                    return;
                }

                document.querySelectorAll('.mobile-submenu').forEach(otherSubmenu => {
                    if (otherSubmenu !== submenu && !otherSubmenu.classList.contains('hidden')) {
                        otherSubmenu.classList.add('hidden');
                        const associatedButton = otherSubmenu.previousElementSibling;
                        if (associatedButton && associatedButton.tagName === 'BUTTON') {
                           associatedButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                submenu.classList.remove('hidden');
                button.setAttribute('aria-expanded', 'true');
            });
        }
    }; 
    setupButtonToggle(qsBtn, qsSubmenu, 'quienes-somos.html');
    setupButtonToggle(nivelesBtn, nivelesSubmenu, 'index.html#niveles'); 

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = header?.offsetHeight || 0;
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        });
    });

    function handleScrollHeader() {
        if (!header) return; 
        const scrollThreshold = 50; 

        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader();
    
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const delayTime = 50; 
    let hideTimer;

    dropdownMenus.forEach(dropdown => {
        const submenu = dropdown.querySelector('.dropdown-submenu');

        if (submenu) {
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer); 
                submenu.style.display = 'block';
            });

            dropdown.addEventListener('mouseleave', () => {
                clearTimeout(hideTimer); 
                hideTimer = setTimeout(() => {
                    submenu.style.display = 'none';
                }, delayTime);
            });
        }
    });

    const loadInstagramBtn = document.getElementById('load-instagram-btn');
    const instagramIframe = document.querySelector('.instagram-iframe');
    const instagramPlaceholder = document.getElementById('instagram-placeholder');

    if (loadInstagramBtn && instagramIframe && instagramPlaceholder) {
        loadInstagramBtn.addEventListener('click', () => {
            const dataSrc = instagramIframe.getAttribute('data-src');

            if (dataSrc) {
                instagramPlaceholder.style.display = 'none';
                instagramIframe.classList.remove('hidden-iframe'); 
                instagramIframe.setAttribute('src', dataSrc);
                instagramIframe.removeAttribute('data-src');
            }
        });
    }

});

window.addEventListener('load', () => {
    function initCarousel(id, slideSelector = '.carousel-slide') { 
        const carousel = document.getElementById(`${id}-carousel`); 
        const prevButton = document.getElementById(`${id}-prev`);
        const nextButton = document.getElementById(`${id}-next`);
        const dotsContainer = document.getElementById(`${id}-dots`);

        if (!carousel || !prevButton || !nextButton) {
            return; 
        }

        const slides = carousel.querySelectorAll(slideSelector); 
        const totalSlides = slides.length;
        let currentIndex = 0;
        const autoplayDuration = 4000;

        if (totalSlides === 0) return;


        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot'); 
                dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
                dot.addEventListener('click', () => moveToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];


        const updateCarousel = () => {
            const containerWidth = carousel.parentElement.clientWidth; 
            carousel.style.transform = `translateX(-${currentIndex * containerWidth}px)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('dot-active', index === currentIndex);
                dot.classList.toggle('dot-inactive', index !== currentIndex);
            });
        };

        const moveToSlide = (index) => {
            currentIndex = (index + totalSlides) % totalSlides;
            updateCarousel();
        }

        prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        
        let autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), autoplayDuration);

        carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carousel.parentElement.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), autoplayDuration);
        });
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }
    initCarousel('historia', '.carousel-slide');
    initCarousel('historia-mobile', '.carousel-slide-mobile');
    initCarousel('infra-mobile', '.carousel-slide-mobile'); 
    initCarousel('infra'); 
});
lazyLoadIframes();