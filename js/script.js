// DNB Trading & Enterprises — site script
// No inline JS anywhere; everything lives here.

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       Sticky header background on scroll
    --------------------------------------------------- */
    const header = document.getElementById('header');
    const updateHeaderState = () => {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };
    updateHeaderState();
    document.addEventListener('scroll', updateHeaderState, { passive: true });

    /* ---------------------------------------------------
       Mobile navigation toggle
    --------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        primaryNav.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                primaryNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------------------------------------------------
       Section reveal animation on scroll
    --------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------------------------------------------------
       Footer year
    --------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------------------------------------------------
       Contact form validation
       (Client-side only — connect to a form service or
       backend to actually receive submissions. See README.)
    --------------------------------------------------- */
    const form = document.getElementById('contactForm');
    const formNote = document.getElementById('formNote');

    if (form) {
        const requiredFields = form.querySelectorAll('[required]');

        const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        const validateField = (field) => {
            const row = field.closest('.form-row');
            let valid = field.value.trim().length > 0;

            if (valid && field.type === 'email') {
                valid = isValidEmail(field.value.trim());
            }

            if (row) {
                row.classList.toggle('has-error', !valid);
            }
            return valid;
        };

        requiredFields.forEach((field) => {
            field.addEventListener('blur', () => validateField(field));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let formValid = true;
            requiredFields.forEach((field) => {
                if (!validateField(field)) {
                    formValid = false;
                }
            });

            if (!formValid) {
                if (formNote) {
                    formNote.textContent = 'Please complete the required fields above.';
                }
                return;
            }

            if (formNote) {
                formNote.textContent = 'This form is not yet connected to an email service — see README.md for setup.';
            }
        });
    }

});
