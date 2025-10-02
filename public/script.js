// DOM Elements
const storyIdeaInput = document.getElementById('storyIdea');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const voiceBtn = document.getElementById('voiceBtn');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const storySection = document.getElementById('storySection');
const storyText = document.getElementById('storyText');
const audioPlayerSection = document.getElementById('audioPlayerSection');
const audioStatus = document.getElementById('audioStatus');
const errorSection = document.getElementById('errorSection');
const errorText = document.getElementById('errorText');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const ratingStars = document.getElementById('ratingStars');
const ratingMessage = document.getElementById('ratingMessage');
const regenerateBtn = document.getElementById('regenerateBtn');
const copyBtn = document.getElementById('copyBtn');
const emailBtn = document.getElementById('emailBtn');
const twitterBtn = document.getElementById('twitterBtn');
const shareMessage = document.getElementById('shareMessage');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// State
let currentStory = '';
let audioElement = null;
let currentRating = 0;
let storyHistory = JSON.parse(localStorage.getItem('storyHistory')) || [];

// Helper functions
function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        errorSection.classList.add('hidden');
    }, 5000);
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    }
}

// Generate Story
generateBtn.addEventListener('click', async () => {
    const idea = storyIdeaInput.value.trim();
    
    if (!idea) {
        showError('Please enter a story idea!');
        return;
    }
    
    const originalText = generateBtn.textContent;
    setButtonLoading(generateBtn, true);
    errorSection.classList.add('hidden');
    storySection.classList.add('hidden');
    audioPlayerSection.classList.add('hidden');
    
    try {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idea })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate story');
        }
        
        currentStory = data.story;
        storyText.textContent = currentStory;
        storySection.classList.remove('hidden');
        clearBtn.classList.remove('hidden');
        
        // Save to history
        saveToHistory();
        
    } catch (error) {
        showError(error.message);
    } finally {
        setButtonLoading(generateBtn, false);
        generateBtn.textContent = originalText;
    }
});

// Generate Voice
voiceBtn.addEventListener('click', async () => {
    if (!currentStory) {
        showError('Please generate a story first!');
        return;
    }
    
    const originalText = voiceBtn.textContent;
    setButtonLoading(voiceBtn, true);
    errorSection.classList.add('hidden');
    audioPlayerSection.classList.add('hidden');
    
    try {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: currentStory })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate audio');
        }
        
        // Create audio element from base64
        const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Clean up old audio if exists
        if (audioElement) {
            audioElement.pause();
            URL.revokeObjectURL(audioElement.src);
        }
        
        audioElement = new Audio(audioUrl);
        
        // Audio event listeners
        audioElement.addEventListener('ended', () => {
            audioStatus.textContent = 'Playback finished';
            playBtn.disabled = false;
            stopBtn.disabled = true;
        });
        
        audioElement.addEventListener('play', () => {
            audioStatus.textContent = 'Playing...';
            playBtn.disabled = true;
            stopBtn.disabled = false;
        });
        
        audioElement.addEventListener('pause', () => {
            audioStatus.textContent = 'Paused';
            playBtn.disabled = false;
            stopBtn.disabled = true;
        });
        
        audioPlayerSection.classList.remove('hidden');
        audioStatus.textContent = 'Ready to play';
        playBtn.disabled = false;
        stopBtn.disabled = true;
        
    } catch (error) {
        showError(error.message);
    } finally {
        setButtonLoading(voiceBtn, false);
        voiceBtn.textContent = originalText;
    }
});

// Play Audio
playBtn.addEventListener('click', () => {
    if (audioElement) {
        audioElement.play();
    }
});

// Stop Audio
stopBtn.addEventListener('click', () => {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        audioStatus.textContent = 'Stopped';
    }
});

// Speed Control
speedSlider.addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    speedValue.textContent = `${speed.toFixed(1)}x`;
    
    if (audioElement) {
        audioElement.playbackRate = speed;
    }
});

// Utility function to convert base64 to Blob
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

// Clear button - reset everything
clearBtn.addEventListener('click', () => {
    // Clear input
    storyIdeaInput.value = '';
    
    // Clear story
    currentStory = '';
    storyText.textContent = '';
    
    // Stop and clear audio
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        URL.revokeObjectURL(audioElement.src);
        audioElement = null;
    }
    
    // Hide all sections
    storySection.classList.add('hidden');
    audioPlayerSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    clearBtn.classList.add('hidden');
    
    // Focus back on textarea
    storyIdeaInput.focus();
});

// Rating System
function updateStarDisplay(rating) {
    const stars = ratingStars.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingMessage(rating) {
    ratingMessage.classList.remove('positive', 'negative');
    regenerateBtn.classList.add('hidden');
    
    if (rating === 0) {
        ratingMessage.textContent = '';
    } else if (rating <= 2) {
        ratingMessage.textContent = 'Sorry you didn\'t enjoy this story. Would you like to try again?';
        ratingMessage.classList.add('negative');
        regenerateBtn.classList.remove('hidden');
    } else if (rating === 3) {
        ratingMessage.textContent = 'Thanks for your feedback! Feel free to regenerate for a different story.';
        regenerateBtn.classList.remove('hidden');
    } else {
        ratingMessage.textContent = 'Glad you enjoyed the story! 🎉';
        ratingMessage.classList.add('positive');
    }
}

// Star rating click handler
ratingStars.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        currentRating = parseInt(e.target.dataset.rating);
        updateStarDisplay(currentRating);
        updateRatingMessage(currentRating);
        
        // Update rating in history
        if (currentStory) {
            const currentEntry = storyHistory.find(entry => entry.story === currentStory);
            if (currentEntry) {
                currentEntry.rating = currentRating;
                localStorage.setItem('storyHistory', JSON.stringify(storyHistory));
                renderHistory();
            }
        }
    }
});

// Star hover effect
ratingStars.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('star')) {
        const hoverRating = parseInt(e.target.dataset.rating);
        updateStarDisplay(hoverRating);
    }
});

ratingStars.addEventListener('mouseout', () => {
    updateStarDisplay(currentRating);
});

// Regenerate button
regenerateBtn.addEventListener('click', async () => {
    const idea = storyIdeaInput.value.trim();
    
    if (!idea) {
        showError('Please enter a story idea!');
        return;
    }
    
    // Reset rating
    currentRating = 0;
    updateStarDisplay(0);
    ratingMessage.textContent = '';
    regenerateBtn.classList.add('hidden');
    
    // Clear audio
    if (audioElement) {
        audioElement.pause();
        audioElement = null;
    }
    audioPlayerSection.classList.add('hidden');
    
    // Regenerate story
    const originalText = generateBtn.textContent;
    setButtonLoading(generateBtn, true);
    errorSection.classList.add('hidden');
    
    try {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idea })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate story');
        }
        
        currentStory = data.story;
        storyText.textContent = currentStory;
        
        // Save to history
        saveToHistory();
        
    } catch (error) {
        showError(error.message);
    } finally {
        setButtonLoading(generateBtn, false);
        generateBtn.textContent = originalText;
    }
});

// Share Functionality
copyBtn.addEventListener('click', async () => {
    if (!currentStory) {
        showError('No story to copy!');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(currentStory);
        shareMessage.textContent = '✓ Story copied to clipboard!';
        setTimeout(() => {
            shareMessage.textContent = '';
        }, 3000);
    } catch (error) {
        showError('Failed to copy story');
    }
});

emailBtn.addEventListener('click', () => {
    if (!currentStory) {
        showError('No story to share!');
        return;
    }
    
    const subject = encodeURIComponent('Check out this AI-generated story!');
    const body = encodeURIComponent(`I generated this story using AI:\n\n${currentStory}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    shareMessage.textContent = '✓ Opening email client...';
    setTimeout(() => {
        shareMessage.textContent = '';
    }, 3000);
});

twitterBtn.addEventListener('click', () => {
    if (!currentStory) {
        showError('No story to share!');
        return;
    }
    
    const tweetText = encodeURIComponent(`Check out this AI-generated story! ${currentStory.substring(0, 200)}...`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    shareMessage.textContent = '✓ Opening Twitter...';
    setTimeout(() => {
        shareMessage.textContent = '';
    }, 3000);
});

// Story History Functions
function saveToHistory() {
    if (!currentStory) return;
    
    const storyEntry = {
        id: Date.now(),
        story: currentStory,
        timestamp: new Date().toLocaleString(),
        rating: currentRating,
        idea: storyIdeaInput.value.trim()
    };
    
    storyHistory.unshift(storyEntry);
    
    // Keep only last 10 stories
    if (storyHistory.length > 10) {
        storyHistory = storyHistory.slice(0, 10);
    }
    
    localStorage.setItem('storyHistory', JSON.stringify(storyHistory));
    renderHistory();
}

function renderHistory() {
    if (storyHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No saved stories yet. Generate your first story!</div>';
        return;
    }
    
    historyList.innerHTML = storyHistory.map(entry => `
        <div class="history-item" data-id="${entry.id}">
            <div class="history-item-header">
                <span class="history-timestamp">${entry.timestamp}</span>
                <span class="history-rating">${'⭐'.repeat(entry.rating || 0)}</span>
            </div>
            <div class="history-preview">${entry.story}</div>
        </div>
    `).join('');
    
    // Add click handlers to history items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            loadStoryFromHistory(id);
        });
    });
}

function loadStoryFromHistory(id) {
    const entry = storyHistory.find(e => e.id === id);
    if (!entry) return;
    
    currentStory = entry.story;
    currentRating = entry.rating || 0;
    storyIdeaInput.value = entry.idea || '';
    storyText.textContent = currentStory;
    storySection.classList.remove('hidden');
    clearBtn.classList.remove('hidden');
    
    updateStarDisplay(currentRating);
    updateRatingMessage(currentRating);
    
    // Clear audio
    if (audioElement) {
        audioElement.pause();
        audioElement = null;
    }
    audioPlayerSection.classList.add('hidden');
    
    // Scroll to story
    storySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved stories?')) {
        storyHistory = [];
        localStorage.removeItem('storyHistory');
        renderHistory();
    }
});

// Initialize history on load
renderHistory();

// Allow Enter key to submit (with Shift+Enter for new line)
storyIdeaInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateBtn.click();
    }
});
