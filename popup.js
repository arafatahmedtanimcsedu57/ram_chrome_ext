document.addEventListener('DOMContentLoaded', function () {
    const ramUsageElement = document.getElementById('ram-usage');
    const ramAlocation = document.getElementById('ram-alocation');
    const ramLimit = document.getElementById('ram-limit');
    
    const refreshButton = document.getElementById('refresh');
  
    // Fetch and display the RAM usage when the popup opens
    getMemoryUsage();
  
    refreshButton.addEventListener('click', getMemoryUsage);
  
    function getMemoryUsage() {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTabId = tabs[0].id;
  
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTabId },
            func: fetchMemoryUsage
          },
          (result) => {
            const memoryData = result[0]?.result || {};
            const jsHeapSizeLimit = memoryData.jsHeapSizeLimit / (1024 * 1024); // Convert to MB
            const totalJSHeapSize = memoryData.totalJSHeapSize / (1024 * 1024);
            const usedJSHeapSize = memoryData.usedJSHeapSize / (1024 * 1024);
            
            ramUsageElement.textContent = `Used: ${usedJSHeapSize.toFixed(2)} MB`
            ramAlocation.textContent  = `Allotted: ${totalJSHeapSize.toFixed(2)} MB` 
            ramLimit.textContent =  `Limit: ${jsHeapSizeLimit.toFixed(2)} MB`;
          }
        );
      });
    }
  
    function fetchMemoryUsage() {
      if (performance && performance.memory) {
        return {
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          usedJSHeapSize: performance.memory.usedJSHeapSize
        };
      } else {
        return {
          jsHeapSizeLimit: 0,
          totalJSHeapSize: 0,
          usedJSHeapSize: 0
        };
      }
    }
  });
  