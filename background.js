chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "setReminder") {
      const delayInMinutes = Math.ceil(message.delay / 60000);
      chrome.alarms.create("stickyNoteReminder", { delayInMinutes: delayInMinutes });
    }
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "stickyNoteReminder") {
      chrome.storage.sync.get("stickyNote", function (result) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon48.png",
          title: "Sticky Note Reminder",
          message: result.stickyNote || "You have a reminder!"
        });
      });
    }
  });
