import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  email: string;
  password: string;
  constructor(private auth:AngularFireAuth, private router:Router, private toastController:ToastController) { 

  }

  createAccount(){
    this.auth.createUserWithEmailAndPassword(this.email, this.password).then(data=>{
      if(data.user){
        this.router.navigate(["home"]);
      }
    }).catch(async error=>{
      console.log(error)
      const toast = await this.toastController.create({
        message: error,
        duration: 2000
        
      });
      toast.present();
    })
  
  }
  back(){
    this.router.navigate([""])
  }
  ngOnInit() {
  }

}
