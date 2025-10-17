// === FORM EXPERIENCE ====================================================================
const addBtn = document.getElementById('addExperienceBtn');
const form = document.getElementById('experienceForm');

if (addBtn && form) {
  addBtn.addEventListener('click', () => {
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        addBtn.textContent = 'x';
    } else {
        form.style.display = 'none';
        addBtn.textContent = '+';
    }
  });
}

// FORM MY PROJECT =========================================================================
const addProjectBtn = document.getElementById('addProjectBtn');
const projectForm = document.getElementById('projectForm');

if (addProjectBtn && projectForm) {
  addProjectBtn.addEventListener('click', () => {
    if (projectForm.style.display === 'none' || projectForm.style.display === '') {
        projectForm.style.display = 'block';
        addProjectBtn.textContent = 'x';
    } else {
        projectForm.style.display = 'none';
        addProjectBtn.textContent = '+';
    }
  });
}
