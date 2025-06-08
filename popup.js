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

//add a new reminder
document.getElementById("save").addEventListener("click", () => {
  const note = document.getElementById("note").value;
  const reminderTime = document.getElementById("reminderTime").value;

  if (note && reminderTime) {
    const reminder = { note, reminderTime };
    reminders.push(reminder);
    displayReminders();
    document.getElementById("note").value = ""; // Clear the note input
    document.getElementById("reminderTime").value = ""; // Clear the date input
  } else {
    document.getElementById("status").innerText = "Please fill out both fields.";
  }
});

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
        <p>Date: ${new Date(reminder.reminderTime).toLocaleString()}</p>
        <p>Details: ${reminder.note}</p>
      </div>
    `;
    remindersDiv.appendChild(tile);
  });

  // Add event listeners to expand buttons
  document.querySelectorAll(".expand-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const details = remindersDiv.children[index].querySelector(".reminder-details");
      details.style.display = details.style.display === "none" ? "block" : "none";
    });
  });

  // Add event listeners to check buttons
  document.querySelectorAll(".check-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      reminders.splice(index, 1); // Remove the reminder from the array
      displayReminders(); // Refresh the reminders display
    });
  });


  // Add event listeners to check buttons
  document.querySelectorAll(".check-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      reminders.splice(index, 1); // Remove the reminder from the array
      displayReminders(); // Refresh the reminders display
    });
  });

  // Add event listeners to check buttons
  document.querySelectorAll(".check-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      reminders.splice(index, 1); // Remove the reminder from the array
      displayReminders(); // Refresh the reminders display
    });
  });
}