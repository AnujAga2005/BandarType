class TypingTest {
    constructor() {
        this.currentTest = null;
        this.currentTime = 30;
        this.isRunning = false;
        this.startTime = null;
        this.words = [];
        this.currentWordIndex = 0;
        this.typedWords = [];
        this.errors = 0;
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        this.timer = null;
        this.timeRemaining = 30;
        
        this.initializeElements();
        this.bindEvents();
        this.loadWords();
    }

    initializeElements() {
        this.typingInput = document.getElementById('typing-input');
        this.typingText = document.getElementById('typing-text');
        this.typingInterface = document.getElementById('typing-interface');
        this.statsBar = document.querySelector('.stats-bar');
        this.results = document.getElementById('results');
        this.restartBtn = document.getElementById('restart-btn');
        this.newTestBtn = document.getElementById('new-test-btn');
        
        // Stats elements
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.timeElement = document.getElementById('time');
        this.charactersElement = document.getElementById('characters');
        
        // Final results elements
        this.finalWpmElement = document.getElementById('final-wpm');
        this.finalAccuracyElement = document.getElementById('final-accuracy');
        this.finalTimeElement = document.getElementById('final-time');
        this.finalCharactersElement = document.getElementById('final-characters');
    }

    bindEvents() {
        // Test type selection
        document.querySelectorAll('[data-test]').forEach(box => {
            box.addEventListener('click', (e) => {
                this.selectTestType(e.target.closest('[data-test]').dataset.test);
            });
        });

        // Time selection
        document.querySelectorAll('[data-time]').forEach(box => {
            box.addEventListener('click', (e) => {
                this.selectTime(parseInt(e.target.closest('[data-time]').dataset.time));
            });
        });

        // Typing input
        this.typingInput.addEventListener('input', (e) => {
            this.handleTyping(e.target.value);
        });

        // Restart button
        this.restartBtn.addEventListener('click', () => {
            this.restartTest();
        });

        // New test button
        this.newTestBtn.addEventListener('click', () => {
            this.startNewTest();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.restartTest();
            }
            
            // Tab + Enter to restart
            if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                this.restartTest();
            }
        });

        // Click on typing interface to focus input
        this.typingInterface.addEventListener('click', () => {
            if (!this.typingInput.disabled) {
                this.typingInput.focus();
            }
        });
    }

    loadWords() {
        // Sample words for different test types
        this.wordLists = {
            punctuation: [
                "Hello, world! How are you today? I hope you're doing well. Let's practice some punctuation marks: semicolons; colons: apostrophes' and quotation marks \"like this\". Don't forget about parentheses (they're useful too). What about question marks? And exclamation points! They add emphasis to your writing.",
                "The quick, brown fox jumps over the lazy little dog. \"What?\" said the dog. \"I wasn't lazy!\" The fox replied, \"Well, you're certainly not quick.\" This is a common typing test; it contains many punctuation marks. Let's see: commas, periods, quotation marks, apostrophes, and more!",
                "Programming languages use many symbols: {}, [], (), <>, +=, -=, *=, /=, ==, !=, <=, >=, &&, ||, ++, --, /*, */, //, #, $, %, ^, &, |, ~, `, @, and more. Can you type them all accurately? It's quite challenging, isn't it?",
                "This is one of the best website for typing test, made by chirag"
            ],
            numbers: [
                "The year 2024 marks an important milestone. In 1969, humans first landed on the moon. The Apollo 11 mission lasted 8 days, 3 hours, 18 minutes, and 35 seconds. Neil Armstrong was 38 years old at the time. The distance to the moon is approximately 238,855 miles or 384,400 kilometers.",
                "Here are some random numbers to practice: 12345, 67890, 13579, 24680. The temperature today is 75°F or 23.9°C. My phone number is 555-123-4567. The time is 3:45 PM. I have $1,234.56 in my bank account. The score was 21-14 in the final quarter.",
                "Statistical data shows that 73% of people prefer typing numbers mixed with text. In the year 1995, only 16% of households had internet access. Today, that number has grown to over 89%. The average typing speed is between 35-40 WPM, while professionals can reach 65-75 WPM or higher.",
                "This is 1 of the best website for typing test, made by Chirag. You can use this at any time to improve your typing speed and accuracy 100%."
            ],
            time: [
                "Time flies when you're having fun, but it crawls when you're bored. Every second counts in this race against the clock. The timer is ticking, so make every keystroke count. Efficient time management is crucial for success in both typing tests and real life applications.",
                "Morning comes early at 6:00 AM sharp. The workday starts at 9:00 AM and ends at 5:00 PM. Lunch break is from 12:00 PM to 1:00 PM. The meeting is scheduled for 2:30 PM and should last about 90 minutes. Don't forget the deadline is tomorrow at midnight.",
                "Procrastination is the thief of time. Yesterday is history, tomorrow is a mystery, but today is a gift - that's why it's called the present. Time waits for no one, so seize the moment and make the most of every opportunity that comes your way.",
                "This is one of the best website for typing test, made by Chirag. You can use this at any time 24/7 to improve your typing speed and accuracy."
            ],
            words: [
                "Programming is the art of telling another human being what one wants the computer to do. The best way to predict the future is to implement it yourself. Code is like humor - when you have to explain it, it's probably not very good. First solve the problem, then write the code.",
                "The quick brown fox jumps over the lazy dog near the riverbank. This sentence contains every letter of the alphabet and is commonly used for typing practice. It's a pangram that helps test keyboard layouts and typing skills across all letter keys.",
                "Success is not final, failure is not fatal, it is the courage to continue that counts. The only way to do great work is to love what you do. Innovation distinguishes between a leader and a follower. Your time is limited, don't waste it living someone else's life.",
                "This is one of the best website for typing test, made by Chirag. You can use this at any time to improve your typing speed and accuracy."
            ],
            lowercase: [
                "the quick brown fox jumps over the lazy little dog and runs through the meadow. all letters in this sentence are lowercase except for proper nouns and the beginning of sentences. this helps practice consistent finger placement without worrying about shift keys.",
                "practice makes perfect and consistency is the key to improvement. every day brings new opportunities to enhance your skills. focus on accuracy first, then gradually increase your typing speed. remember that muscle memory develops through repetition and patience.",
                "typewriters were once the primary tool for document creation. today we use keyboards and computers for most of our writing needs. the qwerty layout was designed to prevent mechanical jams in early typewriters. modern keyboards have evolved significantly from those early designs.",
                "this is one of the best website for typing test, made by chirag. you can use this at any time to improve your typing speed and accuracy."
            ],
            custom: [
                "Create your own path and walk it with confidence and determination. Innovation distinguishes between a leader and a follower in any field. The greatest glory in living lies not in never falling, but in rising every time we fall and learning from our mistakes.",
                "Your time is limited, so don't waste it living someone else's life or following someone else's dreams. The way to get started is to quit talking and begin doing what you've always wanted to accomplish. Take action today rather than waiting for perfect conditions.",
                "Believe you can and you're halfway there to achieving your goals. The future belongs to those who believe in the beauty of their dreams and work tirelessly to make them reality. Success is not the key to happiness; happiness is the key to success and fulfillment.",
                "This is one of the best website for typing test, made by Chirag. You can use this at any time to improve your typing speed and accuracy."
            ]
        };
    }

    selectTestType(testType) {  
        // Remove active class from all test type boxes
        document.querySelectorAll('[data-test]').forEach(box => {
            box.classList.remove('active');
        });
        
        // Add active class to selected box
        document.querySelector(`[data-test="${testType}"]`).classList.add('active');
        
        this.currentTest = testType;
        this.prepareTest();
    }

    selectTime(time) {
        // Remove active class from all time boxes
        document.querySelectorAll('[data-time]').forEach(box => {
            box.classList.remove('active');
        });
        
        // Add active class to selected box
        document.querySelector(`[data-time="${time}"]`).classList.add('active');
        
        this.currentTime = time;
        this.timeRemaining = time;
        this.timeElement.textContent = `${time}s`;
        
        if (this.currentTest) {
            this.prepareTest();
        }
    }

    prepareTest() {
        if (!this.currentTest) return;
        
        // Stop any existing timer
        this.stopTest();
        
        // Get random text for the selected test type
        const texts = this.wordLists[this.currentTest];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        
        this.words = randomText.split(' ');
        this.currentWordIndex = 0;
        this.typedWords = [];
        this.errors = 0;
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        this.isRunning = false;
        this.timeRemaining = this.currentTime;
        
        this.displayText();
        this.typingInput.disabled = false;
        this.typingInput.focus();
        this.typingInput.value = '';
        
        // Hide results if visible
        this.results.style.display = 'none';
        this.restartBtn.style.display = 'block';
        
        // Reset stats
        this.updateStats();
        this.timeElement.textContent = `${this.currentTime}s`;
    }

    displayText() {
        let html = '';
        this.words.forEach((word, index) => {
            if (index < this.currentWordIndex) {
                // Word already typed
                const typedWord = this.typedWords[index];
                if (typedWord === word) {
                    html += `<span class="correct">${word}</span> `;
                } else {
                    html += `<span class="incorrect">${word}</span> `;
                }
            } else if (index === this.currentWordIndex) {
                // Current word
                html += `<span class="current">${word}</span> `;
            } else {
                // Future words
                html += `<span class="future">${word}</span> `;
            }
        });
        
        this.typingText.innerHTML = html.trim();
    }

    handleTyping(input) {
        if (!this.isRunning && input.length > 0) {
            this.startTest();
        }
        
        const currentWord = this.words[this.currentWordIndex];
        if (!currentWord) return;
        
        // Update the current word display with character-by-character feedback
        this.updateCurrentWordDisplay(currentWord, input);
        
        if (input.endsWith(' ')) {
            // Word completed
            const typedWord = input.trim();
            this.typedWords[this.currentWordIndex] = typedWord;
            
            // Count characters correctly
            this.totalCharacters += typedWord.length + 1; // +1 for space
            
            if (typedWord === currentWord) {
                this.correctCharacters += currentWord.length + 1;
            } else {
                this.errors++;
                // Add correct characters that match
                for (let i = 0; i < Math.min(typedWord.length, currentWord.length); i++) {
                    if (typedWord[i] === currentWord[i]) {
                        this.correctCharacters++;
                    }
                }
                this.correctCharacters++; // space
            }
            
            this.currentWordIndex++;
            
            // Clear input
            this.typingInput.value = '';
            
            if (this.currentWordIndex >= this.words.length) {
                this.completeTest();
                return;
            }
            
            this.displayText();
        } else {
            // Update character count for current typing (without space)
            // This is just for display purposes during typing
        }
        
        this.updateStats();
    }
    
    updateCurrentWordDisplay(currentWord, input) {
        let html = '';
        
        // Display already completed words
        for (let i = 0; i < this.currentWordIndex; i++) {
            const word = this.words[i];
            const typedWord = this.typedWords[i];
            if (typedWord === word) {
                html += `<span class="correct">${word}</span> `;
            } else {
                html += `<span class="incorrect">${word}</span> `;
            }
        }
        
        // Display current word with character-by-character feedback
        if (currentWord) {
            let currentWordHtml = '';
            const cleanInput = input.replace(' ', ''); // Remove trailing space for character comparison
            
            for (let i = 0; i < currentWord.length; i++) {
                if (i < cleanInput.length) {
                    if (cleanInput[i] === currentWord[i]) {
                        currentWordHtml += `<span class="correct-char">${currentWord[i]}</span>`;
                    } else {
                        currentWordHtml += `<span class="incorrect-char">${currentWord[i]}</span>`;
                    }
                } else if (i === cleanInput.length) {
                    // Add cursor at the current position
                    currentWordHtml += `<span class="typing-cursor"></span><span class="current-char">${currentWord[i]}</span>`;
                } else {
                    currentWordHtml += `<span class="current-char">${currentWord[i]}</span>`;
                }
            }
            
            // If we've typed all characters, add cursor at the end
            if (cleanInput.length >= currentWord.length && !input.endsWith(' ')) {
                currentWordHtml += '<span class="typing-cursor"></span>';
            }
            
            html += `<span class="current">${currentWordHtml}</span> `;
        }
        
        // Display future words
        for (let i = this.currentWordIndex + 1; i < this.words.length; i++) {
            html += `<span class="future">${this.words[i]}</span> `;
        }
        
        this.typingText.innerHTML = html.trim();
    }

    startTest() {
        this.isRunning = true;
        this.startTime = Date.now();
        
        // Start timer
        this.timer = setInterval(() => {
            this.timeRemaining--;
            
            if (this.timeRemaining <= 0) {
                this.completeTest();
                return;
            }
            
            this.timeElement.textContent = `${this.timeRemaining}s`;
        }, 1000);
    }

    stopTest() {
        this.isRunning = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    completeTest() {
        this.stopTest();
        
        // Calculate final stats
        const timeElapsed = this.currentTime - this.timeRemaining;
        const wpm = this.calculateWPM(timeElapsed);
        const accuracy = this.calculateAccuracy();
        
        // Display results
        this.showResults(wpm, accuracy, timeElapsed);
        
        // Disable input
        this.typingInput.disabled = true;
        this.restartBtn.style.display = 'none';
    }

    calculateWPM(timeElapsed) {
        if (timeElapsed === 0) return 0;
        const minutes = timeElapsed / 60;
        // Use correct characters divided by 5 (standard word length) for WPM calculation
        const wordsTyped = this.correctCharacters / 5;
        return Math.round(wordsTyped / minutes);
    }

    calculateAccuracy() {
        if (this.totalCharacters === 0) return 100;
        return Math.round((this.correctCharacters / this.totalCharacters) * 100);
    }

    updateStats() {
        if (!this.isRunning) return;
        
        const timeElapsed = this.currentTime - this.timeRemaining;
        const wpm = this.calculateWPM(timeElapsed);
        const accuracy = this.calculateAccuracy();
        
        this.wpmElement.textContent = wpm;
        this.accuracyElement.textContent = `${accuracy}%`;
        this.charactersElement.textContent = this.totalCharacters;
    }

    showResults(wpm, accuracy, timeElapsed) {
        this.finalWpmElement.textContent = wpm;
        this.finalAccuracyElement.textContent = `${accuracy}%`;
        this.finalTimeElement.textContent = `${timeElapsed}s`;
        this.finalCharactersElement.textContent = this.totalCharacters;
        
        this.results.style.display = 'block';
        
        // Scroll to results
        this.results.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    restartTest() {
        this.stopTest();
        if (this.currentTest) {
            this.prepareTest();
        }
    }

    startNewTest() {
        this.stopTest();
        this.results.style.display = 'none';
        this.restartBtn.style.display = 'none';
        this.typingInput.disabled = true;
        this.typingText.innerHTML = 'Click any test type above to start your typing test...';
        
        // Reset all active states
        document.querySelectorAll('[data-test], [data-time]').forEach(box => {
            box.classList.remove('active');
        });
        
        this.currentTest = null;
        this.currentTime = 30;
        this.timeRemaining = 30;
        
        // Reset stats
        this.wpmElement.textContent = '0';
        this.accuracyElement.textContent = '100%';
        this.timeElement.textContent = '30s';
        this.charactersElement.textContent = '0';
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});