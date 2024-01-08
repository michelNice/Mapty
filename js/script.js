'use strict';

// prettier-ignore

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

        //this._setDescription()
    }

    _setDescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]}
        
        ${this.date.getDate()}`
    }
}


class running extends Workout{
    type = 'running'
    constructor(coords,distance,duration,cadence){

        super(coords,distance,duration)

        this.cadence = cadence;

        this.calcPace()

        this._setDescription()
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

        this._setDescription()
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
    #mapZoomLevel = 13
    constructor(){
        this._getPosition()

        form.addEventListener('submit',this._newWorkout.bind(this))


        inputType.addEventListener('change',this._toggleElevationField.bind(this))

        containerWorkouts.addEventListener('click',this._moveToPopup.bind(this))
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
    
             this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    
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

    _hideForm(){
        inputDistance.value = inputDuration.value = inputElevation.value = inputDistance.value = ''

        form.classList.add('hidden')

        form.style.display = 'none'

        setTimeout(()=> form.style.display = 'grid',1000)
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
        
        this._hideForm(workout)
        //Render workout mark

        this._renderWorkoutMark(workout)

        //Render workout  on list

        this._renderWorkout(workout)
      
        //Clear input fields
            
        //Hide form + clear input fields

    }

    

    _renderWorkoutMark(workout){
          L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            closeOnClick:false,
            autoClose:false,
            minWidth:100,
            maxWidth:250,
            className:`${workout.type}-popup`
            
        })
        )
        .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
        .openPopup()
    }
    
    _renderWorkout(workout){

        let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`

        if(workout.type === 'running'){
            html += `<div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`
        }


        if(workout.type === 'cycling'){
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`
        }

        form.insertAdjacentHTML('afterend',html)
        
    }


    _moveToPopup(e){

        const workoutEl = e.target.closest('.workout')

        if(!workoutEl)return 

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id)

        console.log(workout)


        this.#map.setView(workout.coords,this.#mapZoomLevel,{
            animate:true,
            pan:{
                duration:1
            }
        })
    }


  
}

const app = new App()