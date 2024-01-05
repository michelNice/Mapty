'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


let map, mapEvent


class App {
    #map;
    #mapEvent;
    constructor(){
        this._getPosition()

        form.addEventListener('submit',this._newWorkout.bind(this))


        inputType.addEventListener('change',function(){

            inputElevation.closest('.form__row').classList.toggle('form__row--hidden')

            inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
        })
    }

    _getPosition(){

        if(navigator.geolocation){

            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this))
        
        }
    }

    _loadMap(position){
            const {latitude} =  position.coords
            const {longitude} = position.coords
    
            const coords = [latitude,longitude]
    
             this.#map = L.map('map').setView(coords, 16);
    
            L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
    
            //L.marker(coords).addTo(map).bindPopup('Ivan z').openPopup();
    
    
            this.#map.on('click',this._showForm.bind(this))

    }

    _showForm(mapE){

        this.#mapEvent = mapE
    
        form.classList.remove('hidden')

        inputDistance.focus()

    }

    _toggleElevationField(){}

    _newWorkout(e){

        e.preventDefault()
            
        inputDistance.value = inputDuration.value = inputElevation.value = inputDistance.value = ''

        const {lat,lng} = this.#mapEvent.latlng

        L.marker([lat,lng]).addTo(this.#map).bindPopup(L.popup({
            closeOnClick:false,
            autoClose:false,
            minWidth:100,
            maxWidth:200,
            className:'running-popup'
            
        })
        )
        .setPopupContent('Ivan Z')
        .openPopup()

    }

}


const app = new App()

app._getPosition()

