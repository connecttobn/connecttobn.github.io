// Application Data
const appData = {
  "typingLevels": [
    {"id": 1, "name": "Home Row Basics", "keys": "asdf jkl;", "difficulty": "Beginner", "xpReward": 100},
    {"id": 2, "name": "Home Row Mastery", "keys": "asdf jkl; combinations", "difficulty": "Beginner", "xpReward": 150},
    {"id": 3, "name": "Top Row Introduction", "keys": "qwerty", "difficulty": "Beginner", "xpReward": 200},
    {"id": 4, "name": "Bottom Row Basics", "keys": "zxcvbnm", "difficulty": "Intermediate", "xpReward": 250},
    {"id": 5, "name": "Full Alphabet", "keys": "All letters", "difficulty": "Intermediate", "xpReward": 300},
    {"id": 6, "name": "Capital Letters", "keys": "Shift + letters", "difficulty": "Intermediate", "xpReward": 350},
    {"id": 7, "name": "Numbers & Symbols", "keys": "0-9 and !@#$%", "difficulty": "Advanced", "xpReward": 400},
    {"id": 8, "name": "Punctuation Master", "keys": ".,;: and more", "difficulty": "Advanced", "xpReward": 450},
    {"id": 9, "name": "Advanced Texts", "keys": "Complex sentences", "difficulty": "Expert", "xpReward": 500},
    {"id": 10, "name": "Typing Virtuoso", "keys": "Professional texts", "difficulty": "Expert", "xpReward": 600}
  ],
  "achievements": [
    {"id": "first_steps", "name": "First Steps", "description": "Complete your first typing lesson", "icon": "🏅", "points": 50},
    {"id": "speed_demon", "name": "Speed Demon", "description": "Reach 40+ WPM in a test", "icon": "⚡", "points": 200},
    {"id": "accuracy_master", "name": "Accuracy Master", "description": "Achieve 95%+ accuracy", "icon": "🎯", "points": 150},
    {"id": "marathon_typist", "name": "Marathon Typist", "description": "Practice for 30+ minutes", "icon": "🏃", "points": 300},
    {"id": "consistent_learner", "name": "Consistent Learner", "description": "Practice 7 days in a row", "icon": "📅", "points": 400},
    {"id": "perfect_round", "name": "Perfect Round", "description": "Complete lesson with 100% accuracy", "icon": "💯", "points": 250},
    {"id": "home_row_hero", "name": "Home Row Hero", "description": "Master the home row keys", "icon": "🏠", "points": 100},
    {"id": "numbers_ninja", "name": "Numbers Ninja", "description": "Excel at typing numbers", "icon": "🔢", "points": 175},
    {"id": "punctuation_pro", "name": "Punctuation Pro", "description": "Master punctuation marks", "icon": "❗", "points": 125},
    {"id": "typing_legend", "name": "Typing Legend", "description": "Reach 80+ WPM", "icon": "👑", "points": 500}
  ],
  "practiceTexts": {
    "beginner": ["the quick brown fox", "she sells seashells", "home row practice", "simple words here", "ask dad flask glad", "fall jazz hall call", "sad lad had fad"],
    "intermediate": ["The quick brown fox jumps over the lazy dog.", "Practice makes perfect in all endeavors.", "Typing skills improve with consistent effort.", "Every day brings new opportunities to learn.", "Focus on accuracy before speed development."],
    "advanced": ["Advanced typists can handle complex punctuation, numbers like 123-456-7890, and symbols such as @#$%!", "Professional typing requires precision and speed in equal measure.", "The ability to type without looking at the keyboard is essential."],
    "expert": ["Professional typing requires mastery of all keyboard elements including advanced syntax, programming characters {[]}, and mathematical expressions (x = y + z).", "Expert-level typing involves handling complex documents with formatting, special characters, and technical terminology at high speeds while maintaining perfect accuracy."]
  },
  "motivationalQuotes": [
    "Great job! Keep up the excellent work!",
    "Your fingers are getting faster every day!",
    "Consistency is the key to mastery!",
    "You're making amazing progress!",
    "Every keystroke brings you closer to perfection!",
    "Your dedication is inspiring!",
    "Speed and accuracy are improving beautifully!"
  ],
  "wpmBenchmarks": [
    {"level": "Slow", "range": "0-20 WPM", "description": "Just starting out"},
    {"level": "Below Average", "range": "20-30 WPM", "description": "Building foundation"},
    {"level": "Average", "range": "30-40 WPM", "description": "Casual computer user"},
    {"level": "Above Average", "range": "40-60 WPM", "description": "Good office skills"},
    {"level": "Fast", "range": "60-80 WPM", "description": "Professional level"},
    {"level": "Very Fast", "range": "80+ WPM", "description": "Expert typist"}
  ]
};

// Application State
let gameState = {
  currentScreen: 'welcome',
  userStats: {
    level: 1,
    xp: 0,
    bestWpm: 0,
    avgAccuracy: 0,
    practiceTime: 0,
    streak: 0,
    completedLessons: [],
    earnedAchievements: [],
    totalWordsTyped: 0
  },
  currentLesson: null,
  assessmentResults: null,
  practiceSession: {
    startTime: null,
    currentText: '',
    userInput: '',
    wpm: 0,
    accuracy: 100,
    errors: 0,
    totalChars: 0
  }
};

// Screen Management
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    gameState.currentScreen = screenId;
  }
}

// Initialize Application
function initializeApp() {
  showScreen('welcome-screen');
  updateDashboard();
  generateVirtualKeyboard();
}

// Skill Assessment Functions
function startSkillAssessment() {
  showScreen('assessment-screen');
  document.getElementById('assessment-input').disabled = true;
  document.getElementById('start-assessment').style.display = 'inline-flex';
}

let assessmentInterval = null;

function startAssessmentTest() {
  const input = document.getElementById('assessment-input');
  const timer = document.getElementById('assessment-timer');
  const wpmDisplay = document.getElementById('assessment-wpm');
  const accuracyDisplay = document.getElementById('assessment-accuracy');
  
  input.disabled = false;
  input.focus();
  input.value = '';
  
  let timeLeft = 60;
  let startTime = Date.now();
  let errors = 0;
  
  // Clear any existing interval
  if (assessmentInterval) {
    clearInterval(assessmentInterval);
  }
  
  assessmentInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = `${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(assessmentInterval);
      assessmentInterval = null;
      finishAssessment();
    }
  }, 1000);
  
  // Remove any existing event listeners
  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);
  
  newInput.addEventListener('input', function(e) {
    const typed = e.target.value;
    const target = document.getElementById('assessment-text').textContent;
    
    // Calculate WPM
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = typed.length / 5;
    const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    wpmDisplay.textContent = wpm;
    
    // Calculate accuracy
    errors = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] !== target[i]) {
        errors++;
      }
    }
    const accuracy = typed.length > 0 ? Math.max(0, Math.round(((typed.length - errors) / typed.length) * 100)) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
    
    // Highlight text
    highlightText(target, typed);
  });
  
  function finishAssessment() {
    const finalInput = document.getElementById('assessment-input');
    finalInput.disabled = true;
    const finalWpm = parseInt(wpmDisplay.textContent) || 0;
    const finalAccuracy = parseInt(accuracyDisplay.textContent.replace('%', '')) || 100;
    
    gameState.assessmentResults = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      skillLevel: getSkillLevel(finalWpm)
    };
    
    showAssessmentResults();
  }
  
  document.getElementById('start-assessment').style.display = 'none';
}

function skipAssessment() {
  // Clear any running interval
  if (assessmentInterval) {
    clearInterval(assessmentInterval);
    assessmentInterval = null;
  }
  
  gameState.assessmentResults = {
    wpm: 25,
    accuracy: 85,
    skillLevel: 'Beginner'
  };
  showAssessmentResults();
}

function showAssessmentResults() {
  const results = gameState.assessmentResults;
  
  document.getElementById('final-wpm').textContent = results.wpm;
  document.getElementById('final-accuracy').textContent = `${results.accuracy}%`;
  document.getElementById('skill-level').textContent = results.skillLevel;
  
  const recommendation = getRecommendation(results.wpm);
  document.getElementById('recommendation-text').textContent = recommendation;
  
  showScreen('results-screen');
}

function getSkillLevel(wpm) {
  if (wpm >= 80) return 'Expert';
  if (wpm >= 60) return 'Advanced';
  if (wpm >= 30) return 'Intermediate';
  return 'Beginner';
}

function getRecommendation(wpm) {
  if (wpm >= 60) {
    return "Excellent! You can start with intermediate to advanced lessons and focus on accuracy and special characters.";
  } else if (wpm >= 30) {
    return "Good foundation! Start with intermediate lessons to improve your speed while maintaining accuracy.";
  } else {
    return "Perfect starting point! Begin with home row basics and gradually build your muscle memory.";
  }
}

function goToDashboard() {
  // Update user stats based on assessment
  if (gameState.assessmentResults) {
    gameState.userStats.bestWpm = gameState.assessmentResults.wpm;
    gameState.userStats.avgAccuracy = gameState.assessmentResults.accuracy;
  }
  
  updateDashboard();
  showScreen('dashboard-screen');
}

// Dashboard Functions
function updateDashboard() {
  // Update level and XP
  const level = calculateLevel(gameState.userStats.xp);
  gameState.userStats.level = level;
  
  document.getElementById('user-level').textContent = level;
  document.getElementById('current-xp').textContent = gameState.userStats.xp;
  document.getElementById('next-level-xp').textContent = level * 1000;
  
  // Update XP progress bar
  const xpProgress = (gameState.userStats.xp % 1000) / 10;
  document.getElementById('xp-progress').style.width = `${xpProgress}%`;
  
  // Update stats
  document.getElementById('best-wpm').textContent = gameState.userStats.bestWpm;
  document.getElementById('avg-accuracy').textContent = `${gameState.userStats.avgAccuracy}%`;
  document.getElementById('practice-time').textContent = Math.round(gameState.userStats.practiceTime);
  document.getElementById('achievements-count').textContent = gameState.userStats.earnedAchievements.length;
  document.getElementById('streak-count').textContent = gameState.userStats.streak;
  
  // Generate lessons
  generateLessons();
  
  // Update achievements
  updateRecentAchievements();
}

function calculateLevel(xp) {
  return Math.floor(xp / 1000) + 1;
}

function generateLessons() {
  const lessonsGrid = document.getElementById('lessons-grid');
  lessonsGrid.innerHTML = '';
  
  appData.typingLevels.forEach((lesson, index) => {
    const isCompleted = gameState.userStats.completedLessons.includes(lesson.id);
    const isLocked = index > 0 && !gameState.userStats.completedLessons.includes(appData.typingLevels[index - 1].id);
    
    const lessonCard = document.createElement('div');
    lessonCard.className = `lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
    
    lessonCard.innerHTML = `
      <div class="lesson-number">${lesson.id}</div>
      <div class="lesson-title">${lesson.name}</div>
      <div class="lesson-description">${lesson.keys}</div>
      <div class="lesson-meta">
        <span class="lesson-difficulty ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
        <span class="lesson-xp">+${lesson.xpReward} XP</span>
      </div>
    `;
    
    if (!isLocked) {
      lessonCard.addEventListener('click', () => startLesson(lesson));
    }
    
    lessonsGrid.appendChild(lessonCard);
  });
}

function updateRecentAchievements() {
  const recentAchievements = document.getElementById('recent-achievements');
  
  if (gameState.userStats.earnedAchievements.length === 0) {
    recentAchievements.innerHTML = `
      <div class="achievement-placeholder">
        <p>Complete your first lesson to earn achievements!</p>
      </div>
    `;
    return;
  }
  
  recentAchievements.innerHTML = '';
  const recent = gameState.userStats.earnedAchievements.slice(-3);
  
  recent.forEach(achievementId => {
    const achievement = appData.achievements.find(a => a.id === achievementId);
    if (achievement) {
      const achievementElement = document.createElement('div');
      achievementElement.className = 'achievement-item';
      achievementElement.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
        <div class="achievement-points">+${achievement.points}</div>
      `;
      recentAchievements.appendChild(achievementElement);
    }
  });
}

// Lesson Functions
function startLesson(lesson) {
  gameState.currentLesson = lesson;
  gameState.practiceSession = {
    startTime: Date.now(),
    currentText: generatePracticeText(lesson),
    userInput: '',
    wpm: 0,
    accuracy: 100,
    errors: 0,
    totalChars: 0
  };
  
  setupPracticeScreen(lesson);
  showScreen('practice-screen');
}

function generatePracticeText(lesson) {
  const difficulty = lesson.difficulty.toLowerCase();
  let texts;
  
  switch(difficulty) {
    case 'beginner':
      texts = appData.practiceTexts.beginner;
      break;
    case 'intermediate':
      texts = appData.practiceTexts.intermediate;
      break;
    case 'advanced':
      texts = appData.practiceTexts.advanced;
      break;
    case 'expert':
      texts = appData.practiceTexts.expert;
      break;
    default:
      texts = appData.practiceTexts.beginner;
  }
  
  // Select multiple texts for longer practice
  const selectedTexts = [];
  for (let i = 0; i < 3; i++) {
    selectedTexts.push(texts[Math.floor(Math.random() * texts.length)]);
  }
  
  return selectedTexts.join(' ');
}

function setupPracticeScreen(lesson) {
  document.getElementById('lesson-title').textContent = lesson.name;
  document.getElementById('lesson-description').textContent = `Focus on: ${lesson.keys}`;
  
  const practiceText = document.getElementById('practice-text');
  practiceText.textContent = gameState.practiceSession.currentText;
  
  const words = gameState.practiceSession.currentText.split(' ');
  document.getElementById('total-words').textContent = words.length;
  document.getElementById('words-completed').textContent = '0';
  document.getElementById('lesson-progress').style.width = '0%';
  
  const input = document.getElementById('practice-input');
  input.value = '';
  input.focus();
  
  // Reset stats
  document.getElementById('practice-wpm').textContent = '0';
  document.getElementById('practice-accuracy').textContent = '100%';
  document.getElementById('practice-time').textContent = '0:00';
  
  setupPracticeInput();
  startPracticeTimer();
}

function setupPracticeInput() {
  const input = document.getElementById('practice-input');
  const practiceText = gameState.practiceSession.currentText;
  
  // Remove existing listeners by cloning the element
  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);
  
  newInput.addEventListener('input', function(e) {
    const typed = e.target.value;
    gameState.practiceSession.userInput = typed;
    
    // Update text highlighting
    highlightText(practiceText, typed);
    
    // Calculate stats
    updatePracticeStats(typed, practiceText);
    
    // Update progress
    updatePracticeProgress(typed, practiceText);
    
    // Check if lesson is complete
    if (typed.trim() === practiceText.trim()) {
      completeLesson();
    }
  });
}

function highlightText(target, typed) {
  const textElement = document.getElementById('practice-text') || document.getElementById('assessment-text');
  let html = '';
  
  for (let i = 0; i < target.length; i++) {
    const char = target[i];
    
    if (i < typed.length) {
      if (typed[i] === char) {
        html += `<span class="correct">${char}</span>`;
      } else {
        html += `<span class="incorrect">${char}</span>`;
      }
    } else if (i === typed.length) {
      html += `<span class="current">${char}</span>`;
    } else {
      html += char;
    }
  }
  
  textElement.innerHTML = html;
}

function updatePracticeStats(typed, target) {
  const timeElapsed = (Date.now() - gameState.practiceSession.startTime) / 1000 / 60;
  
  // Calculate WPM
  const wordsTyped = typed.length / 5;
  const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
  gameState.practiceSession.wpm = wpm;
  document.getElementById('practice-wpm').textContent = wpm;
  
  // Calculate accuracy
  let errors = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== target[i]) {
      errors++;
    }
  }
  
  const accuracy = typed.length > 0 ? Math.max(0, Math.round(((typed.length - errors) / typed.length) * 100)) : 100;
  gameState.practiceSession.accuracy = accuracy;
  gameState.practiceSession.errors = errors;
  document.getElementById('practice-accuracy').textContent = `${accuracy}%`;
}

function updatePracticeProgress(typed, target) {
  const progress = (typed.length / target.length) * 100;
  document.getElementById('lesson-progress').style.width = `${progress}%`;
  
  const wordsTyped = typed.split(' ').length;
  const totalWords = target.split(' ').length;
  document.getElementById('words-completed').textContent = Math.min(wordsTyped, totalWords);
}

function startPracticeTimer() {
  const startTime = Date.now();
  
  const timer = setInterval(() => {
    if (gameState.currentScreen !== 'practice-screen') {
      clearInterval(timer);
      return;
    }
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('practice-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function completeLesson() {
  const lesson = gameState.currentLesson;
  const session = gameState.practiceSession;
  
  // Update user stats
  gameState.userStats.xp += lesson.xpReward;
  gameState.userStats.bestWpm = Math.max(gameState.userStats.bestWpm, session.wpm);
  gameState.userStats.avgAccuracy = Math.round((gameState.userStats.avgAccuracy + session.accuracy) / 2);
  gameState.userStats.practiceTime += (Date.now() - session.startTime) / 1000 / 60;
  gameState.userStats.totalWordsTyped += session.currentText.split(' ').length;
  
  // Mark lesson as completed
  if (!gameState.userStats.completedLessons.includes(lesson.id)) {
    gameState.userStats.completedLessons.push(lesson.id);
  }
  
  // Check for achievements
  const newAchievements = checkAchievements();
  
  // Show completion screen
  showLessonComplete(newAchievements);
}

function checkAchievements() {
  const newAchievements = [];
  const earned = gameState.userStats.earnedAchievements;
  
  // First Steps
  if (!earned.includes('first_steps') && gameState.userStats.completedLessons.length === 1) {
    newAchievements.push('first_steps');
  }
  
  // Speed Demon
  if (!earned.includes('speed_demon') && gameState.userStats.bestWpm >= 40) {
    newAchievements.push('speed_demon');
  }
  
  // Accuracy Master
  if (!earned.includes('accuracy_master') && gameState.practiceSession.accuracy >= 95) {
    newAchievements.push('accuracy_master');
  }
  
  // Perfect Round
  if (!earned.includes('perfect_round') && gameState.practiceSession.accuracy === 100) {
    newAchievements.push('perfect_round');
  }
  
  // Home Row Hero
  if (!earned.includes('home_row_hero') && gameState.userStats.completedLessons.includes(2)) {
    newAchievements.push('home_row_hero');
  }
  
  // Typing Legend
  if (!earned.includes('typing_legend') && gameState.userStats.bestWpm >= 80) {
    newAchievements.push('typing_legend');
  }
  
  // Marathon Typist
  if (!earned.includes('marathon_typist') && gameState.userStats.practiceTime >= 30) {
    newAchievements.push('marathon_typist');
  }
  
  // Add new achievements to earned list
  newAchievements.forEach(achievementId => {
    if (!earned.includes(achievementId)) {
      earned.push(achievementId);
      const achievement = appData.achievements.find(a => a.id === achievementId);
      if (achievement) {
        gameState.userStats.xp += achievement.points;
      }
    }
  });
  
  return newAchievements;
}

function showLessonComplete(newAchievements) {
  const session = gameState.practiceSession;
  const timeElapsed = Math.floor((Date.now() - session.startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  
  // Update results
  document.getElementById('lesson-wpm').textContent = session.wpm;
  document.getElementById('lesson-accuracy').textContent = `${session.accuracy}%`;
  document.getElementById('lesson-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('xp-earned').textContent = gameState.currentLesson.xpReward;
  
  // Show motivational quote
  const randomQuote = appData.motivationalQuotes[Math.floor(Math.random() * appData.motivationalQuotes.length)];
  document.getElementById('motivational-quote').textContent = randomQuote;
  
  // Show new achievements
  const newAchievementsContainer = document.getElementById('new-achievements');
  if (newAchievements.length > 0) {
    newAchievementsContainer.innerHTML = '';
    newAchievements.forEach(achievementId => {
      const achievement = appData.achievements.find(a => a.id === achievementId);
      if (achievement) {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'new-achievement';
        achievementElement.innerHTML = `
          <h4>${achievement.icon} ${achievement.name}</h4>
          <p>${achievement.description}</p>
          <p><strong>+${achievement.points} XP</strong></p>
        `;
        newAchievementsContainer.appendChild(achievementElement);
      }
    });
  } else {
    newAchievementsContainer.innerHTML = '';
  }
  
  showScreen('complete-screen');
}

// Virtual Keyboard
function generateVirtualKeyboard() {
  const keyboard = document.getElementById('virtual-keyboard');
  
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];
  
  keyboard.innerHTML = '';
  
  rows.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.className = 'keyboard-row';
    
    row.forEach(key => {
      const keyElement = document.createElement('div');
      keyElement.className = 'key';
      keyElement.textContent = key;
      keyElement.setAttribute('data-key', key);
      rowElement.appendChild(keyElement);
    });
    
    keyboard.appendChild(rowElement);
  });
  
  // Add spacebar
  const spaceRow = document.createElement('div');
  spaceRow.className = 'keyboard-row';
  const spaceKey = document.createElement('div');
  spaceKey.className = 'key space';
  spaceKey.textContent = 'Space';
  spaceKey.setAttribute('data-key', ' ');
  spaceRow.appendChild(spaceKey);
  keyboard.appendChild(spaceRow);
}

function highlightKey(key) {
  // Remove previous highlights
  document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
  
  // Highlight current key
  const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
  if (keyElement) {
    keyElement.classList.add('active');
    setTimeout(() => keyElement.classList.remove('active'), 200);
  }
}

// Event listeners for keyboard
document.addEventListener('keydown', function(e) {
  highlightKey(e.key);
});

// Navigation Functions
function backToDashboard() {
  updateDashboard();
  showScreen('dashboard-screen');
}

function restartLesson() {
  if (gameState.currentLesson) {
    startLesson(gameState.currentLesson);
  }
}

function pauseLesson() {
  // Simple pause by blurring input
  const input = document.getElementById('practice-input');
  if (input) {
    input.blur();
  }
}

function nextLesson() {
  const currentId = gameState.currentLesson.id;
  const nextLesson = appData.typingLevels.find(l => l.id === currentId + 1);
  
  if (nextLesson) {
    startLesson(nextLesson);
  } else {
    backToDashboard();
  }
}

function retryLesson() {
  if (gameState.currentLesson) {
    startLesson(gameState.currentLesson);
  }
}

// Achievement Modal
function showAllAchievements() {
  const modal = document.getElementById('achievements-modal');
  const grid = document.getElementById('all-achievements-grid');
  
  grid.innerHTML = '';
  
  appData.achievements.forEach(achievement => {
    const isEarned = gameState.userStats.earnedAchievements.includes(achievement.id);
    
    const achievementCard = document.createElement('div');
    achievementCard.className = `achievement-card ${isEarned ? 'earned' : 'locked'}`;
    achievementCard.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <h4>${achievement.name}</h4>
      <p>${achievement.description}</p>
      <div class="achievement-points">+${achievement.points} XP</div>
    `;
    
    grid.appendChild(achievementCard);
  });
  
  modal.classList.remove('hidden');
}

function closeAchievementsModal() {
  document.getElementById('achievements-modal').classList.add('hidden');
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  
  // Add some sample progress for demo
  gameState.userStats.streak = 3;
  gameState.userStats.xp = 450;
  gameState.userStats.bestWpm = 35;
  gameState.userStats.avgAccuracy = 92;
  gameState.userStats.practiceTime = 25;
});