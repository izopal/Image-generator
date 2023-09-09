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

// ================================================================================>

const apiKey            = "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";
const maxImage          = 8 // максимальна кількість зображннь яка буде генеруватися


const generate     = document.getElementById('generate');
const imageGrid    = document.querySelector('.image-grid');

function disableGenerateButton(){
  generate.disabled = true;
}
function enableGenerateButton(){
  generate.disabled = false;
}
function clearImageGrid(){
  imageGrid.innerHTML = "";
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

async function generateImage(input){
  disableGenerateButton();
  clearImageGrid();

  const loading         = document.querySelector('.loading');
  loading.style.display = 'block';

  const imageUrls       = [];
  for (let i = 0; i < maxImage; ++i){
    const randomNumber = getRandomNumber(1, 10000);
    const prompt = `${input} ${randomNumber}`;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      {
        headers: { 
          "Authorization": `Bearer ${apiKey}`, 
        },
        method: "POST",
        body: JSON.stringify({inputs: prompt}),
      }
    );

  const blob = await response.blob();
  const imgUrl = URL.createObjectURL(blob);
  imageUrls.push(imgUrl);

  const span         = document.createElement('span');            // Створюємо <span>
  span.style.setProperty('--i', `${i + 1}`);                      // Встановлюємо атрибут style
  imageGrid.appendChild(span);                                    // Додаємо <span> до контейнера imageGrid

  const img          = document.createElement('img');             // Створюємо <img>
  img.src            = imgUrl;                                    // Встановлюємо атрибут src
  img.alt            = `art-${i+1}`;                              // Встановлюєио атрибут alt
  img.onclick = () => downloadImage(imgUrl, i);                   // Додаємо обробник подій onclick (загрузка)
  span.appendChild(img);                                          // Додаємо <img> до <span>
  }

  loading.style.display = "none"
  enableGenerateButton();
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

// ================================================================================>
 
const prev = document.querySelector('.btn.prev');
const next = document.querySelector('.btn.next');

let degrees = 0;

prev.addEventListener('click', () => {
  degrees += 45;
  imageGrid.style = `transform: translate(-50%, -50%) 
                                perspective(1000px) 
                                rotateY(${degrees}deg) `;
})
next.addEventListener('click', () => {
  degrees -= 45;
  imageGrid.style = `transform: translate(-50%, -50%) 
                                perspective(1000px) 
                                rotateY(${degrees}deg) `;
})

