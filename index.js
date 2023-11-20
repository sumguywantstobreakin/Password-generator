const passwordDisplay = document.querySelector('.password-display');
const passwordPlaceholder = document.querySelector('generated-password-placeholder');
const copiedTextNotif = document.querySelector('.copied-text');
const copyButton = document.querySelector('.copy-btn');

const passwordSettings = document.querySelector('.password-settings');
const charCount = document.querySelector('.slider-number');
const inputSlider = document.querySelector('#input-slider');

const checkBoxes = document.querySelectorAll('input[type=checkbox]');
const strengthDescription = document.querySelector('.strength-rating-text');
const strengthBars = document.querySelectorAll('.bar');

const Character_Sets = {
    uppercase: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26],
    lowercase: ['abcdefghijklmnopqrstuvwxyz', 26],
    numbers: ['1234567890', 10],
    symbols: ['!@#$%^&*()', 10]
}

var canCopy = false;
function sliderVal() {
    charCount.textContent = inputSlider.value;
}
function sliderValComp() {
    const min = inputSlider.min;
    const max = inputSlider.max;
    const val = inputSlider.value;

    const backgroundSize = ((val-min)/(max-min)) * 100 + '% +100%';
    inputSlider.style.backgroundSize = backgroundSize;

}
function handleSlider() {
    sliderVal();
    sliderValComp();
}

charCount.textContent = inputSlider.value;


const styleBars = ([...barElements], color) => {

    barElements.forEach(bar => {
        bar.style.backgroundColor = color;
        bar.style.border = color;
    })
}

const resetBarStyles = () => {
    strengthBars.forEach(bar => {
        bar.style.backgroundColor = 'transparent';
        bar.style.border = '2px solid hsl(252, 11%, 91%)';
    })
}

const styleMeter = (rating) => {
    const text = rating[0];
    const numBars = rating[1];
    const barsToFill = Array.from(strengthBars).slice(0, numBars);

    resetBarStyles();

    strengthDescription.textContent = text;

    switch(numBars) {
        case 1:
          return styleBars(barsToFill, 'hsl(0, 91%, 63%)');
        case 2:
          return styleBars(barsToFill, 'hsl(13, 95%, 66%)');
        case 3:
          return styleBars(barsToFill, 'hsl(42, 91%, 68%)');
        case 4:
          return styleBars(barsToFill, 'hsl(127, 100%, 82%');
        default:
          throw new Error('Invalid value for numBars');
      }
}

const calcStrength = (passwordLength, charPoolSize) => {
    const strength = passwordLength * Math.log2(charPoolSize);

    if (strength < 25) {
        return ['Too weak!', 1];
    } else if (strength >= 25 && strength < 50) {
        return ['Weak', 2];
    } else if (strength >= 50&& strength < 75 ) {
        return ['Medium', 3];
    } else {
        return ['Strong', 4];
    }
}

const generatePassword = (e) => {
    e.preventDefault();

    let generatedPassword = '';
    let includedSets = [];
    let charPool = 0;

    checkBoxes.forEach(box => {
        if(box.checked) {
            includedSets.push(Character_Sets[box.value][0])
            charPool += Character_Sets[box.value][1];
        }
    });

    if (includedSets) {
        for(i=0; i<inputSlider.value; i++) {

            const randSetIndex = Math.floor(Math.random() * includedSets.length);
            const randSet = includedSets[randSetIndex];

            const randCharIndex = Math.floor(Math.random() * randSet.length);
            const randChar = randSet[randCharIndex];
            generatedPassword += randChar;
        }
    }
    const strength = calcStrength(inputSlider.value, charPool);
    styleMeter(strength)
    passwordDisplay.textContent = generatedPassword;
    canCopy = true;
}

const validateInput = () => {

    if(Array.from(checkBoxes).every(box => box.checked === false)) {
        throw new Error('Make sure to check at least one box');
    }
}

const copyPassword = async () => {

  if (!passwordDisplay.textContent || copiedTextNotif.textContent) return;

  if (!canCopy) return;

await navigator.clipboard.writeText(passwordDisplay.textContent);
copiedTextNotif.textContent = 'Copied';

setTimeout(() => {
    copiedTextNotif.style.transition = 'all 1s';
    copiedTextNotif.style.opacity = 0;

    setTimeout(()=> {
        copiedTextNotif.style.removeProperty('opacity');
        copiedTextNotif.style.removeProperty('transition');
        copiedTextNotif.textContent = '';
    }, 1000 );
}, 1000);
}

copyButton.addEventListener('click', copyPassword);
passwordSettings.addEventListener('submit', generatePassword);
inputSlider.addEventListener('input', handleSlider);
