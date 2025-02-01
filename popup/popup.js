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

  async loadSettings() {
    chrome.storage.sync.get(
      ["upperCase", "specialCharacters", "numbers", "length"],
      (result) => {
        this.upperCase.checked = result.upperCase || false;
        this.specialCharacters.checked = result.specialCharacters || false;
        this.numbersCheckbox.checked = result.numbers || false;
        this.lengthInput.value = result.length || 25;
        this.lengthValue.textContent = this.lengthInput.value;
        this.generatePassword();
      }
    );
  }

  saveUpperCase() {
    chrome.storage.sync.set({ upperCase: this.upperCase.checked });
    this.generatePassword();
  }

  saveSpecialCharacters() {
    chrome.storage.sync.set({
      specialCharacters: this.specialCharacters.checked,
    });
    this.generatePassword();
  }

  saveNumbers() {
    chrome.storage.sync.set({ numbers: this.numbersCheckbox.checked });
    this.generatePassword();
  }

  copyPassword() {
    navigator.clipboard.writeText(this.password.textContent);
  }

  handleLengthInput() {
    this.lengthValue.textContent = this.lengthInput.value;
    chrome.storage.sync.set({ length: this.lengthInput.value });
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

    this.password.textContent = this.shuffleString(result);
  }
}

const passwordGenerator = new PasswordGenerator();
