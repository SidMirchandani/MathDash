document.addEventListener('DOMContentLoaded', () => {
  const bookCards = document.querySelectorAll('.book-card'); // All book cards
  const popup = document.getElementById('book-popup'); // Popup container
  const popupTitle = document.getElementById('popup-book-title'); // Popup title
  const popupInput = document.getElementById('popup-username'); // Answer input field
  const popupButton = document.getElementById('popup-link'); // "Check Answer" button
  const closeBtn = document.querySelector('.close-btn'); // Close button for popup
  const starSystem = document.getElementById('star-system'); // Star counter
  const userForm = document.getElementById('user-form'); // Email form
  const emailInput = document.getElementById('username'); // Email input
  const userMessage = document.getElementById('user-message'); // Message under the form
  let correctAnswer = "95"; // Set the correct answer for the current problem
  let problemID = "problem1"; // Example problem ID
  let email = ""; // Initialize email

  // Handle email submission
  userForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputEmail = emailInput.value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)) { // Validate email format
      email = inputEmail;
      const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
      const userStars = userProgress[email]?.stars || 0; // Retrieve stars for the email or default to 0
      starSystem.textContent = `⭐ ${userStars}`; // Update the star counter
      userMessage.textContent = `Welcome, ${email}! Your progress is now being tracked.`;
      userMessage.style.color = ""; // Reset message color
      if (!userProgress[email]) {
        userProgress[email] = { stars: 0, solvedProblems: [] }; // Initialize progress for new email
        localStorage.setItem('userProgress', JSON.stringify(userProgress)); // Save user data
      }
    } else {
      userMessage.textContent = 'Please enter a valid email address.';
      userMessage.style.color = 'red';
      setTimeout(() => (userMessage.textContent = ''), 3000);
    }
  });

  // Show popup on book card click
  bookCards.forEach(card => {
    card.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link navigation
      if (!email) {
        alert('Please enter your email first to start tracking progress.');
        return;
      }
      problemID = card.getAttribute('data-problem-id'); // Get the problem ID from the card
      correctAnswer = card.getAttribute('data-correct-answer'); // Get the correct answer for the problem
      const title = card.getAttribute('data-title'); // Get book title from data attribute
      popupTitle.textContent = title; // Set the title in the popup
      popupInput.value = ""; // Clear the input field
      popupInput.style.borderColor = ""; // Reset border color
      popup.classList.add('visible'); // Show popup
    });
  });

  // Close popup
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('visible'); // Hide popup
  });

  // Check Answer
  popupButton.addEventListener('click', (event) => {
    event.preventDefault();
    const userAnswer = popupInput.value.trim(); // Get user's answer
    const userProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
    const userStars = userProgress[email]?.stars || 0;
    const solvedProblems = userProgress[email]?.solvedProblems || [];

    if (solvedProblems.includes(problemID)) {
      // Problem already solved
      popupInput.style.borderColor = 'orange'; // Highlight orange for warning
      alert("You've already solved this problem and earned a star.");
    } else if (userAnswer === correctAnswer) {
      // Correct answer and problem not solved yet
      popupInput.style.borderColor = 'green'; // Highlight green
      userProgress[email].stars = userStars + 1; // Increment star count
      userProgress[email].solvedProblems.push(problemID); // Mark the problem as solved
      localStorage.setItem('userProgress', JSON.stringify(userProgress)); // Save updated progress
      starSystem.textContent = `⭐ ${userProgress[email].stars}`; // Update star counter
    } else {
      // Incorrect answer
      popupInput.style.borderColor = 'red'; // Highlight red
      setTimeout(() => {
        popupInput.style.borderColor = ''; // Reset after a short delay
      }, 500);
    }
  });

  // Load saved data from localStorage when the page loads
  const savedData = JSON.parse(localStorage.getItem('userProgress')) || {};
  if (email in savedData) {
    const userStars = savedData[email].stars;
    starSystem.textContent = `⭐ ${userStars}`;
    userMessage.textContent = `Welcome back, ${email}! Your progress is being tracked.`;
  }
});
