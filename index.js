'use strict';

const arrOfHeaderTabs = [
  ...document.querySelectorAll('.generator__header-tab'),
];
const arrOfSections = [...document.querySelectorAll('.generator__section')];

const passOutput = document.querySelector('.generator__output.pass');
const passGenerateBtn = document.querySelector('.generator__btn.pass');
const passCopyBtn = document.querySelector('.generator__btn.copy-pass');
const lengthPass = document.querySelector('#length-password');
const checkboxList = document.querySelector('.generator__options-list');
const arrCheckboxes = [...document.querySelectorAll('input[type=checkbox]')];

const phraseOutput = document.querySelector('.generator__output.phrase');
const phraseGenerateBtn = document.querySelector('.generator__btn.phrase');
const phraseCopyBtn = document.querySelector('.generator__btn.copy-phrase');
const lengthPhrase = document.querySelector('#length-phrase');

const numbers = [...Array(10).keys()].map((i) => String.fromCharCode(i + 48));
const lowerLetters = [...Array(26).keys()].map((i) =>
  String.fromCharCode(i + 97)
);
const upperLetters = [...Array(26).keys()].map((i) =>
  String.fromCharCode(i + 65)
);
const specSymbols = [...Array(15).keys()]
  .map((i) => String.fromCharCode(i + 33))
  .concat([...Array(7).keys()].map((i) => String.fromCharCode(i + 58)))
  .concat([...Array(6).keys()].map((i) => String.fromCharCode(i + 91)))
  .concat([...Array(4).keys()].map((i) => String.fromCharCode(i + 123)));

const arrCharsArrays = [numbers, lowerLetters, upperLetters, specSymbols];

arrOfHeaderTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    arrOfHeaderTabs.map((changeableTab) => {
      const targetIndex = arrOfHeaderTabs.indexOf(changeableTab);
      const isTargetTab = targetIndex === arrOfHeaderTabs.indexOf(tab);

      if (isTargetTab) {
        arrOfSections[targetIndex].classList.remove('hidden');
      } else {
        arrOfSections[targetIndex].classList.add('hidden');
      }
    });
  });
});

passGenerateBtn.onclick = () => {
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

    const password = generatePass(arrSelectedArrays);

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

function generatePass(arrSelectedArrays) {
  const arrOfChars = [];

  for (let i = 0; i < lengthPass.value; i += 1) {
    const randomArrNum = getRandomInt(arrSelectedArrays.length);
    const randomArr = arrSelectedArrays[randomArrNum];
    const randomNumFromArr = getRandomInt(randomArr.length);

    arrOfChars.push(randomArr[randomNumFromArr]);
  }

  return arrOfChars.join('');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

passCopyBtn.onclick = () => {
  copyToClipboard(passOutput.value);
};

function copyToClipboard(str) {
  const el = document.createElement('textarea');

  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);

  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
}

phraseGenerateBtn.onclick = () => {
  phraseOutput.removeAttribute('disabled');
  phraseOutput.classList.remove('void');

  generatePassPhrase('./english.txt');
};

function generatePassPhrase(file) {
  const rawFile = new XMLHttpRequest();
  const successStatus = 200;
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
  const successFirefoxStatus = 0;

  rawFile.open('GET', file, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === XMLHttpRequest.DONE) {
      if (
        rawFile.status === successStatus ||
        rawFile.status === successFirefoxStatus
      ) {
        const phrase = returnPassPhrase({
          words: rawFile.responseText.split('\n'),
          phraseLength: lengthPhrase.value,
        });

        phraseOutput.value = phrase;
      }
    }
  };
  rawFile.send(null);
}

function returnPassPhrase(params) {
  const { words, phraseLength = 4 } = params;

  if (words) {
    const arrOfWords = [];

    for (let i = 0; i < phraseLength; i += 1) {
      const randomWordIndex = getRandomInt(words.length);

      arrOfWords.push(words[randomWordIndex]);
    }

    return arrOfWords.join(' ');
  }

  // TODO: make a better UI response
  console.error('Something wrong with phrase generating');
}

phraseCopyBtn.onclick = () => {
  copyToClipboard(phraseOutput.value);
};
