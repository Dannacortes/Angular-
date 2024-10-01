import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})

export class SearchbarComponent { 

  number = sessionStorage.length  
  oli = sessionStorage  
  direccion: string[] = [];
  cuantos: { id: string, capacity: string, origen: string}[] = [];

  ngOnInit(): void {

    for (let i = 0; i < this.number; i++) {
      let clave = sessionStorage.key(i);  // Obtiene la clave en la posición `i`
      
      if (clave !== null) {
        let valor =  JSON.parse(sessionStorage.getItem(clave) ?? "");  // Obtiene el valor asociado a la clave
        this.direccion.push(valor.address)
        this.cuantos.push({ id: valor.address, capacity: valor.maxCapacity, origen: clave});
      }
    }

    

  }

  howMany(){
    let donde = (<HTMLInputElement>document.getElementById("donde")).value;
    let cuanto = this.cuantos.find(elemento => elemento.id === donde)!.capacity;
    (<HTMLInputElement>document.getElementById("quien")).value = cuanto
  }

  calcularFecha(){
    let llega = (<HTMLInputElement>document.getElementById("llega")).value;
    let sale = (<HTMLInputElement>document.getElementById("sale")).value;
    
    if (sale === ""){

    }else if(llega > sale){
      Swal.fire("La fecha llegada debe ser menor que la fecha salida");
    }
    
  }

  mostrarDatos(){

    

    let dondeCampo = (<HTMLInputElement>document.getElementById("donde")).value;
    let llegaCampo = (<HTMLInputElement>document.getElementById("llega")).value;
    let saleCampo = (<HTMLInputElement>document.getElementById("sale")).value;
    let quienCampo = (<HTMLInputElement>document.getElementById("quien")).value;

    if(dondeCampo == "" || llegaCampo == "" || saleCampo == "" || quienCampo == ""){
      Swal.fire("Debe diligenciar todos los campos antes de buscar");
    }

    let donde = (<HTMLInputElement>document.getElementById("donde")).value;
    let id = this.cuantos.find(elemento => elemento.id === donde)!.origen;

    let casa = JSON.parse(sessionStorage.getItem(id)!);

    (<HTMLInputElement>document.getElementById("titulo")).textContent = casa.title;    
    (<HTMLInputElement>document.getElementById("direccion")).textContent = casa.address;
    (<HTMLInputElement>document.getElementById("banos")).textContent = casa.bathrooms;
    (<HTMLInputElement>document.getElementById("habittacion")).textContent = casa.bedrooms;
    (<HTMLInputElement>document.getElementById("descripcion")).textContent = casa.description;
    (<HTMLInputElement>document.getElementById("capacidad")).textContent = casa.maxCapacity;
    (<HTMLInputElement>document.getElementById("precio")).textContent = casa.pricePerNight;

  }
  
}
