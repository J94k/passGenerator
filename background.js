'use strict';

const passOutput = document.querySelector('.generator__out-password');
const passBtn = document.querySelector('.generator__btn-pass');
const lengthPass = document.querySelector('#length-password');
const passLengthCounter = document.querySelector('#password-length-counter');
const checkboxList = document.querySelector('.generator__options-list');
const arrCheckboxes = [...document.querySelectorAll('input[type=checkbox]')];

const numbers = [...Array(10).keys()].map((i) => String.fromCharCode(i + 48));
const lowerLetters = [...Array(26).keys()].map((i) =>
  String.fromCharCode(i + 97)
);
const upperLetters = [...Array(26).keys()].map((i) =>
  String.fromCharCode(i + 65)
);
const specSimbols = [...Array(15).keys()]
  .map((i) => String.fromCharCode(i + 33))
  .concat([...Array(7).keys()].map((i) => String.fromCharCode(i + 58)))
  .concat([...Array(6).keys()].map((i) => String.fromCharCode(i + 91)))
  .concat([...Array(4).keys()].map((i) => String.fromCharCode(i + 123)));

const arrCharsArrays = [numbers, lowerLetters, upperLetters, specSimbols];

showLengthPassword();
lengthPass.onchange = () => showLengthPassword();

function showLengthPassword() {
  passLengthCounter.textContent = lengthPass.value;
}

passBtn.onclick = () => {
  passOutput.removeAttribute('disabled');
  passOutput.classList.remove('void');
  checkboxList.classList.remove('error');

  if (checksCheckboxes(arrCheckboxes)) {
    const arrSelectedArrays = [];

    for (let i = 0; i < arrCheckboxes.length; i += 1) {
      if (arrCheckboxes[i].checked) {
        arrSelectedArrays.push(arrCharsArrays[i]);
      }
    }

    const password = generatePassword(arrSelectedArrays);

    passOutput.value = password;
  } else {
    checkboxList.classList.add('error');
  }
};

function checksCheckboxes(arrCheckboxes) {
  let result = false;

  arrCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) result = true;
  });

  return result;
}

function generatePassword(arrSelectedArrays) {
  let resultStr = '';

  for (let i = 0; i < lengthPass.value; i += 1) {
    const randomArrNum = getRandomInt(arrSelectedArrays.length);
    const randomArr = arrSelectedArrays[randomArrNum];
    const randomNumFromArr = getRandomInt(randomArr.length);

    resultStr += randomArr[randomNumFromArr];
  }

  return resultStr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
