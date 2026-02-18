// Quiz Data Structure
// Energy Alignment Quiz – Ritu (Manifestation & Energy Coach)

const quizData = {
    // Section 0 - Basic Info (NOT SCORED)
    section0: {
        id: 'basic-info',
        title: 'About You',
        subtitle: 'Let\'s get to know you better',
        icon: '👋',
        scored: false,
        questions: [
            {
                id: 'S0Q1',
                type: 'text',
                text: 'What\'s your name?',
                placeholder: 'Enter your name'
            },
            {
                id: 'S0Q2',
                type: 'single',
                text: 'What is your age range?',
                options: [
                    { value: '18-24', label: '18-24 years' },
                    { value: '25-34', label: '25-34 years' },
                    { value: '35-44', label: '35-44 years' },
                    { value: '45-54', label: '45-54 years' },
                    { value: '55+', label: '55+ years' }
                ]
            },
            {
                id: 'S0Q3',
                type: 'single',
                text: 'What is your primary role?',
                options: [
                    { value: 'employee', label: 'Employee / Professional' },
                    { value: 'entrepreneur', label: 'Entrepreneur / Business Owner' },
                    { value: 'homemaker', label: 'Homemaker' },
                    { value: 'student', label: 'Student' },
                    { value: 'retired', label: 'Retired' },
                    { value: 'other', label: 'Other' }
                ]
            },
            {
                id: 'S0Q4',
                type: 'single',
                text: 'What is your current relationship status?',
                options: [
                    { value: 'single', label: 'Single' },
                    { value: 'relationship', label: 'In a Relationship' },
                    { value: 'married', label: 'Married' },
                    { value: 'divorced', label: 'Divorced / Separated' },
                    { value: 'widowed', label: 'Widowed' }
                ]
            },
            {
                id: 'S0Q5',
                type: 'single',
                text: 'How many people are you responsible for daily?',
                options: [
                    { value: '0', label: 'Just myself' },
                    { value: '1-2', label: '1-2 people' },
                    { value: '3-4', label: '3-4 people' },
                    { value: '5+', label: '5 or more people' }
                ]
            }
        ]
    },

    // Section 1 - Responsibility Load (RO) - All NEGATIVE
    section1: {
        id: 'responsibility-load',
        title: 'Responsibility Load',
        subtitle: 'How much are you carrying on your shoulders?',
        icon: '⚖️',
        scored: true,
        dimension: 'RO',
        questions: [
            {
                id: 'S1Q1',
                type: 'likert',
                text: 'I feel like I\'m carrying too many responsibilities at once.',
                negative: true
            },
            {
                id: 'S1Q2',
                type: 'likert',
                text: 'I often sacrifice my own needs for others.',
                negative: true
            },
            {
                id: 'S1Q3',
                type: 'likert',
                text: 'I feel guilty when I take time for myself.',
                negative: true
            },
            {
                id: 'S1Q4',
                type: 'likert',
                text: 'I\'m constantly managing everyone else\'s problems.',
                negative: true
            },
            {
                id: 'S1Q5',
                type: 'likert',
                text: 'I rarely have time to focus on my own dreams and goals.',
                negative: true
            },
            {
                id: 'S1Q6',
                type: 'likert',
                text: 'I feel exhausted from always being the "strong one".',
                negative: true
            }
        ]
    },

    // Section 2 - Emotional Overwhelm (EO) - All NEGATIVE
    section2: {
        id: 'emotional-overwhelm',
        title: 'Emotional Overwhelm',
        subtitle: 'Understanding your emotional energy patterns',
        icon: '💭',
        scored: true,
        dimension: 'EO',
        questions: [
            {
                id: 'S2Q1',
                type: 'likert',
                text: 'I often feel emotionally drained by the end of the day.',
                negative: true
            },
            {
                id: 'S2Q2',
                type: 'likert',
                text: 'Small things irritate me more than they should.',
                negative: true
            },
            {
                id: 'S2Q3',
                type: 'likert',
                text: 'I struggle to process my emotions in a healthy way.',
                negative: true
            },
            {
                id: 'S2Q4',
                type: 'likert',
                text: 'I feel anxious or worried about the future.',
                negative: true
            },
            {
                id: 'S2Q5',
                type: 'likert',
                text: 'I often feel like crying but hold it in.',
                negative: true
            },
            {
                id: 'S2Q6',
                type: 'likert',
                text: 'I feel disconnected from joy and happiness.',
                negative: true
            }
        ]
    },

    // Section 3 - Body & Health (BD) - Mixed scoring
    section3: {
        id: 'body-health',
        title: 'Body & Health',
        subtitle: 'Your physical energy and well-being',
        icon: '🌿',
        scored: true,
        dimension: 'BD',
        questions: [
            {
                id: 'S3Q1',
                type: 'likert',
                text: 'I have consistent energy throughout the day.',
                negative: false, // POSITIVE - reverse scored
                reverse: true
            },
            {
                id: 'S3Q2',
                type: 'likert',
                text: 'I often experience physical tension, headaches, or body pain.',
                negative: true
            },
            {
                id: 'S3Q3',
                type: 'likert',
                text: 'I struggle with fatigue or low energy levels.',
                negative: true
            },
            {
                id: 'S3Q4',
                type: 'categorical',
                text: 'How many hours of quality sleep do you typically get?',
                negative: true,
                mapping: 'sleep',
                options: [
                    { value: '<5h', label: 'Less than 5 hours', score: 100 },
                    { value: '5-6h', label: '5-6 hours', score: 75 },
                    { value: '6-7h', label: '6-7 hours', score: 50 },
                    { value: '7-8h', label: '7-8 hours', score: 25 },
                    { value: '8h+', label: '8+ hours', score: 0 }
                ]
            },
            {
                id: 'S3Q5',
                type: 'categorical',
                text: 'How often do you engage in physical movement or exercise?',
                negative: true,
                mapping: 'movement',
                options: [
                    { value: 'almost-never', label: 'Almost never', score: 100 },
                    { value: '1-2-days', label: '1-2 days per week', score: 75 },
                    { value: '3-4-days', label: '3-4 days per week', score: 50 },
                    { value: '5+-days', label: '5+ days per week', score: 25 }
                ]
            },
            {
                id: 'S3Q6',
                type: 'likert',
                text: 'I feel comfortable and confident in my body.',
                negative: false, // POSITIVE - reverse scored
                reverse: true
            }
        ]
    },

    // Section 4 - Belief Blocks (BB) - S4Q5 is positive (reverse), others negative
    section4: {
        id: 'belief-blocks',
        title: 'Belief Blocks',
        subtitle: 'Uncovering limiting patterns in your mindset',
        icon: '🔓',
        scored: true,
        dimension: 'BB',
        questions: [
            {
                id: 'S4Q1',
                type: 'likert',
                text: 'I often doubt my abilities and potential.',
                negative: true
            },
            {
                id: 'S4Q2',
                type: 'likert',
                text: 'I believe that good things don\'t last for me.',
                negative: true
            },
            {
                id: 'S4Q3',
                type: 'likert',
                text: 'I feel unworthy of abundance and success.',
                negative: true
            },
            {
                id: 'S4Q4',
                type: 'likert',
                text: 'I have a hard time receiving compliments or help.',
                negative: true
            },
            {
                id: 'S4Q5',
                type: 'likert',
                text: 'I believe I can create the life I desire.',
                negative: false, // POSITIVE - reverse scored
                reverse: true
            },
            {
                id: 'S4Q6',
                type: 'likert',
                text: 'I compare myself negatively to others.',
                negative: true
            }
        ]
    },

    // Section 5 - Spiritual Alignment (SP) - All POSITIVE
    section5: {
        id: 'spiritual-alignment',
        title: 'Spiritual Alignment',
        subtitle: 'Your connection to purpose and higher self',
        icon: '✨',
        scored: true,
        dimension: 'SP',
        questions: [
            {
                id: 'S5Q1',
                type: 'likert',
                text: 'I feel connected to a purpose greater than myself.',
                negative: false
            },
            {
                id: 'S5Q2',
                type: 'likert',
                text: 'I trust that the universe/life is supporting me.',
                negative: false
            },
            {
                id: 'S5Q3',
                type: 'likert',
                text: 'I practice gratitude regularly.',
                negative: false
            },
            {
                id: 'S5Q4',
                type: 'likert',
                text: 'I take time for meditation, prayer, or self-reflection.',
                negative: false
            },
            {
                id: 'S5Q5',
                type: 'likert',
                text: 'I feel aligned with my intuition and inner wisdom.',
                negative: false
            },
            {
                id: 'S5Q6',
                type: 'likert',
                text: 'I experience moments of peace and inner calm.',
                negative: false
            }
        ]
    },

    // Section 6 - Support & Environment (SS) - S6Q4 is negative (reverse), others positive
    section6: {
        id: 'support-environment',
        title: 'Support & Environment',
        subtitle: 'Your circle of influence and surroundings',
        icon: '🤝',
        scored: true,
        dimension: 'SS',
        questions: [
            {
                id: 'S6Q1',
                type: 'likert',
                text: 'I have people who genuinely support my growth.',
                negative: false
            },
            {
                id: 'S6Q2',
                type: 'likert',
                text: 'My home environment feels peaceful and nurturing.',
                negative: false
            },
            {
                id: 'S6Q3',
                type: 'likert',
                text: 'I feel safe expressing my true self with my close ones.',
                negative: false
            },
            {
                id: 'S6Q4',
                type: 'likert',
                text: 'I often feel drained by the people around me.',
                negative: true, // NEGATIVE - needs to be reverse scored
                reverse: true
            },
            {
                id: 'S6Q5',
                type: 'likert',
                text: 'I have at least one person I can fully open up to.',
                negative: false
            }
        ]
    },

    // Section 7 - Readiness (Partially Scored)
    section7: {
        id: 'readiness',
        title: 'Readiness for Transformation',
        subtitle: 'Your commitment to change',
        icon: '🚀',
        scored: true,
        dimension: 'RS',
        questions: [
            {
                id: 'S7Q1',
                type: 'categorical',
                text: 'How ready are you to invest time and energy in your transformation?',
                mapping: 'readiness',
                options: [
                    { value: 'not-ready', label: 'Not ready right now', score: 0 },
                    { value: 'maybe-months', label: 'Maybe in a few months', score: 33 },
                    { value: 'ready-need-help', label: 'Ready, but need accountability', score: 66 },
                    { value: '100-ready', label: '100% ready to start now!', score: 100 }
                ]
            },
            {
                id: 'S7Q2',
                type: 'single',
                text: 'What is your biggest challenge right now?',
                scored: false,
                options: [
                    { value: 'overwhelm', label: 'Feeling overwhelmed and exhausted' },
                    { value: 'confidence', label: 'Lack of confidence and self-belief' },
                    { value: 'direction', label: 'Not knowing my direction in life' },
                    { value: 'health', label: 'Health and energy issues' },
                    { value: 'relationships', label: 'Relationship challenges' },
                    { value: 'finances', label: 'Financial stress' }
                ]
            },
            {
                id: 'S7Q3',
                type: 'categorical',
                text: 'What level of investment are you comfortable with for your transformation?',
                mapping: 'investment',
                options: [
                    { value: '<1000', label: 'Under ₹1,000', score: 25 },
                    { value: '1000-3000', label: '₹1,000 - ₹3,000', score: 50 },
                    { value: '3000-5000', label: '₹3,000 - ₹5,000', score: 75 },
                    { value: '5000+', label: '₹5,000+', score: 100 }
                ]
            }
        ]
    }
};

// Likert scale labels
const likertLabels = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree'
};

// Section order for navigation
const sectionOrder = [
    'section0',
    'section1',
    'section2',
    'section3',
    'section4',
    'section5',
    'section6',
    'section7'
];

// Updated Archetype definitions with mature, professional names
const archetypes = {
    restingPhase: {
        name: 'The Resting Phase',
        icon: '🌙',
        range: [0, 40],
        description: 'Your energy is calling for deep restoration and gentle nurturing. Like the quiet before dawn, this phase is not a weakness—it\'s an invitation to pause, reflect, and rebuild your foundation. Your soul is asking for permission to rest, and honoring this need is the first step toward transformation. You\'ve been giving so much; now it\'s time to receive.',
        color: '#6B7280',
        otoMessage: 'It\'s time to honor your need for restoration. The 21-Day Energy Reset is designed specifically for women like you who have given so much and are ready to refill their well with compassion and care.'
    },
    awakeningPhase: {
        name: 'The Awakening Phase',
        icon: '🌅',
        range: [41, 60],
        description: 'You are in a beautiful state of emerging awareness. Like the first light of sunrise, you\'re beginning to see new possibilities and reconnect with your inner power. Some days feel aligned, others feel uncertain—this is natural. You\'re not lost; you\'re awakening. With the right support, you can move steadily toward consistent alignment and inner peace.',
        color: '#F59E0B',
        otoMessage: 'You\'re at a pivotal moment in your journey. The 21-Day Energy Reset will provide the daily structure and gentle guidance you need to stabilize your energy and step into consistent alignment.'
    },
    risingPhase: {
        name: 'The Rising Phase',
        icon: '🌸',
        range: [61, 80],
        description: 'Your energy is building beautiful momentum. You\'ve done meaningful inner work, and it shows in how you carry yourself. You understand the importance of nurturing your energy and you\'re actively cultivating it. There\'s still room to expand, but you\'re well on your way to full alignment. Your potential is blossoming.',
        color: '#8B5CF6',
        otoMessage: 'You\'re ready to fully bloom. The 21-Day Energy Reset will help you release any remaining blocks and accelerate your journey into radiant alignment.'
    },
    radiantPhase: {
        name: 'The Radiant Phase',
        icon: '✨',
        range: [81, 100],
        description: 'You are in beautiful alignment with your highest self. Your energy flows freely, your spirit is nourished, and you naturally attract abundance and opportunity. You\'ve mastered the art of self-care without guilt and understand that protecting your energy creates space for magic. People are drawn to your authentic light and presence.',
        color: '#10B981',
        otoMessage: 'Congratulations on your radiant alignment. The 21-Day Energy Reset will help you maintain and elevate your vibration even further, while learning advanced techniques to share your light with others.'
    }
};

// Dimension display names and icons
const dimensionInfo = {
    RO: { name: 'Responsibility Load', icon: '⚖️', interpretation: 'Lower is better' },
    EO: { name: 'Emotional Overwhelm', icon: '💭', interpretation: 'Lower is better' },
    BD: { name: 'Body & Health Drain', icon: '🌿', interpretation: 'Lower is better' },
    BB: { name: 'Belief Blocks', icon: '🔓', interpretation: 'Lower is better' },
    SP: { name: 'Spiritual Alignment', icon: '✨', interpretation: 'Higher is better' },
    SS: { name: 'Support & Environment', icon: '🤝', interpretation: 'Higher is better' },
    OGI: { name: 'Overwhelm & Guilt Index', icon: '📊', interpretation: 'Lower is better' },
    RCI: { name: 'Resilience & Connection Index', icon: '💪', interpretation: 'Higher is better' },
    BMH: { name: 'Body-Mind Harmony', icon: '🧘', interpretation: 'Higher is better' }
};
