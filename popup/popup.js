class PasswordGenerator {
  constructor() {
    this.lowercase = "abcdefghijklmnopqrstuvwxyz";
    this.uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.special = "@!$%&*";
    this.numbers = "0123456789";

    this.initDom();
    this.loadSettings();
  }

  initDom() {
    this.lengthValue = document.getElementById("lengthValue");
    this.lengthInput = document.getElementById("length");
    this.upperCase = document.getElementById("upperCase");
    this.specialCharacters = document.getElementById("special-characters");
    this.numbersCheckbox = document.getElementById("numbers");
    this.password = document.getElementById("password");
    this.copyIcon = document.getElementById("copy-icon");
    this.refreshIcon = document.getElementById("refresh-icon");

    this.lengthInput.addEventListener(
      "input",
      this.handleLengthInput.bind(this)
    );

    this.upperCase.addEventListener("change", this.saveUpperCase.bind(this));
    this.specialCharacters.addEventListener(
      "change",
      this.saveSpecialCharacters.bind(this)
    );
    this.numbersCheckbox.addEventListener(
      "change",
      this.saveNumbers.bind(this)
    );
    this.copyIcon.addEventListener("click", this.copyPassword.bind(this));
    this.refreshIcon.addEventListener(
      "click",
      this.generatePassword.bind(this)
    );
  }

  loadSettings() {
    this.upperCase.checked = localStorage.getItem("upperCase") === "true";
    this.specialCharacters.checked =
      localStorage.getItem("specialCharacters") === "true";
    this.numbersCheckbox.checked = localStorage.getItem("numbers") === "true";
    this.lengthInput.value = localStorage.getItem("length") || 25;
    this.lengthValue.textContent = this.lengthInput.value;
    this.generatePassword();
  }

  saveUpperCase() {
    localStorage.setItem("upperCase", this.upperCase.checked);
    this.generatePassword();
  }

  saveSpecialCharacters() {
    localStorage.setItem("specialCharacters", this.specialCharacters.checked);
    this.generatePassword();
  }

  saveNumbers() {
    localStorage.setItem("numbers", this.numbersCheckbox.checked);
    this.generatePassword();
  }

  copyPassword() {
    navigator.clipboard.writeText(this.password.textContent);
  }

  handleLengthInput() {
    this.lengthValue.textContent = this.lengthInput.value;
    localStorage.setItem("length", this.lengthInput.value);
    this.generatePassword();
  }

  getRandomChar(characters) {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  shuffleString(str) {
    return str
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  generatePassword() {
    const length = parseInt(this.lengthInput.value);
    let result = "";
    let allChars = "";

    if (this.upperCase.checked) {
      result += this.getRandomChar(this.uppercase);
      allChars += this.uppercase;
    }
    if (this.specialCharacters.checked) {
      result += this.getRandomChar(this.special);
      allChars += this.special;
    }
    if (this.numbersCheckbox.checked) {
      result += this.getRandomChar(this.numbers);
      allChars += this.numbers;
    }
    result += this.getRandomChar(this.lowercase);
    allChars += this.lowercase;

    const remainingLength = length - result.length;

    for (let i = 0; i < remainingLength; i++) {
      result += this.getRandomChar(allChars);
    }

    const finalPassword = this.shuffleString(result);
    this.password.textContent = finalPassword;
    this.updatePasswordStrength(finalPassword);
  }

  updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById("password-strength");

    const hasLength = password.length >= 12;
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[@!$%&*]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasSpecial) score++;
    if (hasNumber) score++;

    strengthIndicator.classList.remove(
      "strength-weak",
      "strength-moderate",
      "strength-strong"
    );

    if (score <= 2) {
      strengthIndicator.textContent = "Weak";
      strengthIndicator.classList.add("strength-weak");
    } else if (score === 3) {
      strengthIndicator.textContent = "Moderate";
      strengthIndicator.classList.add("strength-moderate");
    } else {
      strengthIndicator.textContent = "Strong";
      strengthIndicator.classList.add("strength-strong");
    }
  }
}

const passwordGenerator = new PasswordGenerator();
