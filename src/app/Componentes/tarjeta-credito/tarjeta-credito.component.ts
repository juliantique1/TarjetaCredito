import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent {
ListTarjetas: any [] = [];
accion = 'agregar';
form: FormGroup;
id: number | undefined

constructor(private fb: FormBuilder,private toastr: ToastrService,private _TarjetaServices: TarjetaService){
  this.form = this.fb.group({
    titular: ['', Validators.required],
    numeroTarjeta: ['',[Validators.required,Validators.maxLength(16),Validators.minLength(16)]],
    fechaExpiracion: ['',[Validators.required,Validators.maxLength(5),Validators.minLength(5)]],
    cvv: ['',[Validators.required,Validators.maxLength(3),Validators.minLength(3)]]
  })
}
ngOnInit(): void {
  this.obtenerTarjetas();
}

obtenerTarjetas(){
  this._TarjetaServices.getListTarjetas().subscribe(julian =>{
  this.ListTarjetas = julian;
  },error => {console.log(error);})
}

guardarTarjeta(){
  console.log(this.form);
  const tarjeta: any ={
    titular:this.form.get('titular')?.value,
    numeroTarjeta:this.form.get('numeroTarjeta')?.value,
    fechaExpiracion:this.form.get('fechaExpiracion')?.value,
    cvv:this.form.get('cvv')?.value,
  }
if(this.id == undefined){
// agregamos una nueva tarjeta
this._TarjetaServices.saveTarjeta(tarjeta).subscribe(data =>{
  this.toastr.success('La tarjeta fue registrada con exito!', 'Tarjeta Registrada!');
  this.obtenerTarjetas();
  this.form.reset();
},error => {
  this.toastr.error('ocurrio un ', ' error')
  console.log(error)
} )
}

else{
  tarjeta.id = this.id;
  //editar tarjeta
  this._TarjetaServices.updateTarjeta(this.id,tarjeta).subscribe(data => {
    this.form.reset();
    this.accion = 'agregar';
    this.id = undefined;
    this.toastr.info('la tarjeta fue actualizada con exito');
    this.obtenerTarjetas();
  })
}




}

eliminarTarjeta(id: number){
 this._TarjetaServices.deleteTarjeta(id).subscribe(data =>{
  this.toastr.error('La tarjeta fue elimina con exito!', 'Tarjeta eliminada!')
  this.obtenerTarjetas();
 }, error => {console.log(error);})

 }
editarTarjeta(tarjeta: any){
this.accion = 'editar';
this.id = tarjeta.id;
this.form.patchValue({
  titular: tarjeta.titular,
  numeroTarjeta: tarjeta.numeroTarjeta,
  fechaExpiracion: tarjeta.fechaExpiracion,
  cvv: tarjeta.cvv
})
}
}
