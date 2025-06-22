let reminders = [];

function sortRemindersByDate() {
  reminders.sort((a, b) => {
    if ((b.favorite ? 1 : 0) !== (a.favorite ? 1 : 0)) {
      return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
    }
    if (!a.reminderTime) return 1;
    if (!b.reminderTime) return -1;
    return new Date(a.reminderTime) - new Date(b.reminderTime);
  });
}

let isFavorite = false;

function displayReminders() {
  const remindersDiv = document.getElementById("reminders");
  remindersDiv.innerHTML = "";

  reminders.forEach((reminder, index) => {
    const tile = document.createElement("div");
    tile.className = "reminder-tile";
    tile.innerHTML = `
      <div class="reminder-header">
        <div style="display: flex; align-items: center;">
          ${reminder.favorite ? '<span class="favorite-star" style="font-size: 1.3em; margin-right: 6px; color: gold;">★</span>' : ''}
          <span class="reminder-title" style="font-weight: bold;">${reminder.title || ''}</span>
        </div>
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
        <p>${reminder.description ? reminder.description : ''}</p>
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
  const titleInput = document.getElementById("reminder-title");
  const descriptionPlaceholderText = "Add an optional description here...";
  const titlePlaceholderText = "Jot down a reminder here...";
  let i = 0;
  textarea.placeholder = "";

  function typePlaceholder() {
    if (i < descriptionPlaceholderText.length) {
      textarea.placeholder += descriptionPlaceholderText.charAt(i);
      i++;
      setTimeout(typePlaceholder, 50);
    }
  }
  typePlaceholder();

  const datePickerButton = document.getElementById("datePickerButton");
  const reminderTimeInput = document.getElementById("reminderTime");
  const starButton = document.getElementById("starButton");

  datePickerButton.addEventListener("click", () => {
    reminderTimeInput.showPicker?.();
    reminderTimeInput.click();
  });

  reminderTimeInput.addEventListener("click", () => {
    reminderTimeInput.classList.toggle("expanded");
  });

  starButton.addEventListener("click", () => {
    isFavorite = !isFavorite;
    starButton.querySelector('span').textContent = isFavorite ? '★' : '☆';
  });

  loadReminders();

  document.getElementById("save").addEventListener("click", () => {
    const title = titleInput.value.trim();
    const description = textarea.value;
    const reminderTime = document.getElementById("reminderTime").value;
    const status = document.getElementById("status");

    if (title) {
      const reminder = { title, description, reminderTime: reminderTime || null, favorite: isFavorite };
      reminders.push(reminder);
      sortRemindersByDate();
      saveReminders();
      displayReminders();
      titleInput.value = "";
      textarea.value = "";
      document.getElementById("reminderTime").value = "";
      isFavorite = false;
      starButton.querySelector('span').textContent = '☆';
      status.innerText = "";
      status.classList.remove("visible");
    } else {
      status.innerText = "Please enter a title.";
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