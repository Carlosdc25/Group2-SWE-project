const publicVapidKey = "BBFPmJ3We2RjxJ1fbMFaznxyX1FvgDy0mrk2dWZFDQZBRGjbIKoL_gJj8NoVld4sCaZ3N-Tit6CSJaK5iwVAjQA"; // Replace with your actual key

// Function to register the service worker and set up push notifications
export async function registerPushNotifications() {
  // Check if service workers are supported
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported in this browser.");
    return;
  }

  try {
    // Register the service worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Push Registered...");

    // Send Push Subscription to the server
    console.log("Sending Push Subscription to the server...");
    await fetch("http://localhost:3000/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Push Subscription Sent...");
  } catch (error) {
    console.error("Error setting up push notifications:", error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
