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


// =================== Оголошенні константи ==============================================================>
const form         = document.querySelector('.container .gen-form');
const input        = document.querySelector('.container .gen-form .input-wrapper input');
const inputLine    = document.querySelector('.container .gen-form .input-wrapper .line');
const iconClose    = document.querySelector('.container .gen-form .input-wrapper .icon.close');
const generate     = document.querySelector('.container .gen-form .generate');
const imageGrid    = document.querySelector('.container .result .image-grid');
const image        = document.querySelector('.container .result .image-grid span img');
const loading      = document.querySelector('.container .result .loading');
const spiner       = document.querySelector('.container .result .spiner');
const prev         = document.querySelector('.container .btns .btn.prev');
const next         = document.querySelector('.container .btns .btn.next');

// =================== Блок генерування і відображення зображень ==========================================>

const apiKey       = "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";
const maxImage     = 8 // максимальна кількість зображннь яка буде генеруватися
// функція для генерування зображень задопомогою штучного інтелекту
async function generateImage(input){
  generate.disabled     = true;
  imageGrid.innerHTML   = "";
  loading.style.display = 'block';
  spiner.style.display  = 'block';
  
  const imageUrls       = [];
  for (let i = 0; i < maxImage; ++i){
    const randomNumber = Math.floor(Math.random() * 999 + 1);
    const prompt       = `${input} ${randomNumber}`;
    const response     = await fetch(
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
  }

  loading.style.display = 'none';
  spiner.style.display  = 'none';
  generate.disabled     = false;
  imageGrid.addEventListener('mouseover', () => form.style.opacity = 0);
  imageGrid.addEventListener('mouseout',  () => form.style.opacity = 1);
  displayImages(imageUrls);   
}
// функція для відображення згенерованих зображень
function displayImages(imageUrls) {
  imageGrid.innerHTML = "";                                         // Очищаємо контейнер перед відображенням нових зображень
  imageUrls.forEach((imgUrl, i) => {
    const span         = document.createElement('span');            // Створюємо <span>
    span.style.setProperty('--i', `${i + 1}`);                      // Встановлюємо атрибут style
    imageGrid.appendChild(span);                                    // Додаємо <span> до контейнера imageGrid
  
    const img          = document.createElement('img');             // Створюємо <img>
    img.src            = imgUrl;                                    // Встановлюємо атрибут src
    img.alt            = `art-${i+1}`;                              // Встановлюєио атрибут alt
    img.onclick = () => downloadImage(imgUrl, i);                   // Додаємо обробник подій onclick (загрузка)
    span.appendChild(img);                                          // Додаємо <img> до <span>
  });
}

// =================== Блок керування =====================================================================>

// умова появи іконки закриття і лінії підкреслення(якщо рядок заповнений появляється)
input.addEventListener('input', function() {
  if (input.value.trim() !== '') {
      inputLine.style.transform       = 'scaleX(1)';
      inputLine.style.transformOrigin = 'left';
      iconClose.style.transform       = 'scale(1)';
  } else {
    iconClose.style.transform           = 'scale(0)';
    inputLine.style.transform           = 'scaleX(0)';
    inputLine.style.transformOrigin     = 'right';
  }
});
// очищаємо поле для введення "input" і зникнення лінії підкреслення при натисканні на іконку закриття
iconClose.addEventListener('click', () => {
  iconClose.style.transform           = 'scale(0)';
  inputLine.style.transform           = 'scaleX(0)';
  inputLine.style.transformOrigin     = 'right';
  input.value                         = '';
  imageGrid.innerHTML                 = "";
});
// запускаємо генератор зображень при нажиманні клавіші Enter в полі input
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();                                         // Зупиняємо (наприклад, форми не буде відправлена)
    const inputValue = input.value;
    generateImage(inputValue);
  }
});
// запускаємо генератор зображень при кліку на кнопку "Згенерувати"
generate.addEventListener('click', () => {
  const inputValue = input.value;
  generateImage(inputValue);
});
// перехід між згенерованими картинками вперед('next')/назад('prev')
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

// функція автоматичної загрузки при кліку на вибране зображення
// function downloadImage(imgUrl, imageNumber){
//   const link = document.createElement("a");
//   link.href  = imgUrl;
//   link.download = `image-${imageNumber +1}.jpg`;
//   link.click();  
// }





