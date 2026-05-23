chrome.runtime.onInstalled.addListener(() => {
    console.log("Kairos Gatekeeper Extension Installed.");
    // In production, we sync settings from Kairos PWA via messaging.
    chrome.storage.local.set({ timeLimit: 15, triggerCount: 5 });
});
