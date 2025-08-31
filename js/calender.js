// Calendar functionality

class StudyCalendar {
  constructor() {
    this.currentDate = new Date();
    this.calendarGrid = document.getElementById('calendarGrid');
    this.calendarTitle = document.getElementById('calendarTitle');
    this.prevMonthBtn = document.getElementById('prevMonth');
    this.nextMonthBtn = document.getElementById('nextMonth');
    this.viewToggle = document.querySelector('.view-toggle');
    
    this.events = this.loadEvents();
    this.currentView = 'monthly';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderCalendar();
    this.addSampleEvents();
  }

  setupEventListeners() {
    // Month navigation
    this.prevMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    this.nextMonthBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    // View toggle
    this.viewToggle.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggle-btn')) {
        this.toggleView(e.target);
      }
    });

    // Calendar day clicks
    this.calendarGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('calendar-day')) {
        this.handleDayClick(e.target);
      }
    });
  }

  toggleView(button) {
    // Update active button
    this.viewToggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    // Update view
    this.currentView = button.getAttribute('data-view');
    this.renderCalendar();
  }

  renderCalendar() {
    if (this.currentView === 'monthly') {
      this.renderMonthlyView();
    } else {
      this.renderWeeklyView();
    }
  }

  renderMonthlyView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Update title
    this.calendarTitle.textContent = this.currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    // Clear grid
    this.calendarGrid.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      const header = document.createElement('div');
      header.className = 'calendar-header-day';
      header.textContent = day;
      header.style.cssText = `
        font-weight: var(--font-weight-semibold);
        color: var(--neutral-600);
        text-align: center;
        padding: var(--space-2);
        border-bottom: 1px solid var(--neutral-200);
      `;
      this.calendarGrid.appendChild(header);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day other-month';
      emptyDay.style.cssText = `
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-weight: var(--font-weight-medium);
        color: var(--neutral-400);
      `;
      this.calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;
      dayElement.setAttribute('data-date', `${year}-${month + 1}-${day}`);
      
      // Check if this day has events
      const dayEvents = this.getEventsForDate(year, month + 1, day);
      if (dayEvents.length > 0) {
        dayElement.classList.add('has-event');
        dayElement.title = dayEvents.map(event => event.title).join(', ');
      }

      // Check if this is today
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
        dayElement.classList.add('today');
      }

      dayElement.style.cssText = `
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-weight: var(--font-weight-medium);
        color: var(--neutral-600);
        position: relative;
      `;

      // Add event indicators
      if (dayEvents.length > 0) {
        const eventIndicator = document.createElement('div');
        eventIndicator.className = 'event-indicator';
        eventIndicator.style.cssText = `
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: var(--primary-500);
          border-radius: 50%;
        `;
        dayElement.appendChild(eventIndicator);
      }

      this.calendarGrid.appendChild(dayElement);
    }

    // Add empty cells for days after the last day of the month
    const totalCells = this.calendarGrid.children.length - 7; // Subtract header row
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
    for (let i = 0; i < remainingCells; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day other-month';
      emptyDay.style.cssText = `
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-weight: var(--font-weight-medium);
        color: var(--neutral-400);
      `;
      this.calendarGrid.appendChild(emptyDay);
    }
  }

  renderWeeklyView() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Update title
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    this.calendarTitle.textContent = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    // Clear grid
    this.calendarGrid.innerHTML = '';

    // Add time slots (simplified for demo)
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    
    timeSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.textContent = time;
      timeSlot.style.cssText = `
        grid-column: 1;
        padding: var(--space-2);
        font-size: var(--font-size-sm);
        color: var(--neutral-500);
        border-right: 1px solid var(--neutral-200);
        display: flex;
        align-items: center;
      `;
      this.calendarGrid.appendChild(timeSlot);
    });

    // Add days of the week
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach((day, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      
      const dayHeader = document.createElement('div');
      dayHeader.className = 'week-day-header';
      dayHeader.innerHTML = `
        <div class="day-name">${day}</div>
        <div class="day-number">${dayDate.getDate()}</div>
      `;
      dayHeader.style.cssText = `
        grid-column: ${index + 2};
        text-align: center;
        padding: var(--space-2);
        border-bottom: 1px solid var(--neutral-200);
        background: var(--neutral-50);
      `;
      this.calendarGrid.appendChild(dayHeader);
    });

    // Add time slots for each day
    timeSlots.forEach((time, timeIndex) => {
      dayHeaders.forEach((day, dayIndex) => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'week-time-slot';
        timeSlot.style.cssText = `
          grid-column: ${dayIndex + 2};
          grid-row: ${timeIndex + 2};
          border: 1px solid var(--neutral-200);
          min-height: 40px;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        `;
        
        timeSlot.addEventListener('click', () => {
          this.addEvent(time, dayIndex);
        });
        
        this.calendarGrid.appendChild(timeSlot);
      });
    });

    // Update grid layout for weekly view
    this.calendarGrid.style.cssText = `
      display: grid;
      grid-template-columns: 80px repeat(7, 1fr);
      grid-template-rows: auto repeat(9, 40px);
      gap: 1px;
      background: var(--neutral-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
    `;
  }

  handleDayClick(dayElement) {
    const date = dayElement.getAttribute('data-date');
    if (date) {
      this.showDayEvents(date);
    }
  }

  showDayEvents(date) {
    const [year, month, day] = date.split('-').map(Number);
    const events = this.getEventsForDate(year, month, day);
    
    if (events.length > 0) {
      const eventList = events.map(event => 
        `• ${event.title} (${event.time})`
      ).join('\n');
      
      alert(`Events for ${month}/${day}/${year}:\n\n${eventList}`);
    } else {
      alert(`No events scheduled for ${month}/${day}/${year}`);
    }
  }

  addEvent(time, dayIndex) {
    const title = prompt('Enter event title:');
    if (title) {
      const event = {
        id: Date.now(),
        title: title,
        time: time,
        day: dayIndex,
        type: 'study'
      };
      
      this.events.push(event);
      this.saveEvents();
      this.renderCalendar();
      
      // Show success message
      if (window.StudyAssistant) {
        window.StudyAssistant.showNotification(`Event "${title}" added! 📅`, 'success');
      }
    }
  }

  getEventsForDate(year, month, day) {
    // This is a simplified version - in a real app, you'd filter by actual date
    return this.events.filter(event => {
      // For demo purposes, show some events on specific days
      const eventDay = (day + event.id) % 7; // Distribute events across days
      return eventDay === (day % 7);
    });
  }

  addSampleEvents() {
    if (this.events.length === 0) {
      this.events = [
        {
          id: 1,
          title: 'Math Study Session',
          time: '10:00 AM',
          day: 1,
          type: 'study'
        },
        {
          id: 2,
          title: 'Literature Review',
          time: '2:00 PM',
          day: 2,
          type: 'study'
        },
        {
          id: 3,
          title: 'Chemistry Lab Prep',
          time: '4:00 PM',
          day: 3,
          type: 'study'
        },
        {
          id: 4,
          title: 'History Essay',
          time: '11:00 AM',
          day: 4,
          type: 'assignment'
        },
        {
          id: 5,
          title: 'Physics Problem Set',
          time: '3:00 PM',
          day: 5,
          type: 'homework'
        }
      ];
      this.saveEvents();
    }
  }

  loadEvents() {
    try {
      const saved = localStorage.getItem('study-calendar-events');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }

  saveEvents() {
    try {
      localStorage.setItem('study-calendar-events', JSON.stringify(this.events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  }
}

// Initialize calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the study planner page
  if (document.getElementById('study-planner')) {
    new StudyCalendar();
  }
});
