let reminders = [];

function sortRemindersByDate() {
  reminders.sort((a, b) => {
    if (!a.reminderTime) return 1;
    if (!b.reminderTime) return -1;
    return new Date(a.reminderTime) - new Date(b.reminderTime);
  });
}

function displayReminders() {
  const remindersDiv = document.getElementById("reminders");
  remindersDiv.innerHTML = "";

  reminders.forEach((reminder, index) => {
    const tile = document.createElement("div");
    tile.className = "reminder-tile";
    tile.innerHTML = `
      <div class="reminder-header">
        <span>${reminder.note}</span>
        <div class="action-buttons">
          <button class="check-btn" data-index="${index}">✔</button>
          <button class="expand-btn" data-index="${index}" aria-label="Expand">
            <div class="descriptionExpander">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
      <div class="reminder-date">
        ${reminder.reminderTime ? new Date(reminder.reminderTime).toLocaleString() : ""}
      </div>
      <div class="reminder-details" style="display: none;">
        <p>${reminder.note}</p>
      </div>
      `;
    remindersDiv.appendChild(tile);
  });

  document.querySelectorAll(".expand-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const index = btn.getAttribute("data-index");
      const details = remindersDiv.children[index].querySelector(".reminder-details");
      const expander = btn.querySelector(".descriptionExpander");
      if (details.style.display === "none") {
        details.style.display = "block";
        expander.classList.add("open");
      } else {
        details.style.display = "none";
        expander.classList.remove("open");
      }
    });
  });

  document.querySelectorAll(".check-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      reminders.splice(index, 1);
      saveReminders();
      displayReminders();
    });
  });
}

function loadReminders() {
  chrome.storage.sync.get({ reminders: [] }, (result) => {
    reminders = result.reminders;
    sortRemindersByDate();
    displayReminders();
  });
}

function saveReminders() {
  chrome.storage.sync.set({ reminders });
}

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("note");
  const placeholderText = "Jot down notes here...";
  let i = 0;
  textarea.placeholder = "";

  function typePlaceholder() {
    if (i < placeholderText.length) {
      textarea.placeholder += placeholderText.charAt(i);
      i++;
      setTimeout(typePlaceholder, 50);
    }
  }
  typePlaceholder();

  const datePickerButton = document.getElementById("datePickerButton");
  const reminderTimeInput = document.getElementById("reminderTime");

  datePickerButton.addEventListener("click", () => {
    reminderTimeInput.showPicker?.();
    reminderTimeInput.click();
  });

  reminderTimeInput.addEventListener("click", () => {
    reminderTimeInput.classList.toggle("expanded");
  });

  loadReminders();

  document.getElementById("save").addEventListener("click", () => {
    const note = document.getElementById("note").value;
    const reminderTime = document.getElementById("reminderTime").value;
    const status = document.getElementById("status");

    if (note) {
      const reminder = { note, reminderTime: reminderTime || null };
      reminders.push(reminder);
      sortRemindersByDate();
      saveReminders();
      displayReminders();
      document.getElementById("note").value = "";
      document.getElementById("reminderTime").value = "";
      status.innerText = "";
      status.classList.remove("visible");
    } else {
      status.innerText = "Please enter a note.";
      status.classList.add("visible");
      setTimeout(() => {
        status.classList.remove("visible");
        setTimeout(() => {
          status.innerText = "";
        }, 500);
      }, 3000);
    }
  });
});