
const textElement = document.querySelector('*');                        // Отримуємо елемент, текст якого потрібно змінювати

// Функція для оновлення розміру тексту
function updateTextSize() {
  // Отримуємо розміри вікна браузера
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  // Встановлюємо розмір тексту відповідно до розмірів вікна
  const textSize = Math.min(windowWidth, windowHeight) * 0.01;         //  1% від мінімального розміру
  textElement.style.fontSize = textSize + 'px';                        // Застосовуємо розмір тексту до елементу
  
}

// Викликаємо функцію при завантаженні та зміні розмірів вікна
window.addEventListener('load', updateTextSize);
window.addEventListener('resize', updateTextSize);


const input     = document.querySelector('.container .gen-form .input-wrapper input');
const inputLine = document.querySelector('.container .gen-form .input-wrapper .line');
const iconClose = document.querySelector('.icon.close');


// функція умови появи іконки закриття і лінії підкреслення(якщо рядок заповнений появляється)
input.addEventListener('input', function() {
    if (input.value.trim() !== '') {
        inputLine.style.transform       = 'scaleX(1)';
        inputLine.style.transformOrigin = 'left';
        iconClose.style.transform       = 'scale(1)';
    } 
});
// очищаємо поле для введення "input" і зникнення лінії підкреслення при натисканні на іконку закриття
iconClose.addEventListener('click', () => {
  iconClose.style.transform       = 'scale(0)';
  inputLine.style.transform       = 'scaleX(0)';
  inputLine.style.transformOrigin = 'right';
  input.value                     = '';
  imageGrid.innerHTML             = "";
});

const generate          = document.getElementById('generate');
const imageGrid         = document.querySelector('.image-grid');

const apiKey            = "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";
const maxImage          = 4 // максимальна кількість зображннь яка буде генеруватися
let selectedImageNumber = null;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function disableGenerateButton(){
  generate.disabled = true;
}
function enableGenerateButton(){
  generate.disabled = false;
}
function clearImageGrid(){
  imageGrid.innerHTML = "";
}
async function generateImage(input){
  disableGenerateButton();
  clearImageGrid();

  const loading         = document.querySelector('.loading');
  loading.style.display = 'block';

  const imageUrls       = [];
  for (let i = 0; i < maxImage; ++i){
    const randomNumber = getRandomNumber(1, 1000);
    const prompt = `${input} ${randomNumber}`;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      {
        headers: { 
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${apiKey}`, 
        },
        method: "POST",
        body: JSON.stringify({inputs: prompt}),
      }
    );

  const blob = await response.blob();
  const imgUrl = URL.createObjectURL(blob);
  imageUrls.push(imgUrl);

  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = `art-$(i+1)`;
  img.onclick = () => downloadImage(imgUrl, i);
  imageGrid.appendChild(img);
  }

  loading.style.display = "none"
  enableGenerateButton();

  selectedImageNumber = null;
}

generate.addEventListener('click', () =>{
  const input = document.getElementById('user-prompt').value;
  generateImage(input);
});

function downloadImage(imgUrl, imageNumber){
  const link = document.createElement("a");
  link.href  = imgUrl;
  link.download = `image-${imageNumber +1}.jpg`;
  link.click();  

}

 
