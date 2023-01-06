import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
    static targets = ["carsList"]
    
    connect() {
        this.garageUrl = 'https://wagon-garage-api.herokuapp.com/zezinho_club/cars/'
        console.log("Controller Garage Connected!")
        this.#refreshCars()
    }

    #refreshCars() {
        this.carsListTarget.innerHTML = ""
        fetch(this.garageUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(car => this.#insertCarCard(car))
        })
    }
    // Principal função p/ criar um carro na API a partir dos dados do form
    createCar(event) {
        // 1. Previne a pág HTML de ser recarregada
        event.preventDefault()
        // 2. Pegar os dados do formulário
        const formData = new FormData(event.currentTarget)
        const newCar = Object.fromEntries(formData)
        
        // 3. Fazer um fetch com o método POST para o endereço da API
        fetch(this.garageUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCar)
        })
        // 4. A partir da resposta da API, iremos inserir o dado criado no HTML
        .then(response => response.json())
        .then(data => this.#insertCarCard(data))
    }

    #insertCarCard(car) {
        const carTag = `<div class="car">
        <div class="car-image">
          <img src="http://loremflickr.com/280/280/${car.brand}%20${car.model}" />
        </div>
        <div class="car-info">
          <h4>${car.brand} - ${car.model}</h4>
          <p><strong>Owner:</strong> ${car.owner}</p>
          <p><strong>Plate:</strong> ${car.plate}</p>
        </div>
        <button class="btn btn-danger" value="${car.id}" data-action="click->garage#delete">Delete</button>
      </div>`
      this.carsListTarget.insertAdjacentHTML('beforeend', carTag)
    }

    delete(event) {
        // console.log(event.currentTarget.value)
        fetch(`https://wagon-garage-api.herokuapp.com/cars/${event.currentTarget.value}`, {
            method: "DELETE"
        })
        .then( () => {
            this.#refreshCars() 
        })
       
    }
}