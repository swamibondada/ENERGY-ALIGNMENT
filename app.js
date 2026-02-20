// Energy Alignment Quiz - Main Application Logic
// Redesigned for one-question-at-a-time premium experience

// App State
const AppState = {
    currentScreen: 'welcome',
    currentQuestionIndex: 0,
    allQuestions: [],
    answers: {},
    results: null
};

// DOM Elements
const DOM = {
    screens: {
        welcome: document.getElementById('welcome-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen')
    },
    startBtn: document.getElementById('start-quiz'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    quizContent: document.getElementById('quiz-content'),
    resultsContainer: document.querySelector('.results-container')
};

// Initialize App
function init() {
    // Build flat question array
    AppState.allQuestions = getAllQuestions();

    DOM.startBtn.addEventListener('click', startQuiz);
    DOM.prevBtn.addEventListener('click', prevQuestion);
    DOM.nextBtn.addEventListener('click', nextQuestion);
}

// Flatten all questions from sections into single array
function getAllQuestions() {
    const questions = [];
    sectionOrder.forEach(sectionKey => {
        const section = quizData[sectionKey];
        section.questions.forEach(question => {
            questions.push({
                ...question,
                sectionKey: sectionKey,
                sectionTitle: section.title,
                sectionIcon: section.icon,
                sectionSubtitle: section.subtitle
            });
        });
    });
    return questions;
}

// Navigation Functions
function showScreen(screenName) {
    Object.values(DOM.screens).forEach(screen => {
        screen.classList.remove('active');
    });
    DOM.screens[screenName].classList.add('active');
    AppState.currentScreen = screenName;
    window.scrollTo(0, 0);
}

function startQuiz() {
    AppState.currentQuestionIndex = 0;
    AppState.answers = {};
    showScreen('quiz');
    renderQuestion();
}

function prevQuestion() {
    if (AppState.currentQuestionIndex > 0) {
        AppState.currentQuestionIndex--;
        renderQuestion('prev');
    }
}

function nextQuestion() {
    // Validate current question
    if (!validateCurrentQuestion()) {
        return;
    }

    if (AppState.currentQuestionIndex < AppState.allQuestions.length - 1) {
        AppState.currentQuestionIndex++;
        renderQuestion('next');
    } else {
        // Calculate results and show
        calculateAndShowResults();
    }
}

// Validation
function validateCurrentQuestion() {
    const question = AppState.allQuestions[AppState.currentQuestionIndex];
    const answer = AppState.answers[question.id];
    const questionCard = document.querySelector('.question-card');

    if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
        if (questionCard) {
            questionCard.classList.add('invalid');
            shakeElement(questionCard);
        }
        return false;
    }

    if (questionCard) {
        questionCard.classList.remove('invalid');
    }
    return true;
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    .question-card.invalid {
        border-color: var(--error) !important;
    }
`;
document.head.appendChild(style);

// Render Functions
function renderQuestion(direction = 'none') {
    const question = AppState.allQuestions[AppState.currentQuestionIndex];
    const questionNumber = AppState.currentQuestionIndex + 1;
    const totalQuestions = AppState.allQuestions.length;

    updateProgress();
    updateNavigation();

    // Determine animation class
    let animationClass = 'fade-in';
    if (direction === 'next') animationClass = 'slide-in-right';
    if (direction === 'prev') animationClass = 'slide-in-left';

    const html = `
        <div class="question-wrapper ${animationClass}">
            <div class="section-indicator">
                <span class="section-icon">${question.sectionIcon}</span>
                <span class="section-name">${question.sectionTitle}</span>
            </div>
            <div class="question-card" data-question-id="${question.id}">
                <p class="question-text">
                    <span class="question-number">${questionNumber}.</span>
                    ${question.text}
                </p>
                ${renderQuestionInput(question)}
            </div>
        </div>
    `;

    DOM.quizContent.innerHTML = html;
    attachQuestionListeners(question);
    window.scrollTo(0, 0);
}

function renderQuestionInput(question) {
    const currentAnswer = AppState.answers[question.id];

    switch (question.type) {
        case 'text':
            return `
                <input type="text" 
                    class="text-input" 
                    id="${question.id}"
                    placeholder="${question.placeholder || ''}"
                    value="${currentAnswer || ''}">
            `;

        case 'single':
        case 'categorical':
            return `
                <div class="options-grid">
                    ${question.options.map(opt => `
                        <label class="option-label ${currentAnswer === opt.value ? 'selected' : ''}" data-value="${opt.value}">
                            <input type="radio" class="option-radio" name="${question.id}" value="${opt.value}" ${currentAnswer === opt.value ? 'checked' : ''}>
                            <span class="option-indicator"></span>
                            <span class="option-text">${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            `;

        case 'likert':
            // Personality test style circles (no slider, varying sizes)
            const selectedValue = parseInt(currentAnswer) || 0;
            return `
                <div class="personality-scale">
                    <span class="scale-label scale-label-left">Disagree</span>
                    <div class="scale-circles">
                        ${[1, 2, 3, 4, 5].map(val => {
                // Size classes: ends are larger, middle is smaller
                const sizeClass = val === 1 || val === 5 ? 'size-lg' :
                    val === 2 || val === 4 ? 'size-md' : 'size-sm';
                // Color classes: left side teal, right side green, middle neutral
                const colorClass = val <= 2 ? 'color-disagree' :
                    val >= 4 ? 'color-agree' : 'color-neutral';
                return `
                                <div class="scale-circle ${sizeClass} ${colorClass} ${selectedValue === val ? 'selected' : ''}" 
                                     data-value="${val}">
                                </div>
                            `;
            }).join('')}
                    </div>
                    <span class="scale-label scale-label-right">Agree</span>
                </div>
            `;

        default:
            return '';
    }
}

function getLikertLabel(value) {
    const labels = {
        1: 'Strongly Disagree',
        2: 'Disagree',
        3: 'Neutral',
        4: 'Agree',
        5: 'Strongly Agree'
    };
    return labels[value] || '';
}

function attachQuestionListeners(question) {
    // Text inputs
    const textInput = document.querySelector('.text-input');
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            AppState.answers[e.target.id] = e.target.value;
            removeInvalidState();
        });
        textInput.focus();
    }

    // Radio options (single, categorical)
    document.querySelectorAll('.option-label').forEach(label => {
        label.addEventListener('click', (e) => {
            const radio = label.querySelector('.option-radio');
            const questionId = radio.name;
            const value = radio.value;

            // Update state
            AppState.answers[questionId] = value;

            // Update UI
            const siblings = label.parentElement.querySelectorAll('.option-label');
            siblings.forEach(sib => sib.classList.remove('selected'));
            label.classList.add('selected');

            removeInvalidState();

            // Auto-advance
            setTimeout(() => {
                nextQuestion();
            }, 600);
        });
    });

    // Personality scale circles (likert)
    const scaleCircles = document.querySelectorAll('.scale-circle');
    if (scaleCircles.length > 0) {
        scaleCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                const value = circle.dataset.value;

                // Update state
                AppState.answers[question.id] = value;

                // Update UI - remove selected from all, add to clicked
                scaleCircles.forEach(c => c.classList.remove('selected'));
                circle.classList.add('selected');

                removeInvalidState();

                // Auto-advance
                setTimeout(() => {
                    nextQuestion();
                }, 600);
            });
        });
    }
}

function removeInvalidState() {
    const card = document.querySelector('.question-card');
    if (card) card.classList.remove('invalid');
}

function updateProgress() {
    const totalQuestions = AppState.allQuestions.length;
    const progress = ((AppState.currentQuestionIndex + 1) / totalQuestions) * 100;
    DOM.progressFill.style.width = `${progress}%`;
    DOM.progressText.textContent = `Question ${AppState.currentQuestionIndex + 1} of ${totalQuestions}`;
}

function updateNavigation() {
    DOM.prevBtn.disabled = AppState.currentQuestionIndex === 0;

    const isLastQuestion = AppState.currentQuestionIndex === AppState.allQuestions.length - 1;
    DOM.nextBtn.innerHTML = isLastQuestion
        ? `<span>See My Results</span>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M5 12h14M12 5l7 7-7 7"/>
           </svg>`
        : `<span>Next</span>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M5 12h14M12 5l7 7-7 7"/>
           </svg>`;
}

// Results Functions
function calculateAndShowResults() {
    AppState.results = ScoringEngine.calculateResults(AppState.answers);
    showScreen('results');
    renderResults();
}

function renderResults() {
    const { results } = AppState;

    // Helper to determine status level
    const getStatusLevel = (score) => {
        if (score <= 40) return { label: 'Depleted', class: 'depleted' };
        if (score <= 70) return { label: 'Transitioning', class: 'transitioning' };
        return { label: 'Flowing', class: 'flowing' };
    };

    // Find weakest and strongest areas
    const dimensionScores = [
        { name: 'Body', key: 'BB', score: results.dimensions.BB },
        { name: 'Emotions', key: 'EO', score: 100 - results.dimensions.EO },
        { name: 'Mind', key: 'RO', score: 100 - results.dimensions.RO },
        { name: 'Spirit', key: 'SP', score: results.dimensions.SP },
        { name: 'Support', key: 'SS', score: results.dimensions.SS }
    ];

    const sorted = [...dimensionScores].sort((a, b) => a.score - b.score);
    const weakest = sorted.slice(0, 2);
    const strongest = sorted[sorted.length - 1];

    // Calculate ring percentage
    const ringPercent = results.eas;
    const ringColor = results.eas <= 40 ? '#e879f9' : results.eas <= 70 ? '#c084fc' : '#22d3ee';

    // Generate 7-day reset based on archetype
    const resetPlan = generate7DayReset(results.archetype.name);

    // Generate core pattern narrative
    const corePattern = generateCorePattern(results, weakest, strongest);

    const html = `
        <!-- Report Header -->
        <div class="blueprint-header">
            <div class="blueprint-badge">
                <span class="badge-dot"></span>
                PERSONALIZED ENERGY ALIGNMENT BLUEPRINT
            </div>
            <h1 class="blueprint-title">Energy Report for ${results.userName}</h1>
            <p class="blueprint-subtitle">
                You are neither broken nor behind. This report is a thoughtful reflection of where your body, mind, 
                emotions, and spirit may have shifted into survival mode — and a clear path to restore balance and vitality.
            </p>
        </div>
        
        <!-- Status Banner -->
        <div class="status-banner status-${getStatusLevel(results.eas).class}">
            <span class="status-dot"></span>
            ${getStatusMessage(results.eas)}
        </div>
        
        <!-- Main Score Section -->
        <div class="score-section">
            <div class="score-left">
                <div class="section-badge">
                    <span class="badge-dot"></span>
                    Overall Alignment
                </div>
                <h2 class="energy-score-label">ENERGY ALIGNMENT SCORE</h2>
                <div class="score-number">${results.eas}</div>
                <div class="score-legend">
                    <span><strong>0–40:</strong> Depleted</span>
                    <span><strong>41–70:</strong> Transitioning</span>
                    <span><strong>71–100:</strong> Flowing</span>
                </div>
                <p class="archetype-intro">${results.userName}, you are currently in the</p>
                <h3 class="archetype-title" style="color: ${ringColor}">${results.archetype.name.toUpperCase()}</h3>
                <p class="archetype-desc">${results.archetype.description}</p>
            </div>
            <div class="score-right">
                <div class="score-ring" style="--ring-color: ${ringColor}; --ring-percent: ${ringPercent}">
                    <svg viewBox="0 0 100 100">
                        <circle class="ring-bg" cx="50" cy="50" r="45"/>
                        <circle class="ring-fill" cx="50" cy="50" r="45"/>
                    </svg>
                </div>
            </div>
        </div>
        
        <!-- Quick Snapshot -->
        <div class="snapshot-section">
            <h3 class="snapshot-title">Quick Snapshot</h3>
            <p class="snapshot-subtitle">A closer look at how your internal energy systems are functioning beneath the surface.</p>
            <div class="snapshot-tags">
                <span class="snapshot-tag tag-${getStatusLevel(results.indices.BMH).class}">
                    Body–Mind: ${getStatusLevel(results.indices.BMH).label}
                </span>
                <span class="snapshot-tag tag-${getStatusLevel(results.indices.RCI).class}">
                    Receiving: ${getStatusLevel(results.indices.RCI).label}
                </span>
                <span class="snapshot-tag tag-${getStatusLevel(100 - results.indices.OGI).class}">
                    Over-Giving: ${results.indices.OGI > 60 ? 'High' : results.indices.OGI > 30 ? 'Moderate' : 'Low'}
                </span>
            </div>
            <div class="composite-bars">
                ${renderCompositeBar('Body–Mind Harmony', results.indices.BMH)}
                ${renderCompositeBar('Receiving Capacity', results.indices.RCI)}
                ${renderCompositeBar('Over-Giving Index', results.indices.OGI, true)}
            </div>
        </div>
        
        <!-- Energy Dimensions Grid -->
        <div class="dimensions-grid-section">
            <div class="dimension-card">
                <h3 class="card-title">Your Energy Wheel</h3>
                <p class="card-subtitle">This radar shows how evenly your energy is distributed across the five core dimensions.</p>
                <div class="radar-chart">
                    <canvas id="radarChart"></canvas>
                </div>
            </div>
            <div class="dimension-card">
                <h3 class="card-title">Dimension Scores</h3>
                <p class="card-subtitle">Each bar is a 0–100 score based on your answers. Lower scores are where your system is asking for more repair.</p>
                <div class="dimension-bars">
                    ${dimensionScores.map(d => renderDimensionBar(d.name, d.score)).join('')}
                </div>
                <p class="strongest-note">
                    Your strongest area is <strong>${strongest.name}</strong>. Continue nurturing this strength — it serves as the foundation that will support healing across other dimensions.
                </p>
            </div>
        </div>
        
        <!-- Leaks Section -->
        <div class="leaks-section">
            <p class="leaks-text">
                The areas requiring your most immediate attention are <strong>${weakest[0].name}</strong> and <strong>${weakest[1].name}</strong>. 
                These are where focused care and intention will yield the most meaningful results.
            </p>
        </div>
        
        <!-- Core Energy Pattern -->
        <div class="pattern-section">
            <div class="section-badge">
                <span class="badge-dot"></span>
                WHAT'S REALLY GOING ON
            </div>
            <h3 class="pattern-title">Your Core Energy Pattern</h3>
            <p class="pattern-narrative">${corePattern.narrative}</p>
            
            <h4 class="pattern-subtitle">How this shows up in daily life</h4>
            <ul class="pattern-list">
                ${corePattern.behaviors.map(b => `<li>${b}</li>`).join('')}
            </ul>
        </div>
        
        <!-- Root Cause -->
        <div class="root-section">
            <h4 class="root-title">Root cause in energetic terms</h4>
            <p class="root-text">${corePattern.rootCause}</p>
        </div>
        
        <!-- 7-Day Reset -->
        <div class="reset-section">
            <div class="section-badge">
                <span class="badge-dot"></span>
                YOUR NEXT 7 DAYS
            </div>
            <h3 class="reset-title">7-Day Nervous System Reset</h3>
            <p class="reset-subtitle">
                This structured 7-day programme is designed to help you translate awareness into consistent action — 
                gentle, repeatable practices your system can rely upon, even during life's most demanding moments.
            </p>
            <div class="reset-days">
                ${resetPlan.map((day, i) => `
                    <div class="reset-day">
                        <span class="day-dot day-${day.category.toLowerCase()}"></span>
                        <div class="day-content">
                            <span class="day-label">DAY ${i + 1}</span>
                            <p class="day-practice"><strong>${day.category}:</strong> ${day.practice}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Note from Ritu -->
        <div class="note-from-ritu">
            <div class="ritu-avatar">R</div>
            <div class="ritu-content">
                <span class="ritu-label">A Personal Note from Ritu</span>
                <p class="ritu-message">
                    I understand what it means to carry the weight of being the dependable one — while quietly struggling within. This report is not a judgement; it is a compassionate guide showing you precisely where your energy is calling for gentleness, firmer boundaries, and genuine support. Take even one meaningful step from this report today, and you will already be on the path to a more balanced, fulfilling life.
                </p>
                <p class="ritu-signature">With love, Ritu</p>
            </div>
        </div>
        
        <!-- Disclaimer -->
        <p class="report-disclaimer">
            This report is not a medical diagnosis. It is a reflective assessment designed to illuminate where your energy may benefit from thoughtful, sustained support.
        </p>
        
        <!-- OTO Section -->
        <div class="oto-section">
            <div class="oto-content">
                <span class="oto-badge">Special Offer for You</span>
                <h2 class="oto-title">21-Day Energy Reset Program</h2>
                <p class="oto-subtitle">${results.archetype.otoMessage}</p>
                
                <div class="oto-benefits">
                    <div class="oto-benefit">
                        <span class="benefit-icon">🎯</span>
                        <div class="benefit-text">
                            <strong>Daily Energy Practices</strong>
                            5-10 minute rituals designed for busy women
                        </div>
                    </div>
                    <div class="oto-benefit">
                        <span class="benefit-icon">🧘</span>
                        <div class="benefit-text">
                            <strong>Guided Meditations</strong>
                            Customized for your energy phase
                        </div>
                    </div>
                    <div class="oto-benefit">
                        <span class="benefit-icon">📱</span>
                        <div class="benefit-text">
                            <strong>WhatsApp Community</strong>
                            Connect with like-minded women
                        </div>
                    </div>
                    <div class="oto-benefit">
                        <span class="benefit-icon">💫</span>
                        <div class="benefit-text">
                            <strong>Energy Tracking Journal</strong>
                            Monitor your transformation daily
                        </div>
                    </div>
                </div>
                
                <button class="oto-cta" onclick="handleOTOClick()">
                    <span>Yes! I Want to Reset My Energy</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
                
                <p class="oto-guarantee">100% Satisfaction Guarantee | Start transforming today</p>
            </div>
        </div>
        
        <!-- Retake Quiz -->
        <div style="text-align: center; margin-top: var(--space-10);">
            <button class="btn-secondary" onclick="retakeQuiz()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 4v6h6M23 20v-6h-6"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                <span>Retake Quiz</span>
            </button>
        </div>
    `;

    DOM.resultsContainer.innerHTML = html;

    // Initialize radar chart after DOM is ready
    setTimeout(() => {
        initRadarChart(dimensionScores);
        animateBars();
    }, 100);
}

// Helper functions for report generation
function getStatusMessage(eas) {
    if (eas <= 40) {
        return "YOUR SYSTEM IS CALLING FOR DEEP RESTORATION. GENTLE, CONSISTENT STEPS ARE THE MOST EFFECTIVE PATH FORWARD.";
    } else if (eas <= 70) {
        return "YOUR SYSTEM IS IN A MEANINGFUL TRANSITION. STEADY, INTENTIONAL ADJUSTMENTS WILL CREATE LASTING POSITIVE CHANGE.";
    } else {
        return "YOUR SYSTEM IS IN A STATE OF FLOW. CONTINUE NURTURING THESE PATTERNS TO SUSTAIN AND DEEPEN YOUR ALIGNMENT.";
    }
}

function renderCompositeBar(label, value, isInverse = false) {
    const displayValue = isInverse ? value : value;
    const color = isInverse
        ? (value > 60 ? '#f472b6' : value > 30 ? '#c084fc' : '#22d3ee')
        : (value > 60 ? '#22d3ee' : value > 30 ? '#c084fc' : '#f472b6');

    return `
        <div class="composite-bar-item">
            <span class="composite-label">${label}</span>
            <div class="composite-track">
                <div class="composite-fill" data-width="${displayValue}" style="width: 0%; background: ${color}"></div>
            </div>
            <span class="composite-value">${displayValue}</span>
        </div>
    `;
}

function renderDimensionBar(name, score) {
    return `
        <div class="dim-bar-item">
            <div class="dim-bar-track">
                <div class="dim-bar-fill" data-height="${score}%"></div>
            </div>
            <span class="dim-bar-label">${name}</span>
        </div>
    `;
}

function generateCorePattern(results, weakest, strongest) {
    const patterns = {
        'The Resting Phase': {
            narrative: `You have been the <span class="highlight">pillar of strength for those around you</span> for so long that your own body and emotions have been quietly bearing the cost.`,
            behaviors: [
                'You instinctively take on more than you can manage, even when your body is signalling the need for rest.',
                'A sense of guilt arises when you consider investing time, resources, or attention in yourself.',
                'Your sleep quality, energy levels, or overall health feel inconsistent, making it difficult to rely on your own body.',
                'You are learning to receive more openly, yet when good things begin to grow, an underlying fear of loss can surface.'
            ],
            rootCause: `At its core, your system still operates on the belief that safety depends on maintaining control over everything. Until this pattern shifts, your energy reserves will continue to deplete under pressure.`
        },
        'The Awakening Phase': {
            narrative: `You are becoming <span class="highlight">increasingly aware of your patterns</span>, yet the deeply ingrained survival mechanisms still take over during moments of stress.`,
            behaviors: [
                'You understand what self-care requires, yet find it challenging to maintain consistency.',
                'Periods of clarity are interspersed with a return to familiar, less supportive habits.',
                'You recognise people-pleasing tendencies in yourself, and feel frustrated when they resurface.',
                'Progress can feel uneven — but each step forward, however small, is building genuine momentum.'
            ],
            rootCause: `Your nervous system is in the process of rewiring, and it requires consistent, patient practice to establish trust in change. The sense of instability you feel is, in fact, a natural indicator of meaningful growth.`
        },
        'The Rising Phase': {
            narrative: `You have invested significant effort in your personal development, and your <span class="highlight">energy is steadily building momentum</span>. The foundation is sound — the focus now is on refinement and deepening.`,
            behaviors: [
                'You have established boundaries, though maintaining them under pressure can still be a challenge.',
                'Self-care practices are in place, yet life\'s demands occasionally interrupt your routine.',
                'You are increasingly discerning about where you direct your energy, though guilt may still arise at times.',
                'Meaningful transformation feels within reach — the next step is deepening your trust in the process.'
            ],
            rootCause: `Your system is learning to sustain a higher level of vitality, though older patterns of fear may occasionally re-emerge. Continue reinforcing the new, healthier neural pathways you have been cultivating.`
        },
        'The Radiant Phase': {
            narrative: `You have cultivated a state of <span class="highlight">deep, authentic alignment</span>, and your energy naturally draws in what you desire. The focus now is on sustaining and expanding this harmony.`,
            behaviors: [
                'Self-care has become an integral, non-negotiable part of your daily life.',
                'You give generously from a place of abundance rather than depletion.',
                'Your boundaries are clearly defined and upheld with grace and confidence.',
                'You are positioned to guide and uplift others while preserving your own well-being.'
            ],
            rootCause: `Your system has successfully transitioned from survival mode to a creative, generative state. The path ahead is about deepening this alignment and sharing your wisdom with those around you.`
        }
    };

    return patterns[results.archetype.name] || patterns['The Awakening Phase'];
}

function generate7DayReset(archetypeName) {
    const resets = {
        'The Resting Phase': [
            { category: 'BODY', practice: 'Do 3 rounds of 4–7–8 breathing before scrolling or checking messages in the morning.' },
            { category: 'EMOTIONS', practice: 'Choose one moment daily to gently ask: "What emotion am I running from right now?" and breathe with it for 60 seconds.' },
            { category: 'MIND', practice: 'Each day, rewrite one limiting thought into an empowering one and speak it out loud three times.' },
            { category: 'SPIRIT', practice: 'Spend 5 minutes in stillness — no guided meditation, just you and silence.' },
            { category: 'SUPPORT', practice: 'Ask for one small thing from someone today. Practice receiving without explaining yourself.' },
            { category: 'BODY', practice: 'Gentle stretching for 10 minutes before bed. Let your body release the day.' },
            { category: 'INTEGRATION', practice: 'Review your week. What felt different? Journal for 10 minutes on your shifts.' }
        ],
        'The Awakening Phase': [
            { category: 'BODY', practice: 'Morning body scan: 5 minutes to check in with each body part without judgment.' },
            { category: 'EMOTIONS', practice: 'Name three emotions you felt yesterday. Just name them — no story, no fix.' },
            { category: 'MIND', practice: 'Catch one thought spiral today and consciously redirect it with a power question.' },
            { category: 'SPIRIT', practice: '10 minutes of conscious breathing. Focus only on the breath entering and leaving.' },
            { category: 'SUPPORT', practice: 'Share one vulnerable truth with someone you trust. Notice how it feels.' },
            { category: 'BODY', practice: 'Move for 20 minutes in any way that feels good — walking, dancing, yoga.' },
            { category: 'INTEGRATION', practice: 'Celebrate three wins from this week, no matter how small.' }
        ],
        'The Rising Phase': [
            { category: 'BODY', practice: 'Wake up 15 minutes earlier for a morning ritual that\'s just for you.' },
            { category: 'EMOTIONS', practice: 'Practice feeling joy without waiting for a reason. Generate it from within.' },
            { category: 'MIND', practice: 'Visualize your ideal day in detail before it begins. Feel it as already done.' },
            { category: 'SPIRIT', practice: 'Create space for inspired action. When guidance comes, take one small step immediately.' },
            { category: 'SUPPORT', practice: 'Audit your energy exchanges. Are you giving more than receiving anywhere?' },
            { category: 'BODY', practice: 'Upgrade one health habit. Better water, food, or sleep — choose one.' },
            { category: 'INTEGRATION', practice: 'Write a letter to your future self. What do you want her to know?' }
        ],
        'The Radiant Phase': [
            { category: 'BODY', practice: 'Honor your body with its preferred form of movement. Let it guide you.' },
            { category: 'EMOTIONS', practice: 'Practice transmuting any low emotion into creative energy within 5 minutes.' },
            { category: 'MIND', practice: 'Mentor someone today. Share one insight that shifted everything for you.' },
            { category: 'SPIRIT', practice: 'Deep meditation: 20 minutes of complete presence and connection.' },
            { category: 'SUPPORT', practice: 'Create a new supportive ritual with someone you love.' },
            { category: 'EXPANSION', practice: 'Dream bigger. What would you do if you knew you couldn\'t fail?' },
            { category: 'INTEGRATION', practice: 'Anchor your new identity. Who are you becoming? Live from that place.' }
        ]
    };

    return resets[archetypeName] || resets['The Awakening Phase'];
}

function initRadarChart(dimensionScores) {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;

    // Use container width for responsive sizing
    const container = canvas.parentElement;
    const containerWidth = container ? container.clientWidth : 500;
    const size = Math.min(containerWidth - 32, 500);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 50;
    const labels = dimensionScores.map(d => d.name);
    const values = dimensionScores.map(d => d.score);
    const numPoints = values.length;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid circles
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Draw grid lines
    for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
    }

    // Draw data polygon
    ctx.fillStyle = 'rgba(192, 132, 252, 0.3)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.beginPath();

    values.forEach((value, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const distance = (value / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#e879f9';
    values.forEach((value, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const distance = (value / 100) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';

    labels.forEach((label, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 20);
        const y = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(label, x, y + 4);
    });
}

function animateBars() {
    // Animate dimension bars (vertical - use height)
    document.querySelectorAll('.dim-bar-fill').forEach(fill => {
        const height = fill.getAttribute('data-height'); // data-height contains the percentage
        setTimeout(() => {
            fill.style.height = height;
        }, 100);
    });

    // Animate composite bars (horizontal - use width)
    document.querySelectorAll('.composite-fill').forEach(fill => {
        const targetWidth = fill.getAttribute('data-width'); // data-width contains the numeric value
        setTimeout(() => {
            fill.style.width = targetWidth + '%';
        }, 100);
    });
}

// Action Handlers
function handleOTOClick() {
    // TODO: Replace this with the actual Stripe/Razorpay payment link
    const PAYMENT_URL = 'https://buy.stripe.com/test_placeholder';
    window.open(PAYMENT_URL, '_blank');
}

function retakeQuiz() {
    AppState.currentQuestionIndex = 0;
    AppState.answers = {};
    AppState.results = null;
    showScreen('welcome');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
