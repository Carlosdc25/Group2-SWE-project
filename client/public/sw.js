/*Sources

Notifications
https://www.youtube.com/watch?v=0-bSQ14H_PY
https://github.com/JEverhart383/knock-browser-push-demo/blob/main/package-lock.json
https://knock.app/blog/how-to-send-browser-push-notifications-from-nodejs
https://vapidkeys.com/
https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d*/

console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");

  self.registration.showNotification(data.title, {
    body: "Time to complete your habits!",
  });
});
