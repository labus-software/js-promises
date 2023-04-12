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

function renderCountry(data , className = ''){
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population/ 1000000).toFixed(
        1
      )} M people</p>  
      <p class="country__row"><span>🗣️</span>${data.languages}</p>
      <p class="country__row"><span>💰</span>${data.currencies}</p>
    </div>
  </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

// getCountry('serbia');
// getCountry('sweden');
// getCountry('japan');
// getCountry('india');


/////////////////////////////////
// PROMISES
/////////////////////////////////

// const getCountryData = (country) => {
//   // returns Promise
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//   // data we need is in body of response
//   // to read data we need to call .json() method on response object
//   // also async function which returns new Promise
//   .then(response => response.json()) 
//   // Note that block below also returns Promise ;)
//   .then(data =>{
//     renderCountry(data[0]) // here we consume data
//   });
// } 
  

///////////////////////////////////
// How Does Chaining PROMISES look
///////////////////////////////////

const getCountryData = (country) => {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then(response => response.json()) 
  .then(data =>{
    // console.log(data)
    // whole this block is actually a Promise
    renderCountry(data[0]);
    
    const neighbour = data[0].borders[1]; // check if country has neighbours and define variable
    
    if(!neighbour) return; // guard check
    
    // Neighbour country
    
    return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`); // we need to return Promise in order to chain
  }).then(response => response.json()).then(data => {//console.log(data[0]); 
    renderCountry(data[0], 'neighbour')}
)} 

getCountryData('norway');

// CHALENGE

// const whereAmI = function(lat, lon){ 
//   fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`)
//   	.then(response =>{
//       if(!response.ok) throw new Error(`Problem with geocoding ${response.status}`);
//       return response.json();
//     })
//   .then(data => {
//     // console.log('Log me here', data);
//     const {city, country} = data.address;
//     console.log(`You are in ${city}, ${country}`);

//     return fetch(`https://restcountries.com/v3.1/name/${country}`);
//   }).then(res => res.json()).then(data => renderCountry(data[0])).catch(error => console.error(error.message))
// }

// whereAmI(52.508, 13.381);
// whereAmI(25.508, 103.381);


/////////////////////////////
// Building A Simple Promise
/////////////////////////////

const lottery = new Promise((resolve, reject) => { // create Promise object
  // Promise object takes execution function with 2 args
  // execution f is immediately executed
  // args are resolve and reject
  console.log('lottery is drawing....');
  setTimeout(()=>{
  if(Math.random() >= 0.5){
    resolve('You win Lottery!')
    // message that will appear in case of resolved Promise
    // handled in .then() method
  }else{
    reject(new Error('Rejected'))
    // created Error object that will appear in case of rejected Promise
    // handled in .catch() method
  }
  }, 2000)
});

// here we CONSUME Promise
lottery.then(resolve => console.info(resolve)).catch(error => console.log(error));

//////////////////////////////
// Promisifying setTimeout
//////////////////////////////

// // Promisifying -> convert async behavior to Promise based
// const wait = (seconds) => {
//   return new Promise(resolve => setTimeout(resolve, seconds * 1000));
// }

// wait(2).then(() => {
//   console.log('I waited for 2 seconds')
//   return wait(1); // same as we had another fetch function we can chain on to it
//   // so we can escape callback hell
//   // same thing we did (with setTimeout callback hell/ pyramid of doom)
// }).then(() => console.log('I waited for 1 second'));

//////////////////////////////
// Promisifying is converting
// async behavior to promise
// based
//////////////////////////////

// const getPosition = function(){
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   })
// }
// getPosition().then(pos => console.log(pos))

////////////////////////////////
// Promisifying GEOLOCATION API
////////////////////////////////

const getPosition = function(){
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
}

const whereAmI = function(){
  getPosition().then(pos => {
    const {latitude: lat, longitude: lon} = pos.coords;
    return fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`)
  })
  	.then(response =>{
      if(!response.ok) throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
  .then(data => {
    console.log('Log me here', data);
    const {city, country} = data.address;
    console.log(`You are in ${city}, ${country}`);

    return fetch(`https://restcountries.com/v3.1/name/${country}`);
  }).then(res => res.json()).then(data => renderCountry(data[0])).catch(error => console.error(error.message))
}

btn.addEventListener('click', whereAmI);