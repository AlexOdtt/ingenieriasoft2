document.querySelector('#logout-btn').addEventListener('click', () => {
  // Eliminar la cookie de sesión
  document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = "/";
});

document.querySelector('.get-weather').addEventListener('submit', (e) => {
  e.preventDefault();

  const cityInput = document.getElementById('city');
  const countryInput = document.getElementById('country');

  const city = cityInput.value.trim();
  const country = countryInput.value.trim();

  if (city === '' || country === '') {
      showError('Debe completar todos los campos');
      return;
  }

  callAPI(city, country);
});

function callAPI(city, country){
  const apiId = 'c9d8d37a507665c97de6805f2a921f40';
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

  fetch(url)
      .then(data => {
          return data.json();
      })
      .then(dataJSON => {
          if (dataJSON.cod === '404') {
              showError('Ciudad no encontrada');
          } else {
              clearHTML();
              showWeather(dataJSON);
          }
      })
      .catch(error => {
          console.log(error);
      });
}

function showWeather(data){
  const {name, main:{ temp, temp_min, temp_max}, weather:[arr]} = data;
  
  const degrees = kelvinToCentigrade(temp);
  const min = kelvinToCentigrade(temp_min);
  const max = kelvinToCentigrade(temp_max);

  const content = document.createElement('div');
  content.innerHTML = `
      <h5>Clima en ${name}</h5>
      <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
      <h2>${degrees}°C</h2>
      <p>Max: ${max}°C</p>
      <p>Min: ${min}°C</p>
  `;

  document.querySelector('.result').appendChild(content);
}

function showError(message){
  const alert = document.createElement('p');
  alert.classList.add('alert-message');
  alert.innerHTML = message;

  document.querySelector('.get-weather').appendChild(alert);
  setTimeout(() => {
      alert.remove();
  }, 3000);
}

function kelvinToCentigrade(temp){
  return parseInt(temp - 273.15);
}

function clearHTML(){
  document.querySelector('.result').innerHTML = '';
}
