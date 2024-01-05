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

class workout{
    date = new Date()
    id = (new Date() + '').slice(-10)
    constructor(coords,distance,duration){

        this.coords = coords

        this.distance = distance

        this.duration = duration
    }
}


class running extends workout{
    constructor(coords,distance,duration,cadence){

        super(coords,distance,duration)

        this.cadence = cadence;

        this.calcPace()
    }

    calcPace(){
        //min/km

        this.pace = this.duration / this.distance

        return this.pace
    }
}


class cycling extends workout{

    constructor(coords,distance,duration,elevationGain){

        super(coords,distance,duration)

        this.elevationGain = elevationGain
    }


    calcSpeed(){
        this.speed = this.distance / (this.duration / 60)

        return  this.speed
    }
  
}

const run1 = new running([39, -12], 5.2,24,189)

const cyclin = new running([39, -12], 5.2,24,189)

console.log(run1,cyclin)

class App {
    #map;
    #mapEvent;
    constructor(){
        this._getPosition()

        form.addEventListener('submit',this._newWorkout.bind(this))


        inputType.addEventListener('change',this._toggleElevationField.bind(this))
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

    _toggleElevationField(){
        
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')

        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')

    }

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

//app._getPosition()

