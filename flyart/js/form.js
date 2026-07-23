export function initForm() {
  const form = document.querySelector('.lead-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn?.textContent || 'Get free estimate';

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const phone = form.querySelector('#phone')?.value.trim();
    const city = form.querySelector('#city')?.value.trim();

    let hasError = false;
    form.querySelectorAll('.form-error').forEach((el) => el.remove());

    if (!name) {
      showError(form.querySelector('#name'), 'Please enter your name');
      hasError = true;
    }

    if (!phone || !/^[\d\s\-+()]{10,}$/.test(phone)) {
      showError(form.querySelector('#phone'), 'Please enter a valid phone number');
      hasError = true;
    }

    if (!city) {
      showError(form.querySelector('#city'), 'Please enter your city');
      hasError = true;
    }

    if (hasError) return;

    if (submitBtn) {
      submitBtn.textContent = 'Sent!';
      submitBtn.disabled = true;
    }

    showSuccess(form);

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
      form.querySelector('.form-success')?.remove();
    }, 4000);
  });
}

function showError(input, message) {
  if (!input) return;
  const error = document.createElement('span');
  error.className = 'form-error';
  error.textContent = message;
  error.style.color = '#c0392b';
  error.style.fontSize = '0.875rem';
  error.style.display = 'block';
  error.style.marginTop = '0.25rem';
  input.parentNode.appendChild(error);
  input.setAttribute('aria-invalid', 'true');
}

function showSuccess(form) {
  const success = document.createElement('div');
  success.className = 'form-success';
  success.style.padding = '1rem';
  success.style.backgroundColor = '#d4edda';
  success.style.color = '#155724';
  success.style.borderRadius = '0.5rem';
  success.style.marginTop = '1rem';
  success.innerHTML = '<strong>Thank you!</strong> Our design consultant will reach out to you shortly.';
  form.appendChild(success);
}
