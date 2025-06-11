// js file

// Get the form elements
const form = document.getElementById("form");

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const countryInput = document.getElementById("country");
const countryError = document.getElementById("countryError");

const postalCodeInput = document.getElementById("postalCode");
const postalCodeError = document.getElementById("postalCodeError");

const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// Validation handler
function validateField(input, error) {
  if (input.id === "confirmPassword" && input.value !== passwordInput.value) {
    error.textContent = "Passwords don't match.";
    error.classList.add("active");
    return;
  }

  if (input.checkValidity()) {
    error.textContent = "";
    error.classList.remove("active");
  } else {
    // check for custom validity message first
    if (input.validationMessage) {
      error.textContent = input.validationMessage;
      error.classList.add("active");
    } else {
      showError(input, error);
    }
  }
}

// Add listeners
// check every INPUT inside array for convinience
[
  emailInput,
  countryInput,
  passwordInput,
  confirmPasswordInput,
  postalCodeInput,
].forEach((input) => {
  // check every input inside array for convinience

  // selects the appropriate error element based on the input's id
  const error = document.getElementById(`${input.id}Error`);

  // add event listeners for input and blur events
  // live validate
  input.addEventListener("input", () => validateField(input, error));
});

// submit event handler
form.addEventListener("submit", (e) => {
  let hasErrors = false;

  [
    emailInput,
    countryInput,
    passwordInput,
    confirmPasswordInput,
    postalCodeInput,
  ].forEach((input) => {
    const error = document.getElementById(`${input.id}Error`);
    validateField(input, error);
    if (!input.checkValidity()) {
      hasErrors = true;
    }
  });

  if (hasErrors) {
    e.preventDefault();
    alert("Please fix errors before submitting 😊");
  } else {
    e.preventDefault(); // Prevent actual form submission for demo purposes
    alert("🖐 High Five! Form submitted!");
  }
});

function showError(inputElement, errorElement) {
  if (inputElement.validity.valueMissing) {
    // If empty
    errorElement.textContent = `Please enter your ${inputElement.name}.`;
  } else if (inputElement.validity.typeMismatch) {
    // If it's not an email address,
    errorElement.textContent = `Please enter a valid ${inputElement.name}.`;
  } else if (inputElement.validity.tooShort) {
    // If the value is too short,
    errorElement.textContent = `${inputElement.name} is too short.`;
  } else if (inputElement.validity.tooLong) {
    errorElement.textContent = `${inputElement.name} is too long. Maximum is ${inputElement.maxLength} characters.`;
  } else if (
    inputElement.id === "confirmPassword" &&
    inputElement.value !== passwordInput.value
  ) {
    // If the password confirmation does not match the password
    errorElement.textContent = "Passwords don't match.";
  }

  // Add the `active` class
  errorElement.classList.add("active");
}

const constraints = {
  ch: [
    "^(CH-)?\\d{4}$",
    "Swiss postal codes must have exactly 4 digits: e.g. CH-1950 or 1950",
  ],
  fr: [
    "^(F-)?\\d{5}$",
    "French postal codes must have exactly 5 digits: e.g. F-75012 or 75012",
  ],
  de: [
    "^(D-)?\\d{5}$",
    "German postal codes must have exactly 5 digits: e.g. D-12345 or 12345",
  ],
  nl: [
    "^(NL-)?\\d{4}\\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$",
    "Dutch postal codes must be 4 digits + 2 letters (not SA, SD, SS)",
  ],
};

function checkPostalCode() {
  // Check the postal code based on the selected country

  const country = countryInput.value;
  const constraint = new RegExp(constraints[country]?.[0] || ".*");
  const message = constraints[country]?.[1] || "";

  if (constraint.test(postalCodeInput.value)) {
    postalCodeInput.setCustomValidity("");
  } else {
    postalCodeInput.setCustomValidity(message);
  }

  // validate the field
  validateField(postalCodeInput, postalCodeError);
}

countryInput.addEventListener("change", checkPostalCode);
postalCodeInput.addEventListener("input", checkPostalCode);
