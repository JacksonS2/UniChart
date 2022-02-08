import { Component, OnInit } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { Router} from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username:string;
  password:string;

  constructor(private router:Router, private fireAuth:AngularFireAuth,public toastController: ToastController) { }

  ngOnInit() {
  }
  login() {
    this.fireAuth.signInWithEmailAndPassword(this.username,this.password).then(data=>{
      const user = data.user
      if(user){
        this.router.navigate(["home"])
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
  createAccountNav(){
    this.router.navigate(["create-account"])
  }
}
