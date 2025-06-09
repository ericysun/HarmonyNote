const reminders = [];

// Expand the date picker on click
const datePickerButton = document.getElementById("datePickerButton");
const reminderTimeInput = document.getElementById("reminderTime");

datePickerButton.addEventListener("click", () => {
  reminderTimeInput.showPicker?.(); // Use the `showPicker` method if supported
  reminderTimeInput.click(); // Fallback to trigger the native date picker
});

reminderTimeInput.addEventListener("click", () => {
  reminderTimeInput.classList.toggle("expanded");
});

// Add a new reminder
document.getElementById("save").addEventListener("click", () => {
  const note = document.getElementById("note").value;
  const reminderTime = document.getElementById("reminderTime").value;

  if (note) {
    const reminder = { note, reminderTime: reminderTime || null }; // Allow reminders without dates
    reminders.push(reminder);
    sortRemindersByDate(); // Sort reminders by date
    displayReminders();
    document.getElementById("note").value = ""; 
    document.getElementById("reminderTime").value = ""; 
  } else {
    document.getElementById("status").innerText = "Please enter a note.";
  }
});

// Function to sort reminders by date
function sortRemindersByDate() {
  reminders.sort((a, b) => {
    if (!a.reminderTime) return 1; // Reminders without dates go to the bottom
    if (!b.reminderTime) return -1;
    return new Date(a.reminderTime) - new Date(b.reminderTime); // Sort by date (earlier dates first)
  });
}

// Function to display reminders
function displayReminders() {
  const remindersDiv = document.getElementById("reminders");
  remindersDiv.innerHTML = ""; // Clear existing reminders

  reminders.forEach((reminder, index) => {
    const tile = document.createElement("div");
    tile.className = "reminder-tile";
    tile.innerHTML = `
      <div class="reminder-header">
        <span>${reminder.note}</span>
        <div class="action-buttons">
          <button class="check-btn" data-index="${index}">✔</button>
          <button class="expand-btn" data-index="${index}">+</button>
        </div>
      </div>
      <div class="reminder-details" style="display: none;">
        <p>Date: ${reminder.reminderTime ? new Date(reminder.reminderTime).toLocaleString() : "No date set"}</p>
        <p>Details: ${reminder.note}</p>
      </div>
    `;
    remindersDiv.appendChild(tile);
  });

  document.querySelectorAll(".expand-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const details = remindersDiv.children[index].querySelector(".reminder-details");
      details.style.display = details.style.display === "none" ? "block" : "none";
    });
  });

  document.querySelectorAll(".check-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      reminders.splice(index, 1); 
      displayReminders();
    });
  });
}