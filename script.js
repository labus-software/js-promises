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

    renderCountry(data);
  });
}

function renderCountry(data, className = '') {
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} M people</p>  
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

const getCountryData = country => {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      // whole this block is actually a Promise
      renderCountry(data[0]);

      const neighbour = data[0].borders[1]; // check if country has neighbours and define variable

      if (!neighbour) return; // guard check

      // Neighbour country

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`); // we need to return Promise in order to chain
    })
    .then(response => response.json())
    .then(data => {
      //console.log(data[0]);
      renderCountry(data[0], 'neighbour');
    });
};

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

// const lottery = new Promise((resolve, reject) => {
//   // create Promise object
//   // Promise object takes execution function with 2 args
//   // execution f is immediately executed
//   // args are resolve and reject
//   console.log('lottery is drawing....');
//   setTimeout(() => {
//     if (Math.random() >= 0.5) {
//       resolve('You win Lottery!');
//       // message that will appear in case of resolved Promise
//       // handled in .then() method
//     } else {
//       reject(new Error('Rejected'));
//       // created Error object that will appear in case of rejected Promise
//       // handled in .catch() method
//     }
//   }, 2000);
// });

// // here we CONSUME Promise
// lottery
//   .then(resolve => console.info(resolve))
//   .catch(error => console.log(error));

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

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      return fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`);
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('Log me here', data);
      const { city, country } = data.address;
      console.log(`You are in ${city}, ${country}`);

      return fetch(`https://restcountries.com/v3.1/name/${country}`);
    })
    .then(res => res.json())
    .then(data => renderCountry(data[0]))
    .catch(error => console.error(error.message));
};

btn.addEventListener('click', whereAmI);

//////////////////////
// CHALENGE 2
//////////////////////

// const imgContainer = document.querySelector('.images');

// const wait = seconds => {
//   return new Promise(resolve => setTimeout(resolve, seconds * 1000));
// };

// const createImage = imgPath => {
//   return new Promise((resolve, reject) => {
//     const img = document.createElement('img');
//     img.src = imgPath;

//     img.addEventListener('load', () => {
//       imgContainer.append(img);
//       resolve(img);
//     });

//     img.addEventListener('error', () => {
//       reject(new Error('Error loading image'));
//     });
//   });
// };

// let currentImage;

// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImage = img;
//     console.log('Image 1 loaded')
//   return wait(2);
// }).then(() => {currentImage.style.display = 'none'; console.log('Image is gooone after 2 seconds')})
//   .catch(err => console.error(err));


/////////////////////////////////////////
// Consuming Promises with ASYNC / AWAIT 
// Async/Await is only about consuming promises!
/////////////////////////////////////////

// here we create async function
// which runs in the background in non-blocking way
// when done it returns a Promise
// synthetic sugar of Promises :) different way of consuming Promises
const loadCountry = async function(country){
  // await is just a way of handling fetch(...).then(...), returns Promise object
  const res  = await  fetch(`https://restcountries.com/v3.1/name/${country}`);

  // here we need to call .json() method on Response object to use data
  const data = await res.json();
  renderCountry(data[0])
}
loadCountry('japan');


const myLocation = async function(){

  // Geolocation
  const position = await getPosition();
  const {latitude: lat, longitude: lng} = position.coords;

  // Reeverse geocoding
  const resGeo = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`);
  const dataGeo = await resGeo.json();
  
  // Country 
  const response = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.address.country}`);
  const data = await response.json();
  
  renderCountry(data[0]);
}

myLocation();

// Using IIFE to return values from ASYNC Functions
// Way of handling Promises from async/await without chaining Promise with .then() and .catch()

(async function(){
  try{
    const response = await myLocation();
    console.log('Last one of them ', response);
  }catch(err){
    console.error('2 execute error', err.message);
  }
  console.log('3. Executed no matter what');
})();



///////////////////////////////
// Running Promises in Parallel
///////////////////////////////

const getJSON = (url, errorMsg ='Houston we may have a probolem') => {
  return fetch(url).then(response => {
    if(!response.ok) throw new Error(errorMsg)  
    return response.json();
  })
}

////////////////////////////////
// Promise.all() - takes array of Promises
// will run all Promises at the same time
// if one Promise rejects, all chain of Promises reject
// we use this in case of Multiple Promise operations at the same time
// that don't depend each on other

const get3Countries = async function(country1,country2,country3){
  try{
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${country1}`),
      getJSON(`https://restcountries.com/v3.1/name/${country2}`),
      getJSON(`https://restcountries.com/v3.1/name/${country3}`)
    ]);
    console.log(data.map(d => d[0].capital));
  }catch(err){ console.log(err)}
}

get3Countries('japan', 'mongolia', 'russia');


/////////////////////////////
// Promise Combinators
// Promise.race
/////////////////////////////
// Promise.race
// takes array of Promise
// returns all settled (available) Promises, Resolved and Rejected
// returns 1st, Fastest, result

(async function (){
  const res = await Promise.race(
    [
      getJSON(`https://restcountries.com/v3.1/name/czech`),
      getJSON(`https://restcountries.com/v3.1/name/italy`),
      getJSON(`https://restcountries.com/v3.1/name/mexico`),
    ]
  )
  console.log(res[0])
})()


// Promise.race -> 2.example
// this example is useful because Promise will reject if user has bad internet connection

const timeout = function(sec){
  return new Promise(function(_, reject){
    setTimeout(()=>{
      reject (new Error('Request took tooooo long!'))
    }, sec)
  })
}

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/tajikistan`),
  timeout(1)
]).then(res => console.log(res[0])).catch(err => console.error(err));

// Promise.allSettled([...])
// takes array of Promise and returns array of all settled Promise
// returns results of all Promise

Promise.allSettled([
  Promise.reject('Houston....'),
  Promise.resolve('Success'),
  Promise.resolve('Another one; bites the dust')
]).then(res => console.log(res)).catch(err => console.log(err));


// Promise.any([...])
// takes array of Promises and returns array of FIRST resolved Promises
// ignores Rejected Promises

Promise.allSettled([
  Promise.resolve('Success from any'),
  Promise.reject('Houston.... this is ignored in Any'),
  Promise.resolve('Another one; bites the dust in Promise.any')
]).then(res => console.log(res)).catch(err => console.log(err));