console.log("Service Worker Loaded...");

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");

  self.registration.showNotification(data.title, {
    body: "You will now receive daily habit notifications!",
  });
});
