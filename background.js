chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getRAMUsage') {
      // Use chrome's performance memory API to fetch memory usage
      chrome.scripting.executeScript(
        {
          target: { tabId: request.tabId },
          func: () => performance.memory
        },
        (results) => {
          if (results && results.length > 0) {
            const { usedJSHeapSize, totalJSHeapSize } = results[0].result;
            sendResponse({ usedJSHeapSize, totalJSHeapSize });
          } else {
            sendResponse({ error: 'Unable to retrieve memory usage.' });
          }
        }
      );
      return true; // Keeps the message channel open for asynchronous response
    }
  });
  