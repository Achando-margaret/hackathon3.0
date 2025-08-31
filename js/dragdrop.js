// Drag and Drop functionality for Task Board

class TaskBoard {
  constructor() {
    this.taskLists = document.querySelectorAll('.task-list');
    this.taskCards = document.querySelectorAll('.task-card');
    this.draggedElement = null;
    
    this.init();
  }

  init() {
    this.setupDragAndDrop();
    this.addTaskListeners();
  }

  setupDragAndDrop() {
    // Make task cards draggable
    this.taskCards.forEach(card => {
      card.draggable = true;
      
      card.addEventListener('dragstart', (e) => {
        this.handleDragStart(e);
      });
      
      card.addEventListener('dragend', (e) => {
        this.handleDragEnd(e);
      });
    });

    // Setup drop zones
    this.taskLists.forEach(list => {
      list.addEventListener('dragover', (e) => {
        this.handleDragOver(e);
      });
      
      list.addEventListener('drop', (e) => {
        this.handleDrop(e);
      });
      
      list.addEventListener('dragenter', (e) => {
        this.handleDragEnter(e);
      });
      
      list.addEventListener('dragleave', (e) => {
        this.handleDragLeave(e);
      });
    });
  }

  handleDragStart(e) {
    this.draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    
    // Add visual feedback
    e.target.style.opacity = '0.5';
    
    // Show drop zones
    this.taskLists.forEach(list => {
      if (list !== e.target.closest('.task-list')) {
        list.classList.add('drop-zone-active');
      }
    });
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.style.opacity = '1';
    
    // Remove drop zone styling
    this.taskLists.forEach(list => {
      list.classList.remove('drop-zone-active');
    });
    
    this.draggedElement = null;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.task-list').classList.add('drag-over');
  }

  handleDragLeave(e) {
    const taskList = e.target.closest('.task-list');
    if (!taskList.contains(e.relatedTarget)) {
      taskList.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.task-list');
    const newStatus = dropZone.getAttribute('data-status');
    
    if (this.draggedElement) {
      // Update task status
      this.updateTaskStatus(this.draggedElement, newStatus);
      
      // Move the element
      dropZone.appendChild(this.draggedElement);
      
      // Update task count
      this.updateTaskCounts();
      
      // Show success message
      if (window.StudyAssistant) {
        window.StudyAssistant.showNotification('Task moved successfully! ✅', 'success');
      }
      
      // Add completion animation
      if (newStatus === 'completed') {
        this.draggedElement.classList.add('completed');
        this.animateCompletion(this.draggedElement);
      }
    }
    
    // Remove drag styling
    this.taskLists.forEach(list => {
      list.classList.remove('drag-over', 'drop-zone-active');
    });
  }

  updateTaskStatus(taskElement, newStatus) {
    // Update the task's visual status
    const statusMap = {
      'todo': 'To Review',
      'progress': 'In Progress',
      'completed': 'Completed'
    };
    
    // Update task meta information
    const taskMeta = taskElement.querySelector('.task-meta');
    if (taskMeta) {
      const dueElement = taskMeta.querySelector('.task-due');
      if (dueElement && newStatus === 'completed') {
        dueElement.textContent = `Completed: ${new Date().toLocaleDateString()}`;
        dueElement.className = 'task-completed';
      }
    }
    
    // Update task priority styling for completed tasks
    if (newStatus === 'completed') {
      const priorityElement = taskElement.querySelector('.task-priority');
      if (priorityElement) {
        priorityElement.textContent = 'Done';
        priorityElement.className = 'task-priority completed';
        priorityElement.style.cssText = `
          background: var(--accent-100);
          color: var(--accent-700);
        `;
      }
    }
  }

  updateTaskCounts() {
    this.taskLists.forEach(list => {
      const countElement = list.previousElementSibling.querySelector('.task-count');
      const taskCount = list.children.length;
      countElement.textContent = taskCount;
      
      // Animate count change
      countElement.style.transform = 'scale(1.2)';
      setTimeout(() => {
        countElement.style.transform = 'scale(1)';
      }, 200);
    });
  }

  animateCompletion(taskElement) {
    // Add completion animation
    taskElement.style.transform = 'scale(1.05)';
    taskElement.style.background = 'linear-gradient(135deg, var(--accent-50), var(--accent-100))';
    
    // Add confetti effect
    this.createConfetti(taskElement);
    
    setTimeout(() => {
      taskElement.style.transform = 'scale(1)';
    }, 500);
  }

  createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['🌸', '🌷', '🌼', '✨', '🎉'];
    
    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement('div');
      confetti.textContent = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
        animation: confettiFall 1s ease-out forwards;
      `;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 1000);
    }
  }

  addTaskListeners() {
    // Add click listeners for task actions
    this.taskCards.forEach(card => {
      // Double-click to edit task
      card.addEventListener('dblclick', () => {
        this.editTask(card);
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
      });
      
      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('dragging')) {
          card.style.transform = 'translateY(0)';
        }
      });
    });
  }

  editTask(taskElement) {
    const titleElement = taskElement.querySelector('.task-title');
    const descriptionElement = taskElement.querySelector('.task-description');
    
    const newTitle = prompt('Edit task title:', titleElement.textContent);
    if (newTitle && newTitle !== titleElement.textContent) {
      titleElement.textContent = newTitle;
      
      if (window.StudyAssistant) {
        window.StudyAssistant.showNotification('Task updated! ✏️', 'success');
      }
    }
  }

  // Add new task functionality
  addNewTask(column, title, description, priority = 'medium') {
    const taskList = document.querySelector(`[data-status="${column}"]`);
    if (!taskList) return;
    
    const taskId = Date.now();
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card card';
    taskCard.draggable = true;
    taskCard.setAttribute('data-task', taskId);
    
    const priorityColors = {
      high: { bg: '#fecaca', color: '#dc2626' },
      medium: { bg: '#fed7aa', color: '#ea580c' },
      low: { bg: '#d1fae5', color: '#059669' }
    };
    
    taskCard.innerHTML = `
      <div class="task-tag math">New</div>
      <h4 class="task-title">${title}</h4>
      <p class="task-description">${description}</p>
      <div class="task-meta">
        <span class="task-due">Due: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
        <span class="task-priority ${priority}" style="background: ${priorityColors[priority].bg}; color: ${priorityColors[priority].color};">${priority}</span>
      </div>
    `;
    
    // Add drag and drop functionality
    taskCard.addEventListener('dragstart', (e) => {
      this.handleDragStart(e);
    });
    
    taskCard.addEventListener('dragend', (e) => {
      this.handleDragEnd(e);
    });
    
    // Add to task list
    taskList.appendChild(taskCard);
    
    // Update task count
    this.updateTaskCounts();
    
    // Animate in
    taskCard.style.opacity = '0';
    taskCard.style.transform = 'translateY(20px)';
    setTimeout(() => {
      taskCard.style.transition = 'all 0.3s ease';
      taskCard.style.opacity = '1';
      taskCard.style.transform = 'translateY(0)';
    }, 100);
    
    return taskCard;
  }
}

// Add confetti animation styles
const confettiStyles = `
  @keyframes confettiFall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100px) rotate(360deg);
      opacity: 0;
    }
  }
  
  .drop-zone-active {
    background: var(--primary-50) !important;
    border: 2px dashed var(--primary-300) !important;
    border-radius: var(--radius-lg);
  }
  
  .drag-over {
    background: var(--accent-50) !important;
    border: 2px solid var(--accent-300) !important;
  }
  
  .task-card.dragging {
    transform: rotate(5deg) scale(1.05);
    box-shadow: var(--shadow-xl);
    z-index: 1000;
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = confettiStyles;
document.head.appendChild(styleSheet);

// Initialize task board when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the task board page
  if (document.getElementById('task-board')) {
    new TaskBoard();
    
    // Add sample tasks if none exist
    setTimeout(() => {
      const existingTasks = document.querySelectorAll('.task-card');
      if (existingTasks.length <= 3) {
        const taskBoard = new TaskBoard();
        taskBoard.addNewTask('todo', 'Review Biology Notes', 'Go through Chapter 5-7 for upcoming exam', 'high');
        taskBoard.addNewTask('progress', 'Complete Math Homework', 'Finish calculus problems 1-20', 'medium');
        taskBoard.addNewTask('completed', 'Read Literature Assignment', 'Analyze themes in assigned novel', 'low');
      }
    }, 1000);
  }
});
