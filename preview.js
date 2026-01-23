/* ------------------ Helpers ------------------ */
function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getLS(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}
function setLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

/* ------------------ Load Resume Data ------------------ */
function loadPersonalInfoTemplate() {
  const p = getLS("personalInfo", {});
  const full = (p.name || "").trim();
  if (full) {
    const parts = full.split(/\s+/);
    const first = parts.shift();
    const last = parts.join(" ");
    document.getElementById("nameDisplay").innerHTML =
      `${escapeHtml(first)} <span class="light">${escapeHtml(last)}</span>`;
  }

  document.getElementById("titleDisplay").textContent =
    p.title ? p.title.toUpperCase() : "YOUR TITLE";

  document.getElementById("profileDisplay").textContent =
    p.summary || "Add a summary from Personal Info.";
  
  // CONTACT
  const contactEl = document.getElementById("contactDisplay");
  let contactHtml = "";

  ["phone", "email", "address", "linkedin"].forEach(field => {
    if (p[field]) {
      contactHtml += `<div class="contact-item">${escapeHtml(p[field])}</div>`;
    }
  });

  contactEl.innerHTML = contactHtml || `<div class="muted">No contact information saved.</div>`;
}

function loadEducationTemplate() {
  const e = getLS("educationInfo", null);
  const container = document.getElementById("educationDisplay");
  if (!e) {
    container.innerHTML = `<div class="muted">No education saved.</div>`;
    return;
  }

  const arr = Array.isArray(e) ? e : [e];
  let html = "";

  arr.forEach(item => {
    html += `
      <div class="edu-item">
        ${item.year ? `<div class="period">${escapeHtml(item.year)}</div>` : ""}
        ${item.institute ? `<div class="school">${escapeHtml(item.institute.toUpperCase())}</div>` : ""}
        ${item.degree ? `<div class="position">${escapeHtml(item.degree)}</div>` : ""}
        ${item.percentage ? `<div class="position">Result: ${escapeHtml(item.percentage)}</div>` : ""}
      </div>`;
  });

  container.innerHTML = html;
}

function loadExperienceTemplate() {
  const ex = getLS("expInfo", null);
  const container = document.getElementById("experienceDisplay");

  if (!ex) {
    container.innerHTML = `<div class="muted">No experience saved.</div>`;
    return;
  }

  const arr = Array.isArray(ex) ? ex : [ex];
  let html = "";

  arr.forEach(job => {
    const bullets = (job.responsibilities || "")
      .split("\n")
      .filter(b => b.trim())
      .map(b => `<li>${escapeHtml(b)}</li>`)
      .join("");

    html += `
    <div class="job">
      <div class="company-name">${escapeHtml(job.company)}</div>
      <div class="position">${escapeHtml(job.role || "")}</div>
      <div class="job-period">${escapeHtml(job.duration || "")}</div>
      <ul>${bullets}</ul>
    </div>`;
  });

  container.innerHTML = html;
}

function loadProjectsTemplate() {
  const p = getLS("projectsInfo", null);
  const container = document.getElementById("projectsDisplay");

  if (!p) {
    container.innerHTML = `<div class="muted">No projects added.</div>`;
    return;
  }

  const arr = Array.isArray(p) ? p : [p];
  let html = "";

  arr.forEach(pr => {
    html += `
    <div class="project-box">
      <h4>${escapeHtml(pr.name)}</h4>
      <p>${escapeHtml(pr.description || "")}</p>
      <p><strong>Tech:</strong> ${escapeHtml(pr.tech || "")}</p>
    </div>`;
  });

  container.innerHTML = html;
}

/* ------------------ AI Drawer Toggle ------------------ */
const aiFab = document.getElementById("aiFab");
const aiDrawer = document.getElementById("aiDrawer");
document.getElementById("closeDrawer").onclick = () => aiDrawer.classList.remove("visible");

aiFab.onclick = () => aiDrawer.classList.toggle("visible");

/* ------------------ AI Logic (Heuristic / Offline) ------------------ */
const aiOutput = document.getElementById("aiOutput");

function genSummary() {
  const p = getLS("personalInfo", {});
  const ex = getLS("expInfo", []);
  const proj = getLS("projectsInfo", []);

  const title = p.title || "professional";
  const experienceCount = Array.isArray(ex) ? ex.length : 1;
  const projCount = Array.isArray(proj) ? proj.length : 1;

  aiOutput.textContent =
    `A motivated ${title} with hands-on experience in ${experienceCount} role(s) and ${projCount} project(s). Skilled in modern tools and eager to contribute to impactful work.`;
}

function improveBullets() {
  const ex = getLS("expInfo", null);
  if (!ex) {
    aiOutput.textContent = "No experience found.";
    return;
  }

  const arr = Array.isArray(ex) ? ex : [ex];
  const improved = arr
    .map(j => (j.responsibilities || "")
      .split("\n")
      .map(b => b.trim())
      .filter(b => b)
      .map(b => `• Improved ${b.toLowerCase()}`)
      .join("\n"))
    .join("\n\n");

  aiOutput.textContent = improved || "No bullets to improve.";
}

function suggestSkills() {
  const ex = JSON.stringify(getLS("expInfo", {})).toLowerCase();
  const pr = JSON.stringify(getLS("projectsInfo", {})).toLowerCase();
  const text = ex + pr;

  const skills = [];

  if (text.includes("web")) skills.push("HTML", "CSS", "JavaScript");
  if (text.includes("java")) skills.push("Java", "OOP", "Spring Basics");
  if (text.includes("python")) skills.push("Python", "Scripting");
  if (text.includes("sql")) skills.push("SQL", "Database Design");

  aiOutput.textContent = skills.length
    ? skills.join(", ")
    : "Could not detect skills — add experience/project text for better suggestions.";
}

function autoTitle() {
  const p = getLS("projectsInfo", {});
  const txt = JSON.stringify(p).toLowerCase();

  if (txt.includes("website")) aiOutput.textContent = "Front-End Developer";
  else if (txt.includes("java")) aiOutput.textContent = "Java Developer";
  else if (txt.includes("python")) aiOutput.textContent = "Python Developer";
  else aiOutput.textContent = "Software Developer";
}

/* Attach AI Buttons */
document.getElementById("genSummaryBtn").onclick = genSummary;
document.getElementById("improveBulletsBtn").onclick = improveBullets;
document.getElementById("suggestSkillsBtn").onclick = suggestSkills;
document.getElementById("autoTitleBtn").onclick = autoTitle;

/* Apply AI Output */
document.getElementById("applyBtn").onclick = function () {
  const text = aiOutput.textContent.trim();
  if (!text) return;

  // Apply to summary by default
  const p = getLS("personalInfo", {});
  p.summary = text;
  setLS("personalInfo", p);

  loadPersonalInfoTemplate();
};

/* Copy AI Output */
document.getElementById("copyBtn").onclick = () => {
  navigator.clipboard.writeText(aiOutput.textContent);
};

/* Reset Resume */
document.getElementById("resetBtn").onclick = () => {
  loadPersonalInfoTemplate();
  loadEducationTemplate();
  loadExperienceTemplate();
  loadProjectsTemplate();
  aiOutput.textContent = "Reset complete.";
};

/* ------------------ INIT ------------------ */
loadPersonalInfoTemplate();
loadEducationTemplate();
loadExperienceTemplate();
loadProjectsTemplate();
