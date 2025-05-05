document.addEventListener('DOMContentLoaded', function () {
    const note = document.getElementById('note');
    const reminderTime = document.getElementById('reminderTime');
    const status = document.getElementById('status');
  
    // Load saved data
    chrome.storage.sync.get(['stickyNote', 'reminderTime'], function (result) {
      note.value = result.stickyNote || '';
      if (result.reminderTime) {
        reminderTime.value = result.reminderTime;
      }
    });
  
    document.getElementById('save').addEventListener('click', function () {
      const noteValue = note.value;
      const reminderValue = reminderTime.value;
  
      chrome.storage.sync.set({ stickyNote: noteValue, reminderTime: reminderValue }, function () {
        status.textContent = 'Note and reminder saved!';
        setTimeout(() => status.textContent = '', 2000);
      });
  
      if (reminderValue) {
        const reminderDate = new Date(reminderValue);
        const delay = reminderDate.getTime() - Date.now();
  
        if (delay > 0) {
          chrome.runtime.sendMessage({ type: 'setReminder', delay });
        }
      }
    });
  });