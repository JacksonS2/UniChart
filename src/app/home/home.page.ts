import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private auth:AngularFireAuth, private router:Router){

  }
  logout(){
    this.auth.signOut().then(()=>{
      this.router.navigate([""])
    })
  }
}
