// Quiz data with questions, weights, and rarity
const quizData = [
    {
        question: "Lost money in the FTX drama?",
        rarity: "Common",
        weight: 5
    },
    {
        question: "Made more than $100 in Scroll airdrop?",
        rarity: "Fairly common",
        weight: 10
    },
    {
        question: "Eligible for Hyperliquid airdrop?",
        rarity: "Uncommon",
        weight: 12
    },
    {
        question: "Ever qualified for a single airdrop on more than 3 wallets?",
        rarity: "Rare",
        weight: 15
    },
    {
        question: "Traded on PumpFUN more than 10 times?",
        rarity: "Common",
        weight: -5
    },
    {
        question: "Ever got your wallet drained?",
        rarity: "Uncommon",
        weight: 12
    },
    {
        question: "Got sybiled out in LayerZero airdrop?",
        rarity: "Rare",
        weight: 15
    },
    {
        question: "More than 100 yaps on Kaito?",
        rarity: "Very rare",
        weight: 20
    },
    {
        question: "Got an airdrop for running a node?",
        rarity: "Uncommon",
        weight: 12
    },
    {
        question: "Made more than $1,000 on $JUP airdrop?",
        rarity: "Rare",
        weight: 15
    },
    {
        question: "Eligible for Sui airdrop?",
        rarity: "Uncommon",
        weight: 12
    },
    {
        question: "Traded in the Magic Eden NFT cycle?",
        rarity: "Fairly common",
        weight: 10
    },
    {
        question: "Got an airdrop for having a Discord role?",
        rarity: "Common",
        weight: 8
    },
    {
        question: "Fell for an airdrop scam or phishing link?",
        rarity: "Common",
        weight: -5
    },
    {
        question: "Missed out an airdrop for not meeting eligibility criteria?",
        rarity: "Very common",
        weight: -8
    },
    {
        question: "Received an airdrop for completing Galxe tasks?",
        rarity: "Uncommon",
        weight: 12
    },
    {
        question: "Participated in BTC ordinals cycle?",
        rarity: "Uncommon",
        weight: 12
    },    {
        question: "Earned more than $2,000 in testnets?",
        rarity: "Very rare",
        weight: 20
    },
    {
        question: "Ever received a reply from @zachxbt on X?",
        rarity: "Ultra rare",
        weight: 25
    }
];

// Calculate maximum possible raw score
const maxRawScore = quizData.reduce((sum, question) => sum + Math.max(0, question.weight), 0);

// Portfolio size brackets with normalized scoring (0-100 scale)
const portfolioBrackets = [
    {
        min: 0,
        max: 20,
        size: "$100s",
        comment: "ngmi ser, maybe try Pokemon cards instead"
    },
    {
        min: 21,
        max: 40,
        size: "$1,000s",
        comment: "you're getting there but still broke af"
    },
    {
        min: 41,
        max: 60,
        size: "$10,000s",
        comment: "respectable bag, finally touching grass less"
    },
    {
        min: 61,
        max: 80,
        size: "$50,000s",
        comment: "chad energy detected, probably drive a lambo"
    },
    {
        min: 81,
        max: 100,
        size: "$100,000s+",
        comment: "absolute degen legend, retirement incoming"
    }
];

// Game state
let currentQuestionIndex = 0;
let totalScore = 0;
let normalizedScore = 0;
let answers = [];
let isTransitioning = false;

// DOM elements
const questionText = document.getElementById('questionText');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionCard = document.getElementById('questionCard');
const quizContainer = document.getElementById('quizContainer');
const resultContainer = document.getElementById('resultContainer');
const progressFill = document.getElementById('progressFill');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const resultPortfolio = document.getElementById('resultPortfolio');
const resultComment = document.getElementById('resultComment');
const cursor = document.getElementById('cursor');
const progressBarsContainer = document.getElementById('progressBarsContainer');

// Bar tracking
let leftBars = [];
let rightBars = [];

// Create initial bars
function createBars() {
    // Clear existing bars
    progressBarsContainer.innerHTML = '';
    leftBars = [];
    rightBars = [];
    
    // Create vertical bars for each question
    for (let i = 0; i < quizData.length; i++) {
        // Left bar - positioned horizontally across left side
        const leftBar = document.createElement('div');
        leftBar.className = 'progress-bar left';
        leftBar.style.left = `${i * (50 / quizData.length)}%`; // Distribute across left 50%
        leftBar.style.width = `${45 / quizData.length}%`; // Slightly less width for spacing
        leftBar.style.height = '0%';
        leftBar.style.background = '#000000';
        progressBarsContainer.appendChild(leftBar);
        leftBars.push(leftBar);
        
        // Right bar - positioned horizontally across right side  
        const rightBar = document.createElement('div');
        rightBar.className = 'progress-bar right';
        rightBar.style.right = `${i * (50 / quizData.length)}%`; // Distribute across right 50%
        rightBar.style.width = `${45 / quizData.length}%`; // Slightly less width for spacing
        rightBar.style.height = '0%';
        rightBar.style.background = '#000000';
        progressBarsContainer.appendChild(rightBar);
        rightBars.push(rightBar);
    }
}

// Simple check - only invert if bars cover more than 80% of screen width
function checkTextInversion() {
    // Removed - no more text inversion logic
}

// Update heading spacing based on progress
function updateHeadingExpansion() {
    const header = document.querySelector('.header h1');
    if (!header) return;
    
    // Calculate expansion based on current question progress
    const progress = currentQuestionIndex / quizData.length;
    
    // More dramatic letter spacing but ensure text stays visible
    // Start from -0.03em and go up to 0.8rem for good spread effect
    const initialSpacing = -0.03;
    const maxLetterSpacing = 0.8; // Increased but controlled
    const currentLetterSpacing = initialSpacing + (progress * maxLetterSpacing);
    
    // Font size increase for emphasis
    const initialFontSize = 2.8;
    const maxFontSize = 3.1; // Slight increase
    const currentFontSize = initialFontSize + (progress * (maxFontSize - initialFontSize));
    
    // Apply the changes
    header.style.letterSpacing = `${currentLetterSpacing}rem`;
    header.style.fontSize = `${currentFontSize}rem`;
    header.style.transition = 'all 0.6s ease-out';
    
    // Allow text to break container boundaries
    header.style.position = 'relative';
    header.style.zIndex = '10';
    header.style.width = '120vw'; // Extend beyond container
    header.style.left = '50%';
    header.style.transform = 'translateX(-50%)';
}

// Custom cursor functionality
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const speed = 1.0; // Match PC's default cursor speed
    
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Initialize the quiz
function initQuiz() {
    totalQuestionsSpan.textContent = quizData.length;
    createBars();
    displayQuestion();
    setupEventListeners();
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        showResult();
        return;
    }

    const question = quizData[currentQuestionIndex];
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // Update progress bar
    const progress = ((currentQuestionIndex) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Show bars progressively with increasing HEIGHT (vertical growth)
    for (let i = 0; i < currentQuestionIndex; i++) {
        // Calculate height: progressively taller bars (5%, 10%, 15%, etc. up to 100%)
        const barHeight = ((i + 1) / quizData.length) * 100;
        
        leftBars[i].style.height = `${barHeight}%`;
        rightBars[i].style.height = `${barHeight}%`;
    }
    
    // Check for text inversion (currently disabled)
    setTimeout(() => {
        updateHeadingExpansion();
    }, 100);
}

// Handle answer selection
function selectAnswer(answer) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    const question = quizData[currentQuestionIndex];
    
    // Store answer
    answers[currentQuestionIndex] = answer;
    
    // Calculate raw score (only YES answers count)
    let rawScore = 0;
    if (answer === 'yes') {
        rawScore = totalScore + question.weight;
    } else {
        rawScore = totalScore;
    }
    
    // Apply zero floor and update scores
    totalScore = Math.max(0, rawScore);
    normalizedScore = Math.floor((totalScore / maxRawScore) * 100);
    
    // Add quick visual feedback
    const selectedBtn = answer === 'yes' ? yesBtn : noBtn;
    selectedBtn.style.transform = 'translateY(-1px) scale(0.98)';
    selectedBtn.style.background = 'rgba(255, 255, 255, 0.15)';
    
    setTimeout(() => {
        selectedBtn.style.transform = '';
        selectedBtn.style.background = '';
        nextQuestion();
    }, 150);
}

// Move to next question with animation
function nextQuestion() {
    questionCard.classList.add('fade-out');
    
    setTimeout(() => {
        currentQuestionIndex++;
        questionCard.classList.remove('fade-out');
        
        if (currentQuestionIndex < quizData.length) {
            displayQuestion();
            questionCard.classList.add('fade-in');
            
            setTimeout(() => {
                questionCard.classList.remove('fade-in');
                isTransitioning = false;
            }, 200);
        } else {
            showResult();
        }
    }, 200);
}

// Move to previous question with animation
function previousQuestion() {
    if (currentQuestionIndex <= 0 || isTransitioning) return;
    
    isTransitioning = true;
    questionCard.classList.add('fade-out');
    
    setTimeout(() => {
        currentQuestionIndex--;
        
        // Recalculate score
        recalculateScore();
        
        // Update bars to show only up to current question
        for (let i = 0; i < quizData.length; i++) {
            if (i < currentQuestionIndex) {
                const barHeight = ((i + 1) / quizData.length) * 100;
                leftBars[i].style.height = `${barHeight}%`;
                rightBars[i].style.height = `${barHeight}%`;
            } else {
                leftBars[i].style.height = '0%';
                rightBars[i].style.height = '0%';
            }
        }
        
        questionCard.classList.remove('fade-out');
        displayQuestion();
        questionCard.classList.add('fade-in');
        
        setTimeout(() => {
            questionCard.classList.remove('fade-in');
            isTransitioning = false;
            updateHeadingExpansion();
        }, 200);
    }, 200);
}

// Recalculate score based on current answers
function recalculateScore() {
    // Calculate raw score (sum of weights for YES answers)
    let rawScore = 0;
    for (let i = 0; i <= currentQuestionIndex; i++) {
        if (answers[i] === 'yes') {
            rawScore += quizData[i].weight;
        }
    }
    
    // Apply zero floor to raw score
    totalScore = Math.max(0, rawScore);
    
    // Calculate normalized score (0-100 scale)
    normalizedScore = Math.floor((totalScore / maxRawScore) * 100);
}

// Show final result
function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'flex';
    
    // Find appropriate portfolio bracket based on normalized score
    const bracket = portfolioBrackets.find(b => 
        normalizedScore >= b.min && normalizedScore <= b.max
    );
    
    // Display result without score details
    resultPortfolio.textContent = bracket.size;
    resultComment.textContent = bracket.comment;
    
    // Update progress to 100%
    progressFill.style.width = '100%';
    
    // Show all bars at their final heights (complete leaderboard)
    setTimeout(() => {
        for (let i = 0; i < quizData.length; i++) {
            const barHeight = ((i + 1) / quizData.length) * 100;
            leftBars[i].style.height = `${barHeight}%`;
            rightBars[i].style.height = `${barHeight}%`;
        }
        
        // Check for text inversion after bars are shown
        setTimeout(() => {
            updateHeadingExpansion();
        }, 300);
    }, 100);
}

// Restart quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    totalScore = 0;
    normalizedScore = 0;
    answers = [];
    isTransitioning = false;
    
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'flex';
    
    // Reset all bars
    for (let i = 0; i < leftBars.length; i++) {
        leftBars[i].style.height = '0%';
        rightBars[i].style.height = '0%';
    }
    
    // Reset heading expansion
    const header = document.querySelector('.header h1');
    if (header) {
        header.style.letterSpacing = '-0.03em'; // Reset to original
        header.style.fontSize = '2.8rem'; // Reset to original
        header.style.width = '100%'; // Reset width
        header.style.left = 'auto'; // Reset position
        header.style.transform = 'none'; // Reset transform
        header.style.position = 'relative'; // Keep relative
    }
    
    // Start quiz
    setTimeout(() => {
        displayQuestion();
    }, 100);
}

// Setup event listeners
function setupEventListeners() {
    yesBtn.addEventListener('click', () => selectAnswer('yes'));
    noBtn.addEventListener('click', () => selectAnswer('no'));
    
    // Cursor interaction with buttons
    const buttons = document.querySelectorAll('.answer-btn, .restart-btn, .share-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        button.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (currentQuestionIndex >= quizData.length) return;
        
        if (e.key === 'ArrowLeft' || e.key === 'y' || e.key === 'Y') {
            selectAnswer('yes');
        } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
            selectAnswer('no');
        }
    });
    
    // Window resize event to update progress bars
    window.addEventListener('resize', displayQuestion);
    
    // Scroll navigation
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        if (currentQuestionIndex >= quizData.length) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                // Scrolling down - go to previous question
                previousQuestion();
            }
        }, 100);
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (currentQuestionIndex >= quizData.length || isTransitioning) return;
        
        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff < 0) {
                // Swiping down - go to previous question
                previousQuestion();
            }
            touchStartX = touchEndX;
        }
    });
}

// Share functionality
async function shareResult() {
    try {
        // Get the result data
        const portfolio = document.getElementById('resultPortfolio').textContent;
        const comment = document.getElementById('resultComment').textContent;
        
        console.log('Starting image generation with:', { portfolio, comment });
        
        // Test image loading first
        try {
            await testImageLoad();
        } catch (e) {
            console.warn('Image loading test failed, but continuing...');
        }
        
        // Generate image and copy to clipboard
        await generateAndCopyImage(portfolio, comment);
        
        // Show popup before opening Twitter
        showCountdownPopup(() => {
            openTwitterIntent(comment);
        });
        
    } catch (error) {
        console.error('Error sharing result:', error);
        // Fallback: just open Twitter intent
        const comment = document.getElementById('resultComment').textContent;
        openTwitterIntent(comment);
    }
}

// Test function to check if image loading works
async function testImageLoad() {
    return new Promise((resolve, reject) => {
        const testImg = new Image();
        testImg.onload = () => {
            console.log('Test image loaded successfully');
            console.log('Image dimensions:', testImg.width, 'x', testImg.height);
            resolve(true);
        };
        testImg.onerror = (e) => {
            console.error('Test image failed to load:', e);
            reject(false);
        };
        testImg.src = 'maxresdefault.png';
    });
}

// Generate image with canvas and copy to clipboard
async function generateAndCopyImage(portfolio, comment) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (original image resolution)
    const width = 1080;
    const height = 720;
    canvas.width = width;
    canvas.height = height;
    
    // Function to draw text content and handle clipboard
    const finalizeImage = () => {
        // Set text properties
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Left margin for text positioning
        const leftMargin = width * 0.08; // Moved more to the left
        
        // Portfolio size (larger text)
        ctx.font = 'bold 120px Arial, sans-serif'; // Slightly smaller for 16:9 format
        const portfolioY = height * 0.3; // Moved up for better spacing
        ctx.fillText(portfolio, leftMargin, portfolioY);
        
        // Comment text (smaller, wrapped)
        ctx.font = '60px Arial, sans-serif'; // Slightly smaller for 16:9 format
        const commentY = height * 0.7; // Moved down for better spacing
        
        // Word wrap for comment
        const maxWidth = width * 0.7;
        const words = comment.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testWidth = ctx.measureText(currentLine + ' ' + word).width;
            if (testWidth < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        // Draw wrapped text
        const lineHeight = 75; // Reduced for 16:9 format
        const startY = commentY - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, leftMargin, startY + (index * lineHeight));
        });
        
        // Add watermark
        ctx.font = '30px Arial, sans-serif'; // Slightly smaller for 16:9 format
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.textAlign = 'left';
        ctx.fillText('Crypto Portfolio Guesser', leftMargin, height * 0.93); // Left side with same margin as other text
        
        // Convert to blob and copy to clipboard
        return new Promise((resolve, reject) => {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error('Failed to create blob from canvas');
                    reject(new Error('Canvas to blob conversion failed'));
                    return;
                }
                
                console.log('Canvas blob created successfully');
                console.log('Blob size:', blob.size, 'bytes');
                console.log('Blob type:', blob.type);
                
                try {
                    const clipboardItem = new ClipboardItem({
                        [blob.type]: blob
                    });
                    
                    await navigator.clipboard.write([clipboardItem]);
                    console.log('Image copied to clipboard successfully!');
                    showNotification('Image copied to clipboard!');
                    resolve();
                } catch (clipboardError) {
                    console.error('Clipboard write failed:', clipboardError);
                    reject(clipboardError);
                }
            }, 'image/png', 0.9);
        });
    };

    // Try to load background image, fallback to white background
    try {
        const backgroundImg = new Image();
        
        const imageLoadPromise = new Promise((resolve, reject) => {
            backgroundImg.onload = () => {
                console.log('Background image loaded successfully');
                console.log('Image dimensions:', backgroundImg.width, 'x', backgroundImg.height);
                ctx.drawImage(backgroundImg, 0, 0, width, height);
                resolve();
            };
            
            backgroundImg.onerror = (e) => {
                console.warn('Background image failed to load:', e);
                reject(e);
            };
            
            // Set cross-origin to handle potential CORS issues
            backgroundImg.crossOrigin = 'anonymous';
            backgroundImg.src = 'maxresdefault.png';
        });
        
        // Wait for image load with timeout
        await Promise.race([
            imageLoadPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Image load timeout')), 5000))
        ]);
        
    } catch (error) {
        console.warn('Using white background due to image load failure:', error.message);
        // Fallback to white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
    }
    
    // Finalize and return the image
    return await finalizeImage();
}

// Show countdown popup before opening Twitter
function showCountdownPopup(callback) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(2px);
    `;
    
    // Create popup content
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: #ffffff;
        color: #000000;
        padding: 40px 50px;
        border-radius: 16px;
        text-align: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.1rem;
        font-weight: 500;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        border: 2px solid #000000;
        max-width: 500px;
        margin: 20px;
    `;
    
    // Create message and countdown elements
    const message = document.createElement('div');
    message.textContent = 'Image has been copied to clipboard. Paste it before posting.';
    message.style.cssText = `
        margin-bottom: 20px;
        line-height: 1.4;
    `;
    
    const countdown = document.createElement('div');
    countdown.style.cssText = `
        font-size: 1.5rem;
        font-weight: 600;
        color: #000000;
    `;
    
    popup.appendChild(message);
    popup.appendChild(countdown);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Countdown logic
    let seconds = 2;
    countdown.textContent = `Opening Twitter in ${seconds}...`;
    
    const countdownInterval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            countdown.textContent = `Opening Twitter in ${seconds}...`;
        } else {
            countdown.textContent = 'Opening Twitter now...';
            clearInterval(countdownInterval);
            
            // Remove popup and execute callback
            setTimeout(() => {
                document.body.removeChild(overlay);
                callback();
            }, 200);
        }
    }, 1000);
    
    // Allow clicking overlay to close (emergency exit)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            clearInterval(countdownInterval);
            document.body.removeChild(overlay);
            callback();
        }
    });
}

// Open Twitter intent
function openTwitterIntent(text) {
    const tweetText = encodeURIComponent(text + '\n\nI can guess ur portfolio size: ' + window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000000;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scrambled text reveal effect for author
let scrambleIntervals = [];

function startScrambleEffect(element, finalText) {
    // Clear any existing intervals
    clearScrambleEffect();
    
    const scrambleChars = '!@#$%^&*(){}[]|;:,.<>?abcdefghijklmnopqrstuvwxyz0123456789';
    
    // Set initial scrambled text
    let scrambledText = '';
    for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') {
            scrambledText += ' ';
        } else {
            scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
    }
    
    element.textContent = scrambledText;
    
    // Gradually reveal correct letters
    let currentText = scrambledText.split('');
    let revealedIndices = new Set();
    
    const revealInterval = setInterval(() => {
        // Pick a random index that hasn't been revealed yet
        const availableIndices = [];
        for (let i = 0; i < finalText.length; i++) {
            if (!revealedIndices.has(i) && finalText[i] !== ' ') {
                availableIndices.push(i);
            }
        }
        
        if (availableIndices.length === 0) {
            clearInterval(revealInterval);
            return;
        }
        
        // Reveal a random character
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        currentText[randomIndex] = finalText[randomIndex];
        revealedIndices.add(randomIndex);
        
        // Update display
        element.textContent = currentText.join('');
        
        // Still scramble unrevealed characters
        for (let i = 0; i < currentText.length; i++) {
            if (!revealedIndices.has(i) && finalText[i] !== ' ') {
                currentText[i] = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
        }
        
    }, 100); // Reveal a letter every 100ms
    
    // Continue scrambling unrevealed letters
    const scrambleInterval = setInterval(() => {
        if (revealedIndices.size >= finalText.replace(/\s/g, '').length) {
            clearInterval(scrambleInterval);
            return;
        }
        
        for (let i = 0; i < currentText.length; i++) {
            if (!revealedIndices.has(i) && finalText[i] !== ' ') {
                currentText[i] = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
        }
        
        element.textContent = currentText.join('');
    }, 50); // Scramble every 50ms for smooth effect
    
    // Store intervals for cleanup
    scrambleIntervals = [revealInterval, scrambleInterval];
}

function clearScrambleEffect() {
    scrambleIntervals.forEach(interval => clearInterval(interval));
    scrambleIntervals = [];
}

function resetTextElement(element, originalText) {
    if (element) {
        clearScrambleEffect();
        element.textContent = originalText;
    }
}

// Initialize the quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    
    // Set up hover effect for author text
    const authorElement = document.querySelector('.author');
    if (authorElement) {
        // Set initial text
        authorElement.textContent = '@deepugami';
        
        // Add hover event listeners
        authorElement.addEventListener('mouseenter', () => {
            startScrambleEffect(authorElement, '@deepugami');
        });
        
        authorElement.addEventListener('mouseleave', () => {
            resetTextElement(authorElement, '@deepugami');
        });
    }
    
    // Set up hover effect for main heading
    const headingElement = document.querySelector('.header h1');
    if (headingElement) {
        // Store original text
        const originalText = headingElement.textContent;
        
        // Add hover event listeners
        headingElement.addEventListener('mouseenter', () => {
            startScrambleEffect(headingElement, originalText);
        });
        
        headingElement.addEventListener('mouseleave', () => {
            resetTextElement(headingElement, originalText);
        });
    }
});
