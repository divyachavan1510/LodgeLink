(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        console.error("❌ Form submission blocked: Please fill all required fields correctly.");
      } else {
        console.log("✅ Form submitted successfully!");
      }

      form.classList.add('was-validated');
    }, false);
  });
})();
