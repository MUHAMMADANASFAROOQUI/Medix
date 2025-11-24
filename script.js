document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const sections = document.querySelectorAll('section');

    // --- Accessibility Toggles ---
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    if (highContrastToggle) {
        highContrastToggle.addEventListener('click', () => {
            body.classList.toggle('high-contrast');
        });
    }

    const lowMotionToggle = document.getElementById('low-motion-toggle');
    if (lowMotionToggle) {
        lowMotionToggle.addEventListener('click', () => {
            body.classList.toggle('low-motion');
        });
    }

    const rtlToggle = document.getElementById('rtl-toggle');
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            body.classList.toggle('rtl');
        });
    }

    // --- Intersection Observer for Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Language Grid ---
    const languageGrid = document.querySelector('.language-grid');
    const languages = ['English', 'اردو', 'سنڌي', 'پنجابی', 'پشتو', 'بلوچی'];

    if (languageGrid) {
        languages.forEach(lang => {
            const langButton = document.createElement('button');
            langButton.textContent = lang;
            langButton.classList.add('language-button');
            languageGrid.appendChild(langButton);
        });

        languageGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-button')) {
                const selectedLang = e.target.textContent;
                console.log(`Language selected: ${selectedLang}`);
                // Add actual logic to change the language of the website
                // For now, let's just highlight the selected language
                Array.from(languageGrid.children).forEach(btn => btn.classList.remove('selected'));
                e.target.classList.add('selected');
            }
        });
    }

    // --- Instructions Accordion (for mobile) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;

            // Only toggle on mobile screens
            if (window.innerWidth < 768) {
                accordionItem.classList.toggle('active');
                header.classList.toggle('active');

                if (accordionContent.style.maxHeight) {
                    accordionContent.style.maxHeight = null;
                } else {
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                }
            }
        });
    });


    // --- Consent Checkbox & Start Button ---
    const consentCheckbox = document.getElementById('consent-checkbox');
    const startButton = document.getElementById('start-button');

    if (consentCheckbox && startButton) {
        consentCheckbox.addEventListener('change', () => {
            startButton.disabled = !consentCheckbox.checked;
        });

        startButton.addEventListener('click', () => {
            console.log('Starting monitoring...');
            // Add logic to proceed to next section or start process
        });
    }

    // --- Heatmap Simulation ---
    const heatmap = document.querySelector('.heatmap');
    const statusCard = document.querySelector('.status-card p');
    const statuses = ["Please sit upright.", "Please place your arms on the armrests.", "Scan in progress..."];
    let statusIndex = 0;

    if (heatmap && statusCard) {
        setInterval(() => {
            // Only update heatmap if low-motion mode is not active
            if (!body.classList.contains('low-motion')) {
                const randomColor1 = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
                const randomColor2 = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
                heatmap.style.background = `linear-gradient(to bottom, ${randomColor1}, ${randomColor2})`;
            }

            statusCard.textContent = statuses[statusIndex];
            statusIndex = (statusIndex + 1) % statuses.length;
        }, 3000);
    }

    // --- Swiper for Vitals Cards (conditional initialization) ---
    let mySwiper = null;

    function initSwiper() {
        if (window.innerWidth < 768 && !mySwiper) { // Initialize only on mobile and if not already initialized
            mySwiper = new Swiper('.swiper-container', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        } else if (window.innerWidth >= 768 && mySwiper) { // Destroy on larger screens if initialized
            mySwiper.destroy(true, true);
            mySwiper = null;
        }
    }

    // Initialize on load
    initSwiper();
    // Re-initialize/destroy on window resize
    window.addEventListener('resize', initSwiper);

    // --- Questionnaire Logic ---
    const questions = [
        {
            question: "Do you have a history of heart disease?",
            answers: ["Yes", "No"]
        },
        {
            question: "Do you smoke?",
            answers: ["Yes", "No"]
        },
        {
            question: "Do you exercise regularly?",
            answers: ["Yes", "No"]
        }
    ];

    let currentQuestionIndex = 0;
    const questionnaireSection = document.getElementById('questionnaire');
    const questionContainer = questionnaireSection ? questionnaireSection.querySelector('.question-container') : null;
    const progressBar = questionnaireSection ? questionnaireSection.querySelector('.progress') : null;

    function displayQuestion() {
        if (!questionContainer) return;

        const question = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <div class="question">${question.question}</div>
            <div class="answers">
                <button class="answer-button">${question.answers[0]}</button>
                <button class="answer-button">${question.answers[1]}</button>
            </div>
        `;
    }

    function updateProgressBar() {
        if (!progressBar) return;
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    if (questionContainer) {
        questionContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-button')) {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    displayQuestion();
                    updateProgressBar();
                } else {
                    questionContainer.innerHTML = "<p>Thank you for completing the questionnaire!</p>";
                    if (progressBar) progressBar.style.width = "100%";
                }
            }
        });
        displayQuestion();
        updateProgressBar();
    }


    // --- Results Section Logic ---
    const resultsContainer = document.querySelector('#results .results-content');
    const processingAnimation = document.querySelector('#results .processing-animation');

    // Initially hide results and show processing animation
    if (resultsContainer && processingAnimation) {
        resultsContainer.style.display = 'none';
        processingAnimation.style.display = 'block';

        function showResults() {
            processingAnimation.style.display = 'none';
            resultsContainer.style.display = 'block';
            // Simulate probability result
            const probabilityBar = resultsContainer.querySelector('.probability');
            if (probabilityBar) {
                const randomProbability = Math.floor(Math.random() * 100);
                probabilityBar.style.width = `${randomProbability}%`;
                probabilityBar.nextElementSibling.textContent = `${randomProbability}% Probability of Good Health`;
            }
        }
        setTimeout(showResults, 5000);
    }

    // --- Summary Actions ---
    const summaryActions = document.querySelector('.summary-actions');
    if (summaryActions) {
        summaryActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-button')) {
                const action = e.target.textContent;
                console.log(`Action: ${action}`);
                alert(`You clicked: ${action}`);
            }
        });
    }

});