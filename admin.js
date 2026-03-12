function login() {
  const user = document.getElementById("loginUsername").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  const error = document.getElementById("loginError");

  if (user === "admin123" && pass === "admin@123") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  } else {
    error.innerText = "Invalid Username or Password";
  }
}

/* PAGE LOAD → ALWAYS SHOW LOGIN */
window.onload = () => {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("adminPanel").style.display = "none";
};

/* ===============================   
   GLOBAL VARIABLES
================================ */
let editingRow = null;
const BASE_URL = `https://mentoresolutions-java-backend.vercel.app`;

/* ===============================
   SIDEBAR TOGGLE (MOBILE)
================================ */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}
/* ===============================
   PANEL SWITCHING
================================ */
/* ===============================
   PANEL SWITCHING (FIXED)
================================ */
function showPanel(id, el) {
  // 🔒 active section save (IMPORTANT)
  localStorage.setItem("activePanel", id);
  // hide all panels
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.remove("show");
  });
  // show selected panel
  const activePanel = document.getElementById(id);
  if (activePanel) activePanel.classList.add("show");
  // sidebar active state
  document.querySelectorAll(".sidebar li").forEach(li =>
    li.classList.remove("active")
  );
  if (el) el.classList.add("active");
  // mobile sidebar close
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("open");
  }
}

/* ===============================
   ADD / UPDATE ROW
================================ */
function addRow(tableId, inputIds) {
  const values = inputIds.map(id => document.getElementById(id).value.trim());
  if (values.some(v => v === "")) {
    alert("Please fill all fields");
    return;
  }
  const table = document.getElementById(tableId);
  if (editingRow) {
    values.forEach((val, i) => editingRow.cells[i].innerText = val);
    editingRow = null;
  } else {
    const row = table.insertRow();
    row.innerHTML = `
      ${values.map(v => `<td>${v}</td>`).join("")}
      <td>
        <button class="action-btn edit" onclick="editRow(this)">Edit</button>
        <button class="action-btn delete" onclick="deleteRow(this)">Delete</button>
      </td>
    `;
  }
  inputIds.forEach(id => document.getElementById(id).value = "");
}
/* ===============================
   EDIT ROW
================================ */
function editRow(btn) {
  editingRow = btn.parentElement.parentElement;
  const inputs = document.querySelectorAll(".panel.show input");
  [...editingRow.cells]
    .slice(0, inputs.length)
    .forEach((cell, i) => inputs[i].value = cell.innerText);
}

// ===============================
// certificate Section Admin JS
// ===============================

(() => {
    const API_URL = `${BASE_URL}/api/certificates`;

    document.addEventListener("DOMContentLoaded", () => {
        const addBtn = document.getElementById("addCertBtn");
        const imageInput = document.getElementById("certImage");
        const certificateTable = document.getElementById("certificateTable");

        if (!addBtn) return;

        // --- 1. DISPLAY LOGIC ---
        async function loadCertificates() {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();

                if (!Array.isArray(data)) return;

                certificateTable.innerHTML = ""; 

                data.forEach(cert => {
                    const row = document.createElement("tr");
                    
                    // HTML structure madhe badal na karta fakt data insert karne
                    row.innerHTML = `
                        <td>
                            <img src="${cert.image}" alt="Certificate" style="width: 100px; height: auto; border-radius: 4px;">
                        </td>
                        <td>
                            <button type="button" class="delete-btn" onclick="deleteCert(${cert.id})">Delete</button>
                        </td>
                    `;
                    certificateTable.appendChild(row);
                });
            } catch (err) {
                console.error("Data load karnyaat adthala:", err);
            }
        }

        // --- 2. DELETE LOGIC ---
        // Global function banavli aahe jya mule HTML madhun 'onclick' kaam karel
        window.deleteCert = async (id) => {
            if (!confirm("Khatri aahe? Certificate kaamche nighun jail!")) return;

            try {
                const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                if (res.ok) {
                    loadCertificates(); 
                } else {
                    const errorData = await res.json();
                    alert("Delete karta aale nahi: " + errorData.error);
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Server error mule delete jhale nahi.");
            }
        };

        // --- 3. CREATE LOGIC ---
        addBtn.onclick = async (e) => {
            e.preventDefault();
            const file = imageInput.files[0];

            if (!file) {
                alert("Krupaya ek image select kara!");
                return;
            }

            const formData = new FormData();
            formData.append("image", file); 

            try {
                addBtn.disabled = true;
                addBtn.innerText = "Saving...";

                const response = await fetch(API_URL, {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Certificate successfully save jhale!");
                    imageInput.value = ""; 
                    loadCertificates(); 
                } else {
                    alert("Error: " + (result.error || "Upload fail jhale"));
                }
            } catch (err) {
                console.error("Fetch error:", err);
                alert("Backend connect hot nahiye!");
            } finally {
                addBtn.disabled = false;
                addBtn.innerText = "Save Certificate";
            }
        };

        loadCertificates();
    });
})();


// ------------------------------
// Placement Section Admin JS
// ------------------------------

const API_URL = `${BASE_URL}/api/placements`; 

document.addEventListener("DOMContentLoaded", () => {
    fetchPlacements();

    const addBtn = document.getElementById("addBtn");
    if(addBtn) {
        addBtn.addEventListener("click", addPlacement);
    }
});

// 1. सर्व Placements मिळवून लिस्ट दाखवणे
async function fetchPlacements() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const container = document.getElementById("placementsContainer");
        container.innerHTML = ""; 

        data.forEach(item => {
            const row = document.createElement("div");
            row.className = "placement-item";
            row.id = `row-${item.id}`; 
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span class="data-field">${item.name}</span>
                <span class="data-field">${item.role}</span>
                <span class="data-field">${item.company}</span>
                <span class="data-field">${item.pkg}</span>
                <div class="action-buttons">
                    <button onclick="editPlacement('${item.id}')" class="edit-btn">Edit</button>
                    <button onclick="deletePlacement('${item.id}')" class="delete-btn">Delete</button>
                </div>
            `;
            container.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching placements:", error);
    }
}

// 2. EDIT MODE (ओळीत बदल करणे) - window object ला जोडले आहे जेणेकरून HTML ला सापडेल
window.editPlacement = function(id) {
    const row = document.getElementById(`row-${id}`);
    if (!row) return;

    // span मधून जुना डेटा काढा
    const fields = row.querySelectorAll('.data-field');
    const name = fields[0].innerText;
    const role = fields[1].innerText;
    const company = fields[2].innerText;
    const pkg = fields[3].innerText;
    const currentImg = row.querySelector('img').src;

    // Row ला Input मध्ये बदला
    row.innerHTML = `
        <img src="${currentImg}" style="width: 50px; border-radius: 50%; opacity: 0.5;">
        <input type="text" id="edit-name-${id}" value="${name}" class="inline-edit-input">
        <input type="text" id="edit-role-${id}" value="${role}" class="inline-edit-input">
        <input type="text" id="edit-company-${id}" value="${company}" class="inline-edit-input">
        <input type="text" id="edit-pkg-${id}" value="${pkg}" class="inline-edit-input">
        <div class="action-buttons">
            <button onclick="savePlacement('${id}')" class="save-btn">Save</button>
            <button onclick="fetchPlacements()" class="cancel-btn">Cancel</button>
        </div>
    `;
};

// 3. SAVE UPDATED DATA
window.savePlacement = async function(id) {
    const name = document.getElementById(`edit-name-${id}`).value;
    const role = document.getElementById(`edit-role-${id}`).value;
    const company = document.getElementById(`edit-company-${id}`).value;
    const pkg = document.getElementById(`edit-pkg-${id}`).value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, role, company, pkg })
        });

        if (response.ok) {
            alert("डेटा यशस्वीरित्या अपडेट झाला!");
            fetchPlacements();
        } else {
            alert("अपडेट करताना त्रुटी आली.");
        }
    } catch (error) {
        console.error("Save error:", error);
    }
};

// 4. ADD NEW
async function addPlacement() {
    const name = document.getElementById("studentName").value;
    const company = document.getElementById("studentCompany").value;
    const role = document.getElementById("studentRole").value;
    const pkg = document.getElementById("studentPackage").value;
    const imageFile = document.getElementById("studentImage").files[0];

    if (!name || !company || !role || !pkg || !imageFile) {
        alert("सर्व माहिती भरा!");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("company", company);
    formData.append("role", role);
    formData.append("pkg", pkg);
    formData.append("image", imageFile);

    try {
        const response = await fetch(API_URL, { method: "POST", body: formData });
        if (response.ok) {
            alert("Add यशस्वी!");
            clearInputs();
            fetchPlacements();
        }
    } catch (error) {
        console.error("Add error:", error);
    }
}

// 5. DELETE
window.deletePlacement = async function(id) {
    if (!confirm("Delete करायचे आहे का?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) fetchPlacements();
    } catch (error) {
        console.error("Delete error:", error);
    }
};

function clearInputs() {
    document.querySelectorAll(".form input").forEach(input => input.value = "");
}


// ============================
// JAVA COURSE JS (Vercel Ready)
// ============================
// १. API URL बरोबर असल्याची खात्री करा
const COURSE_API = `${BASE_URL}/api/java-courses`; 

async function updateUpcomingBatch() {
  try {
    // Cache टाळण्यासाठी fetch मध्ये query parameter टाकला आहे
    const res = await fetch(`${COURSE_API}?t=${new Date().getTime()}`);
    const courses = await res.json();
    
    console.log("Dattbase कडून आलेला डेटा:", courses);

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
        console.warn("No course data available.");
        return;
    }

    // शेवटचा (Latest) कोर्स मिळवणे
    const latest = courses[courses.length - 1];
    
    const courseInfo = document.querySelector("#courses .course-info");
    
    if (courseInfo && latest) {
      const spans = courseInfo.querySelectorAll("span");
      
      // युझर पॅनेलमध्ये ३ स्पेन्स असल्याची खात्री करा
      if (spans.length >= 3) {
        
        // १. Start Date (Property: start_date)
        const startDate = latest.start_date ? formatDisplayDate(latest.start_date) : "TBA";
        spans[0].innerHTML = `📅 New Batch Starting On : ${startDate}`;
        
        // २. Total Hours (Property: hours - जुन्या कोडमध्ये 'duration' असू शकते, ते 'hours' करा)
        const hoursText = latest.hours ? latest.hours : "120 Hours";
        spans[1].innerHTML = `⏰ Total Hours: ${hoursText}`;

        // ३. Batch Time (Property: batch_time)
        const batchTime = latest.batch_time ? latest.batch_time : "TBA";
        spans[2].innerHTML = `🕒 Batch Time: ${batchTime}`;
        
        console.log("User Panel successfully updated!");
      } else {
        console.error("User Panel मध्ये ३ spans सापडले नाहीत. कृपया HTML तपासा.");
      }
    }
  } catch (err) {
    console.error("User Panel fetch error:", err);
  }
}


// ===============================
// TRAINING SECTION ADMIN JS
// ===============================
const TRAINING_API = `${BASE_URL}/api/trainings`;
let editingTrainingId = null;

// ================= 1. DATA LOAD KARNE =================
async function loadTrainings() {
    try {
        const res = await fetch(TRAINING_API);
        const data = await res.json();
        const container = document.getElementById("trainingTable");
        
        if (!container) return;
        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = `<p style="text-align:center; width:100%; padding:20px;">No trainings found.</p>`;
            return;
        }

        data.forEach(t => {
            const card = document.createElement("div");
            card.className = "training-card";
            card.dataset.id = t.id;
            // Flexbox styling for alignment
            card.style = "display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: #fff; margin-bottom: 5px;";
            
            card.innerHTML = `
    <div data-label="Icon" class="training-icon"><i class="${t.icon}"></i></div>
    <div data-label="Name" class="training-title">${t.name}</div>
    <div class="actions">
        <button class="edit" onclick="editTraining(this)">Edit</button>
        <button class="delete" onclick="deleteTraining(this)">Delete</button>
    </div>
`;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Load error:", err);
    }
}

// ================= 2. ADD / UPDATE TRAINING =================
async function handleTrainingSubmit() {
    const iconInput = document.getElementById("t1");
    const nameInput = document.getElementById("t2");
    const submitBtn = document.getElementById("addBtnTraining");

    const icon = iconInput.value.trim();
    const name = nameInput.value.trim();

    if (!icon || !name) {
        alert("Please enter both Icon class (e.g., fa-solid fa-cloud) and Name!");
        return;
    }

    const payload = { icon, name };

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Saving...";

        let res;
        if (editingTrainingId) {
            // UPDATE Logic
            res = await fetch(`${TRAINING_API}/${editingTrainingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            editingTrainingId = null;
        } else {
            // ADD Logic
            res = await fetch(TRAINING_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }

        if (res.ok) {
            iconInput.value = "";
            nameInput.value = "";
            submitBtn.innerText = "Add Training";
            loadTrainings(); // Refresh the list
        } else {
            alert("Error while saving to database.");
        }
    } catch (err) {
        console.error("Submit error:", err);
        alert("Server connection failed!");
    } finally {
        submitBtn.disabled = false;
        if(!editingTrainingId) submitBtn.innerText = "Add Training";
    }
}

// ================= 3. EDIT LOGIC =================
function editTraining(btn) {
    const card = btn.closest(".training-card");
    editingTrainingId = card.dataset.id;

    // Icon class nit pick karne
    const currentIconClass = card.querySelector(".training-icon i").className;
    const currentName = card.querySelector(".training-title").innerText;

    document.getElementById("t1").value = currentIconClass;
    document.getElementById("t2").value = currentName;
    
    const addBtn = document.getElementById("addBtnTraining");
    addBtn.innerText = "Update Training";
    document.getElementById("t1").focus();
}

// ================= 4. DELETE LOGIC =================
async function deleteTraining(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
        const res = await fetch(`${TRAINING_API}/${id}`, { method: "DELETE" });
        if (res.ok) loadTrainings();
    } catch (err) {
        console.error("Delete error:", err);
    }
}

// ================= INITIALIZE =================
document.addEventListener("DOMContentLoaded", () => {
    loadTrainings();
    
    // Add Event Listener to the button
    const addBtn = document.getElementById("addBtnTraining");
    if(addBtn) {
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            handleTrainingSubmit();
        });
    }
});

// ===============================
// SINGLE CONTACT ADMIN JS
// ===============================
// ===============================
// SINGLE CONTACT ADMIN JS
// ===============================
(() => {
  // BASE_URL chi khaatri kara (Local sathi http://localhost:5000)
  const CONTACT_API = `${BASE_URL}/api/contacts`;
  let currentContactId = null; // Update sathi ID lagel

  document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("addBtnContact");
    if (!saveBtn) return;

    // ------------------------------
    // 1. LOAD & DISPLAY CONTACTS
    // ------------------------------
    async function loadContact() {
      try {
        const res = await fetch(CONTACT_API);
        const data = await res.json();
        const container = document.getElementById("contactTable");

        if (!container) return;
        container.innerHTML = ""; // Container clear kara

        if (data && data.length > 0) {
          // Apan pahila record inputs madhe bharu (Editing sathi)
          const c = data[0];
          currentContactId = c.id; 
          
          document.getElementById("m2").value = c.email || "";
          document.getElementById("m4").value = c.mobile || "";
          document.getElementById("m5").value = c.instagram || "";
          document.getElementById("m6").value = c.linkedin || "";
          
          saveBtn.innerText = "Update Contact";

          // Card Swarupat Frontend la dakhavne
          data.forEach(item => {
              const card = document.createElement("div");
              card.className = "contact-card-item"; // Tumcha CSS class
              card.style = "border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 8px; background: #f9f9f9;";
              card.innerHTML = `
                <p><strong>Email:</strong> ${item.email}</p>
                <p><strong>Mobile:</strong> ${item.mobile}</p>
                <p><strong>Insta:</strong> ${item.instagram || 'N/A'}</p>
                <p><strong>LinkedIn:</strong> ${item.linkedin || 'N/A'}</p>
              `;
              container.appendChild(card);
          });
        }
      } catch (err) {
        console.error("Error loading contact:", err);
      }
    }

    // ------------------------------
    // 2. SAVE / UPDATE CONTACT
    // ------------------------------
    saveBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("m2").value.trim();
      const mobile = document.getElementById("m4").value.trim();
      const instagram = document.getElementById("m5").value.trim();
      const linkedin = document.getElementById("m6").value.trim();

      if (!email || !mobile) {
        alert("Email and Mobile are required!");
        return;
      }

      const payload = { email, mobile, instagram, linkedin };

      try {
        saveBtn.disabled = true;
        saveBtn.innerText = "Saving...";

        let res;
        if (currentContactId) {
          // Jar ID asel tar UPDATE (PUT) kara
          res = await fetch(`${CONTACT_API}/${currentContactId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } else {
          // Jar ID nasel tar NEW (POST) kara
          res = await fetch(CONTACT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        }

        if (res.ok) {
          alert("Contact information updated successfully ✅");
          loadContact(); // List refresh kara
        } else {
          const errData = await res.json();
          alert("Error: " + (errData.error || "Failed to save"));
        }
      } catch (err) {
        console.error("Error saving contact:", err);
        alert("Server is not responding.");
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = currentContactId ? "Update Contact" : "Add";
      }
    });

    // INIT
    loadContact();
  });
})();

/* ===============================
   RESTORE LAST ACTIVE PANEL
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const lastPanel = localStorage.getItem("activePanel") || "dashboard";
  document.querySelectorAll(".panel").forEach(panel =>
    panel.classList.remove("show")
  );
  const panel = document.getElementById(lastPanel);
  if (panel) panel.classList.add("show");
});

// ===============================
// LOGOUT FUNCTION (FINAL)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to logout?")) return;

    // Clear all login/session data
    localStorage.clear();
    sessionStorage.clear();

    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    // Redirect out of admin panel
    window.location.replace("https://mentoresolutions-javabroucher.vercel.app"); // change if needed
  });
});

