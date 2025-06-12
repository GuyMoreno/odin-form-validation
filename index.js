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
  // firstly check the password confirmation
  if (input.id === "confirmPassword" && input.value !== passwordInput.value) {
    error.textContent = "Passwords don't match.";
    error.classList.add("active");

    // after checking the function gets out
    return;
  }

  // secondly use checkValidity built-in method that checks the html5 validation rules (like required, minlength, etc.)
  if (input.checkValidity()) {
    // if valid, remove the error message and clear the active class
    error.textContent = "";
    error.classList.remove("active");
  } else {
    // check if there is a custop built-in validation message
    // if there is, set the error text to that message
    if (input.validationMessage) {
      error.textContent = input.validationMessage;
      error.classList.add("active");

      // if there is no custom message, use the showError function
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
  // for example, if the input's id is "email",
  //  the error element will be "emailError"
  const error = document.getElementById(`${input.id}Error`);

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

    // check again despite the live validation
    validateField(input, error);

    // if the input is invalid, set hasErrors to true
    // this will be used to prevent the form submission
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

// A dictionary of regex patterns and messages for different countries
// This will be used to validate the postal codes based on the selected country
const constraints = {
  // the KEY is the country code,
  // the VALUE is an array with two elements:
  // 1. a regex pattern to validate the postal code
  // 2. a message to display if the postal code is invalid
  // the regex pattern is used to check the postal code format

  ch: [
    // (1) a regex pattern for Swiss postal codes
    "^(CH-)?\\d{4}$",

    // (2) a message to display if the postal code is invalid
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

  // Get the selected country from the country input
  const country = countryInput.value;

  // 
  const constraint = new RegExp(constraints[country]?.[0] || ".*");
  // Get the error message for the selected country or a default message
  const message = constraints[country]?.[1] || "";

  // constraints is an object with country codes as keys
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
