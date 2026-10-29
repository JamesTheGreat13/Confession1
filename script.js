(() => {
  const endButton = document.getElementById("endButton");
  const note = document.getElementById("playfulNote");
  const card = document.querySelector(".card");

  if (!endButton || !card) return;

  let dodges = 0;
  let isDodging = false;

  // Make the button a floating target so it can jump around the viewport.
  function placeButtonInitially() {
    const rect = endButton.getBoundingClientRect();
    endButton.style.position = "fixed";
    endButton.style.left = `${rect.left}px`;
    endButton.style.top = `${rect.top}px`;
    endButton.style.width = `${rect.width}px`;
    endButton.style.zIndex = "20";
    endButton.style.transition = "left 110ms ease-out, top 110ms ease-out, transform 110ms ease-out";
  }

  function jumpFarAway() {
    if (!isDodging) {
      placeButtonInitially();
      isDodging = true;
    }

    const margin = 18;
    const width = endButton.offsetWidth || 160;
    const height = endButton.offsetHeight || 50;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);

    const currentX = parseFloat(endButton.style.left) || 0;
    const currentY = parseFloat(endButton.style.top) || 0;

    // Pick a distant location, retrying to avoid tiny movements.
    let x = currentX;
    let y = currentY;
    for (let i = 0; i < 20; i++) {
      x = margin + Math.random() * Math.max(1, maxX - margin);
      y = margin + Math.random() * Math.max(1, maxY - margin);
      if (Math.hypot(x - currentX, y - currentY) > Math.min(180, Math.min(window.innerWidth, window.innerHeight) * 0.35)) {
        break;
      }
    }

    endButton.style.left = `${Math.min(maxX, Math.max(margin, x))}px`;
    endButton.style.top = `${Math.min(maxY, Math.max(margin, y))}px`;
    endButton.style.transform = `rotate(${Math.random() * 24 - 12}deg)`;

    dodges += 1;
    if (note) {
      const messages = [
        "Hehe, too slow! 😭💗",
        "You almost got it... almost. 😂",
        "This button is REALLY shy. 🏃‍♂️",
        "Still trying? HAHAHA. 💗",
        "Only the other button knows the way back. ✨"
      ];
      note.textContent = messages[Math.min(dodges - 1, messages.length - 1)];
    }
  }

  // Dodge before click/tap, not just after.
  endButton.addEventListener("pointerenter", jumpFarAway);
  endButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    jumpFarAway();
  });
  endButton.addEventListener("click", (event) => {
    event.preventDefault();
    jumpFarAway();
  });

  // On touch screens, move it as soon as a finger approaches the button.
  document.addEventListener("touchstart", (event) => {
    if (!isDodging || !event.touches.length) return;
    const touch = event.touches[0];
    const rect = endButton.getBoundingClientRect();
    const buffer = 65;
    const near =
      touch.clientX >= rect.left - buffer &&
      touch.clientX <= rect.right + buffer &&
      touch.clientY >= rect.top - buffer &&
      touch.clientY <= rect.bottom + buffer;
    if (near) {
      event.preventDefault();
      jumpFarAway();
    }
  }, { passive: false });

  window.addEventListener("resize", () => {
    if (!isDodging) return;
    const maxX = Math.max(18, window.innerWidth - endButton.offsetWidth - 18);
    const maxY = Math.max(18, window.innerHeight - endButton.offsetHeight - 18);
    endButton.style.left = `${Math.min(maxX, Math.max(18, parseFloat(endButton.style.left) || 18))}px`;
    endButton.style.top = `${Math.min(maxY, Math.max(18, parseFloat(endButton.style.top) || 18))}px`;
  });
})();
