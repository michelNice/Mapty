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
    id = (Date.now() + '').slice(-10)
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

        this.calcSpeed()
    }


    calcSpeed(){
        this.speed = this.distance / (this.duration / 60)

        return  this.speed
    }
}



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

        const validInputs = (...inputs)=> inputs.every(inp =>  Number.isFinite(inp))

        const allPositive = (...inputs)=> inputs.every(inp => inp > 0)

        e.preventDefault()

        //Get data from form 
        
        const type = inputType.value

        const distance = +inputDistance.value 

        const duration = +inputDuration.value
       
        //If workout running,creat running object
        
        if(type === 'running'){
            const cadence = +inputCadence.value

            if( 
                /*
                !Number.isFinite(distance) || 
                !Number.isFinite(duration) ||
                !Number.isFinite(cadence)
                */

                !validInputs(distance,duration,cadence)||
                !allPositive(distance,duration,cadence)
            
            )return alert('10')
        }

        //If workout cycling , create cycling object

        if(type === 'cycling'){
            const elevation = +inputElevation.value

            if(
                /*
                !Number.isFinite(distance)||
                !Number.isFinite(duration)||
                !Number.isFinite(elevation)
                */
               !validInputs(distance,duration,elevation)||
               !allPositive(distance,duration)
                
            )return alert('cypher')
        }

        //Add new object to workout array

        //Clean field

        inputDistance.value = inputDuration.value = inputElevation.value = inputDistance.value = ''

        //Render workout  on list
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

        //Clear input fields
            
        //Hide form + clear input fields

        


    }

}

const app = new App()



