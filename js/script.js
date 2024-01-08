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

class Workout{
    date = new Date()
    id = (Date.now() + '').slice(-10)
    constructor(coords,distance,duration){

        this.coords = coords

        this.distance = distance

        this.duration = duration
    }
}


class running extends Workout{
    type = 'running'
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


class cycling extends Workout{
    type = 'cycling'
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
    #workouts = []
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

        const {lat,lng} = this.#mapEvent.latlng

        let workout
       
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

            workout = new running([lat,lng],distance,duration,cadence)
           
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

            workout = new cycling([lat,lng],distance,duration,elevation)
        }

        //Add new object to workout array
        this.#workouts.push(workout)

        console.log(workout)

        //Clean field

        inputDistance.value = inputDuration.value = inputElevation.value = inputDistance.value = ''

        //Render workout mark

        this._renderWorkoutMark(workout)

        //Render workout  on list
      
        //Clear input fields
            
        //Hide form + clear input fields

    }

    _renderWorkoutMark(workout){
          //const {lat,lng} = this.#mapEvent.latlng
          L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            closeOnClick:false,
            autoClose:false,
            minWidth:100,
            maxWidth:250,
            className:`${workout.type}-popup`
            
        })
        )
        .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}`)
        .openPopup()
    }
    

}

const app = new App()