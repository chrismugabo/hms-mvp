//---------------------------------------------
// Utility functions (localStorage helpers)
//---------------------------------------------
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  function loadFromStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  
  
  
  //---------------------------------------------
  // SELECT DOCTOR PAGE (index.html)
  //---------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const doctorListContainer = document.getElementById("doctor-list");
  
    if (doctorListContainer && typeof doctors !== "undefined") {
  
      // Display each doctor card dynamically
      doctors.forEach(doctor => {
        const card = document.createElement("div");
        card.classList.add("doctor-card");
  
        card.innerHTML = `
          <h4>${doctor.name}</h4>
          <p>${doctor.specialty}</p>
          <p>${doctor.location}</p>
          <button class="select-doctor-btn" data-id="${doctor.id}">
            Select
          </button>
        `;
  
        doctorListContainer.appendChild(card);
      });
  
      // Handle clicking "Select"
      doctorListContainer.addEventListener("click", (event) => {
        const btn = event.target.closest(".select-doctor-btn");
        if (!btn) return;
  
        const doctorId = Number(btn.getAttribute("data-id"));
        const selectedDoctor = doctors.find(d => d.id === doctorId);
  
        if (selectedDoctor) {
  
          // Highlight selected card
          document.querySelectorAll(".doctor-card").forEach(card =>
            card.classList.remove("selected")
          );
          btn.parentElement.classList.add("selected");
  
          saveToStorage("selectedDoctor", selectedDoctor);
          window.location.href = "datetime.html";
        }
      });
    }
  
  
  
    //---------------------------------------------
    // DATE & TIME PAGE (datetime.html)
    //---------------------------------------------
    const doctorInfoContainer = document.getElementById("selected-doctor");
    const timeSlotsContainer = document.getElementById("time-slots");
    const confirmBtn = document.getElementById("confirm-btn");
  
    const selectedDoctor = loadFromStorage("selectedDoctor");
  
    if (doctorInfoContainer && selectedDoctor) {
  
      // Show selected doctor details
      doctorInfoContainer.innerHTML = `
        <h3>Doctor: ${selectedDoctor.name}</h3>
        <p>Specialty: ${selectedDoctor.specialty}</p>
        <p>Location: ${selectedDoctor.location}</p>
        <hr>
      `;
  
      // Generate time slots
      const slots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"];
  
      slots.forEach(time => {
        const btn = document.createElement("button");
        btn.classList.add("time-btn");
        btn.textContent = time;
  
        // On click, save time + highlight selection
        btn.addEventListener("click", () => {
          saveToStorage("selectedTime", time);
  
          document.querySelectorAll(".time-btn").forEach(b =>
            b.classList.remove("selected-time")
          );
          btn.classList.add("selected-time");
        });
  
        timeSlotsContainer.appendChild(btn);
      });
  
      // Confirm appointment
      confirmBtn.addEventListener("click", () => {
        const selectedDate = document.getElementById("date").value;
  
        if (!selectedDate) {
          alert("Please select a date.");
          return;
        }
  
        saveToStorage("selectedDate", selectedDate);
        window.location.href = "confirmation.html";
      });
    }
  
  
  
    //---------------------------------------------
    // CONFIRMATION PAGE (confirmation.html)
    //---------------------------------------------
    const confirmContainer = document.getElementById("confirmation-details");
  
    if (confirmContainer) {
      const doctor = loadFromStorage("selectedDoctor");
      const date = loadFromStorage("selectedDate");
      const time = loadFromStorage("selectedTime");
  
      if (!doctor || !date || !time) {
        confirmContainer.innerHTML = `
          <p>Missing appointment information. Please restart the booking process.</p>
          <button onclick="window.location.href='index.html'">Start Over</button>
        `;
        return;
      }
  
      confirmContainer.innerHTML = `
        <div class="confirm-fade">
          <h2>Your Appointment is Confirmed!</h2>
          <p><strong>Doctor:</strong> ${doctor.name}</p>
          <p><strong>Specialty:</strong> ${doctor.specialty}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <hr>
          <p>You will receive a confirmation email shortly.</p>
        </div>
      `;
    }
  });
  