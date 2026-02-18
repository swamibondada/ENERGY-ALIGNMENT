// Scoring Logic for Energy Alignment Quiz
// Implements all scoring rules as specified in the framework

const ScoringEngine = {
    // Likert mapping: 1→0, 2→25, 3→50, 4→75, 5→100
    likertMap: {
        1: 0,
        2: 25,
        3: 50,
        4: 75,
        5: 100
    },

    // Reverse score: 100 - mapped value
    reverseScore(score) {
        return 100 - score;
    },

    // Map Likert value to score
    mapLikert(value) {
        return this.likertMap[value] || 0;
    },

    // Calculate score for a single question
    calculateQuestionScore(question, answer) {
        if (!answer) return null;

        let score;

        if (question.type === 'likert') {
            const rawScore = this.mapLikert(parseInt(answer));
            // If the question is positive (negative: false) and reverse: true, reverse the score
            // This applies to questions where high agreement = low burden
            if (question.reverse) {
                score = this.reverseScore(rawScore);
            } else {
                score = rawScore;
            }
        } else if (question.type === 'categorical') {
            // Find the option and get its score
            const option = question.options.find(opt => opt.value === answer);
            score = option ? option.score : 0;
        } else {
            // Non-scored questions (text, single without score)
            return null;
        }

        return score;
    },

    // Calculate dimension score (average of question scores)
    calculateDimensionScore(sectionKey, answers) {
        const section = quizData[sectionKey];
        if (!section || !section.scored) return null;

        const scores = [];

        section.questions.forEach(question => {
            const answer = answers[question.id];

            // Skip non-scored questions
            if (question.scored === false) return;

            const score = this.calculateQuestionScore(question, answer);
            if (score !== null) {
                scores.push(score);
            }
        });

        if (scores.length === 0) return null;

        return scores.reduce((sum, s) => sum + s, 0) / scores.length;
    },

    // Calculate all dimension scores
    calculateAllDimensions(answers) {
        const dimensions = {};

        // Section 1: Responsibility Load (RO)
        dimensions.RO = this.calculateDimensionScore('section1', answers);

        // Section 2: Emotional Overwhelm (EO)
        dimensions.EO = this.calculateDimensionScore('section2', answers);

        // Section 3: Body & Health (BD)
        dimensions.BD = this.calculateDimensionScore('section3', answers);

        // Section 4: Belief Blocks (BB)
        dimensions.BB = this.calculateDimensionScore('section4', answers);

        // Section 5: Spiritual Alignment (SP)
        dimensions.SP = this.calculateDimensionScore('section5', answers);

        // Section 6: Support & Environment (SS)
        dimensions.SS = this.calculateDimensionScore('section6', answers);

        // Section 7: Readiness Score (RS)
        // RS = (S7Q1 + S7Q3) / 2
        const s7q1Answer = answers['S7Q1'];
        const s7q3Answer = answers['S7Q3'];

        let s7q1Score = 0;
        let s7q3Score = 0;

        if (s7q1Answer) {
            const q1 = quizData.section7.questions.find(q => q.id === 'S7Q1');
            const opt1 = q1.options.find(o => o.value === s7q1Answer);
            s7q1Score = opt1 ? opt1.score : 0;
        }

        if (s7q3Answer) {
            const q3 = quizData.section7.questions.find(q => q.id === 'S7Q3');
            const opt3 = q3.options.find(o => o.value === s7q3Answer);
            s7q3Score = opt3 ? opt3.score : 0;
        }

        dimensions.RS = (s7q1Score + s7q3Score) / 2;

        return dimensions;
    },

    // Calculate Composite Indices
    calculateCompositeIndices(dimensions) {
        const indices = {};

        // OGI (Overwhelm & Guilt Index) = 0.40*RO + 0.30*EO + 0.30*BB
        indices.OGI = (0.40 * dimensions.RO) + (0.30 * dimensions.EO) + (0.30 * dimensions.BB);

        // RCI (Resilience & Connection Index) = ((100 - BB) + SP + SS) / 3
        indices.RCI = ((100 - dimensions.BB) + dimensions.SP + dimensions.SS) / 3;

        // BMH (Body-Mind Harmony) = ((100 - BD) + (100 - EO) + (100 - RO)) / 3
        indices.BMH = ((100 - dimensions.BD) + (100 - dimensions.EO) + (100 - dimensions.RO)) / 3;

        return indices;
    },

    // Calculate Final Energy Alignment Score
    calculateEAS(indices, dimensions) {
        // EAS = (BMH + RCI + RS) / 3
        const eas = (indices.BMH + indices.RCI + dimensions.RS) / 3;
        return Math.round(eas);
    },

    // Determine Archetype based on EAS
    determineArchetype(eas) {
        if (eas <= 40) {
            return archetypes.restingPhase;
        } else if (eas <= 60) {
            return archetypes.awakeningPhase;
        } else if (eas <= 80) {
            return archetypes.risingPhase;
        } else {
            return archetypes.radiantPhase;
        }
    },

    // Generate Key Insights based on scores
    generateInsights(dimensions, indices, archetype) {
        const insights = [];

        // Insight 1: Based on archetype
        insights.push({
            icon: archetype.icon,
            text: `As someone in <strong>${archetype.name}</strong>, ${this.getArchetypeInsight(archetype)}`
        });

        // Insight 2: Highest burden area
        const burdenAreas = {
            RO: dimensions.RO,
            EO: dimensions.EO,
            BD: dimensions.BD,
            BB: dimensions.BB
        };
        const highestBurden = Object.entries(burdenAreas)
            .sort((a, b) => b[1] - a[1])[0];

        insights.push({
            icon: dimensionInfo[highestBurden[0]].icon,
            text: `Your highest energy drain is in <strong>${dimensionInfo[highestBurden[0]].name}</strong> (${Math.round(highestBurden[1])}%). This is where focused healing will have the greatest impact.`
        });

        // Insight 3: Strength area
        const strengthAreas = {
            SP: dimensions.SP,
            SS: dimensions.SS
        };
        const highestStrength = Object.entries(strengthAreas)
            .sort((a, b) => b[1] - a[1])[0];

        if (highestStrength[1] >= 50) {
            insights.push({
                icon: dimensionInfo[highestStrength[0]].icon,
                text: `Your strength lies in <strong>${dimensionInfo[highestStrength[0]].name}</strong> (${Math.round(highestStrength[1])}%). This is a foundation you can build upon.`
            });
        }

        // Insight 4: Body-Mind Harmony
        if (indices.BMH < 50) {
            insights.push({
                icon: '🧘',
                text: `Your <strong>Body-Mind Harmony</strong> score (${Math.round(indices.BMH)}%) suggests a disconnect between your physical and emotional well-being. Prioritizing self-care routines will help restore balance.`
            });
        } else {
            insights.push({
                icon: '🧘',
                text: `Your <strong>Body-Mind Harmony</strong> score (${Math.round(indices.BMH)}%) shows promising alignment between your physical and emotional states. Continue nurturing this connection.`
            });
        }

        // Insight 5: Readiness
        if (dimensions.RS >= 66) {
            insights.push({
                icon: '🚀',
                text: `Your <strong>Readiness for Transformation</strong> (${Math.round(dimensions.RS)}%) shows you're committed to change. This is the perfect time to take action!`
            });
        }

        return insights;
    },

    getArchetypeInsight(archetype) {
        switch (archetype.name) {
            case 'The Resting Phase':
                return 'your energy is calling for deep restoration. Your journey begins with gentle self-compassion and honoring your need to pause.';
            case 'The Awakening Phase':
                return 'you\'re in a beautiful state of emerging awareness. With the right support, you can move steadily toward consistent alignment.';
            case 'The Rising Phase':
                return 'your energy is building momentum. A few targeted practices can help you fully step into your radiant potential.';
            case 'The Radiant Phase':
                return 'you\'ve cultivated beautiful alignment. Your focus now is on maintaining this vibration and sharing your authentic light.';
            default:
                return 'your energy profile is unique and full of potential for growth.';
        }
    },

    // Main function to calculate everything
    calculateResults(answers) {
        const dimensions = this.calculateAllDimensions(answers);
        const indices = this.calculateCompositeIndices(dimensions);
        const eas = this.calculateEAS(indices, dimensions);
        const archetype = this.determineArchetype(eas);
        const insights = this.generateInsights(dimensions, indices, archetype);

        return {
            dimensions: {
                RO: Math.round(dimensions.RO),
                EO: Math.round(dimensions.EO),
                BD: Math.round(dimensions.BD),
                BB: Math.round(dimensions.BB),
                SP: Math.round(dimensions.SP),
                SS: Math.round(dimensions.SS),
                RS: Math.round(dimensions.RS)
            },
            indices: {
                OGI: Math.round(indices.OGI),
                RCI: Math.round(indices.RCI),
                BMH: Math.round(indices.BMH)
            },
            eas: eas,
            archetype: archetype,
            insights: insights,
            userName: answers['S0Q1'] || 'Beautiful Soul'
        };
    }
};
