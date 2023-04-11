'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
///// XMLHtttpRequest
///////////////////////////////////////

function getCountry(country) {
  const request = new XMLHttpRequest();

  // .open(method, url);
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send(); // send request, and fetch data in background

  // we will wait data to load
  // when it's loaded
  // callback f is fired
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);

    renderCountry(data)
  });
}

function renderCountry(data){
  const html = `
    <article class="country">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population).toFixed(
        1
      )} people</p>  
      <p class="country__row"><span>🗣️</span>${data.languages}</p>
      <p class="country__row"><span>💰</span>${data.currencies}</p>
    </div>
  </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

getCountry('serbia');
getCountry('sweden');
getCountry('japan');
getCountry('india');


/////////////////////////////////
// PROMISES
/////////////////////////////////

const getCountryData = (country) => {
  // returns Promise
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  // data we need is in body of response
  // to read data we need to call .json() method on response object
  // also async function which returns new Promise
  .then(response => response.json()) 
  // Note that block below also returns Promise ;)
  .then(data =>{
    renderCountry(data[0]) // here we consume data
  });
} 
  
getCountryData('norway');

///////////////////////////////////
// How Does Chaining PROMISES look
///////////////////////////////////