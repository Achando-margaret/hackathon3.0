// AI Chat functionality

class AIChat {
  constructor() {
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.quickBtns = document.querySelectorAll('.quick-btn');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.addWelcomeMessage();
  }

  setupEventListeners() {
    // Send button click
    this.sendBtn.addEventListener('click', () => {
      this.sendMessage();
    });

    // Enter key press
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // Quick action buttons
    this.quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        this.chatInput.value = message;
        this.sendMessage();
      });
    });

    // Input focus animation
    this.chatInput.addEventListener('focus', () => {
      this.chatInput.style.transform = 'scale(1.02)';
    });

    this.chatInput.addEventListener('blur', () => {
      this.chatInput.style.transform = 'scale(1)';
    });
  }

  addWelcomeMessage() {
    // Add a welcome message if chat is empty
    if (this.chatMessages.children.length === 0) {
      this.addAIMessage("Hello! I'm your AI study assistant. How can I help you today? I can help with:\n\n• 📚 Explaining difficult concepts\n• 📝 Creating study notes\n• 🧠 Generating practice quizzes\n• 📅 Planning your study schedule");
    }
  }

  sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Add user message
    this.addUserMessage(message);
    
    // Clear input
    this.chatInput.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
      this.hideTypingIndicator();
      this.generateAIResponse(message);
    }, 1500 + Math.random() * 1000);
  }

  addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message fade-in';
    messageElement.innerHTML = `
      <div class="message-avatar">👩‍🎓</div>
      <div class="message-content">
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
    
    this.chatMessages.appendChild(messageElement);
    this.scrollToBottom();
  }

  addAIMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message fade-in';
    messageElement.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <p>${this.formatMessage(message)}</p>
      </div>
    `;
    
    this.chatMessages.appendChild(messageElement);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'message ai-message typing-indicator';
    typingElement.id = 'typingIndicator';
    typingElement.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    this.chatMessages.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  generateAIResponse(userMessage) {
    const responses = this.getAIResponses(userMessage);
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.addAIMessage(response);
  }

  getAIResponses(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Math-related responses
    if (message.includes('math') || message.includes('calculus') || message.includes('algebra')) {
      return [
        "Great question about math! Let me help you understand this concept. 📐\n\nFor calculus derivatives, remember that the derivative represents the rate of change. Here's a simple approach:\n\n• **Power Rule**: If f(x) = x^n, then f'(x) = nx^(n-1)\n• **Product Rule**: (fg)' = f'g + fg'\n• **Chain Rule**: (f(g(x)))' = f'(g(x)) × g'(x)\n\nWould you like me to work through a specific example with you?",
        "Math can be challenging, but you've got this! 🧮\n\nLet me break down this concept step by step:\n\n1. **Identify the function type**\n2. **Apply the appropriate rule**\n3. **Simplify the result**\n4. **Check your work**\n\nI can create a practice quiz for you to test your understanding. Would that be helpful?",
        "I love helping with math problems! 📊\n\nHere's a study tip: Try to understand the 'why' behind each rule, not just memorize the formulas. This will help you apply them correctly in different situations.\n\nWould you like me to create some practice problems for you?"
      ];
    }
    
    // Study plan responses
    if (message.includes('study plan') || message.includes('schedule') || message.includes('planning')) {
      return [
        "I'd be happy to help you create a study plan! 📅\n\nHere's a framework I recommend:\n\n**1. Assess your current situation**\n• What subjects need the most attention?\n• How much time do you have available?\n• What are your learning goals?\n\n**2. Create a weekly schedule**\n• Block out study time for each subject\n• Include breaks and review sessions\n• Be realistic about your capacity\n\n**3. Set specific goals**\n• Break large topics into smaller chunks\n• Set daily and weekly targets\n• Track your progress\n\nWould you like me to help you create a personalized study schedule?",
        "Study planning is one of my specialties! 🎯\n\nHere's a proven method:\n\n**Pomodoro Technique**:\n• 25 minutes of focused study\n• 5-minute break\n• Repeat 4 times\n• Take a longer 15-30 minute break\n\n**Active Recall**:\n• Test yourself regularly\n• Use flashcards\n• Explain concepts out loud\n• Teach someone else\n\nI can help you implement these techniques in your study routine. What subject would you like to focus on first?",
        "Let's create an effective study plan together! 📚\n\n**SMART Goals Framework**:\n• **Specific**: What exactly do you want to learn?\n• **Measurable**: How will you know you've succeeded?\n• **Achievable**: Is this realistic given your time?\n• **Relevant**: Does this align with your objectives?\n• **Time-bound**: When do you want to achieve this?\n\nWhat's your main study goal right now?"
      ];
    }
    
    // Quiz-related responses
    if (message.includes('quiz') || message.includes('test') || message.includes('practice')) {
      return [
        "I'd love to create a quiz for you! 🧠\n\nHere's a sample quiz on photosynthesis:\n\n**Question 1**: What is the main purpose of photosynthesis?\nA) To produce oxygen\nB) To convert light energy into chemical energy\nC) To break down glucose\nD) To absorb water\n\n**Question 2**: Which organelle is responsible for photosynthesis?\nA) Mitochondria\nB) Chloroplast\nC) Nucleus\nD) Ribosome\n\n**Question 3**: What are the two main stages of photosynthesis?\nA) Light and dark reactions\nB) Glycolysis and Krebs cycle\nC) Transcription and translation\nD) Mitosis and meiosis\n\nTake your time, and let me know your answers! I'll provide detailed explanations.",
        "Practice makes perfect! Let's test your knowledge! 📝\n\nI can create quizzes on various topics:\n\n• **Multiple choice questions**\n• **True/false statements**\n• **Fill-in-the-blank exercises**\n• **Problem-solving scenarios**\n\nWhat topic would you like to be quizzed on? I'll make sure the questions are appropriate for your level and help you understand any concepts you find challenging.",
        "Quizzes are a great way to reinforce learning! 🎯\n\nHere's a quick self-assessment technique:\n\n**Before studying**:\n• What do you already know about this topic?\n• What questions do you have?\n\n**After studying**:\n• Can you explain it to someone else?\n• What connections can you make to other topics?\n• What would you like to explore further?\n\nI can create a personalized quiz based on your study materials. What subject are you working on?"
      ];
    }
    
    // General study help
    if (message.includes('help') || message.includes('confused') || message.includes('don\'t understand')) {
      return [
        "I'm here to help you succeed! 🌟\n\nDon't worry about being confused - that's a normal part of learning. Here are some strategies that might help:\n\n**Break it down**:\n• Start with the basics\n• Build understanding step by step\n• Ask specific questions\n\n**Use different approaches**:\n• Visual diagrams and charts\n• Real-world examples\n• Practice problems\n• Discussion with others\n\nWhat specific concept are you struggling with? I'll help you understand it better!",
        "Confusion is just the first step to understanding! 💡\n\nHere's how I can help:\n\n**1. Clarify the concept**\n• Explain in simpler terms\n• Use analogies and examples\n• Break down complex ideas\n\n**2. Provide practice**\n• Create exercises\n• Give step-by-step solutions\n• Offer different problem types\n\n**3. Check understanding**\n• Ask you to explain back\n• Identify knowledge gaps\n• Suggest next steps\n\nWhat topic would you like to explore together?",
        "You're not alone in this learning journey! 🤝\n\nEvery student faces challenges, and that's completely normal. Here's my approach to help:\n\n**Active Learning**:\n• Ask questions as you go\n• Make connections to what you know\n• Practice explaining concepts\n\n**Growth Mindset**:\n• View challenges as opportunities\n• Learn from mistakes\n• Celebrate small wins\n\n**Personalized Support**:\n• Adapt to your learning style\n• Provide relevant examples\n• Adjust difficulty as needed\n\nWhat would you like to work on today?"
      ];
    }
    
    // Default responses
    return [
      "That's a great question! 🤔\n\nI'm here to help you with your studies. I can assist with:\n\n• **Explaining concepts** in simple terms\n• **Creating study materials** like notes and flashcards\n• **Generating practice questions** and quizzes\n• **Planning study schedules** and routines\n• **Providing motivation** and study tips\n\nCould you be more specific about what you'd like help with? I'm ready to dive deep into any topic!",
      "I'm excited to help you learn! 🚀\n\nHere are some ways I can support your studies:\n\n**Academic Support**:\n• Break down complex topics\n• Provide step-by-step explanations\n• Create practice exercises\n\n**Study Strategies**:\n• Time management techniques\n• Memory improvement methods\n• Test preparation tips\n\n**Motivation & Support**:\n• Encouragement and positive reinforcement\n• Goal setting and tracking\n• Study habit formation\n\nWhat area would you like to focus on today?",
      "Let's make learning fun and effective! 🎓\n\nI'm designed to be your personal study companion. Here's what I can do:\n\n**Immediate Help**:\n• Answer questions in real-time\n• Provide instant explanations\n• Offer quick study tips\n\n**Long-term Support**:\n• Track your progress\n• Suggest study improvements\n• Adapt to your learning style\n\n**Interactive Learning**:\n• Create engaging quizzes\n• Generate discussion topics\n• Provide hands-on exercises\n\nWhat's on your study agenda today? I'm ready to help you succeed!"
    ];
  }

  formatMessage(message) {
    // Convert line breaks to HTML
    return message.replace(/\n/g, '<br>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

// Initialize chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the AI assistant page
  if (document.getElementById('ai-assistant')) {
    new AIChat();
  }
});

// Add typing indicator styles
const typingStyles = `
  .typing-indicator .message-content {
    background: var(--neutral-100);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    border-top-left-radius: var(--radius-sm);
  }
  
  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  
  .typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--neutral-400);
    animation: typingDot 1.4s infinite ease-in-out;
  }
  
  .typing-dots span:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  .typing-dots span:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  @keyframes typingDot {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = typingStyles;
document.head.appendChild(styleSheet);
