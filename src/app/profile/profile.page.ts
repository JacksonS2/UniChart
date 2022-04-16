import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IDatabase, IMember } from '../core/interfaces/database/database';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  userEmail;
  userProfile: IMember = {
    grade: '',
    lastName: '',
    firstName: '',
    email: '',
    biography: '',
    dutyTitle: '',
    profilePictureURL: '',
    unitDesignation: ''
  }
  database: IDatabase;

  constructor(private auth: AngularFireAuth, private router: Router,
    private toastController: ToastController, private fs: AngularFirestore) {
    fs.collection("database").doc("database").get().subscribe((data) => {
      this.database = data.data() as any;
      auth.authState.subscribe(authData => {

        this.userEmail = authData.email;
        const wings = this.database.wings;
        for (const wingName in wings) {

          // Look through wing staff
          const wing = wings[`${wingName}`]
          const staff = wing?.staff || undefined;
          const groups = wing?.groups || {} 
          this.staffHasUser(staff);
  
          //Look through group staff
          for (const groupName in groups) {
            const group = groups[`${groupName}`] || undefined
            const staff = group ? group.staff : undefined
            const squadrons = group?.squadrons  || {}
            this.staffHasUser(staff);
  
            //Look through squadron staff 
            for (const squadronName in squadrons){
              const squadron = group.squadrons[`${squadronName}`]
              const staff = squadron?.staff || undefined
              const flights = squadron?.flights || {}
              this.staffHasUser(staff)
  
              //Look through flight staff 
              for (const flightName in flights){
                const flight = squadron.flights[flightName]
                const staff = flight.staff
                const members = flight.members
                this.staffHasUser(staff)
                this.staffHasUser(members)
              }
            }
          }
        }
        console.log(this.userProfile)
      })
    })
  }
  save(){
    this.fs.collection("database").doc("database").update(this.database).then(async ()=>{ const toast = await this.toastController.create({
      message: "Saved!",
      duration: 2000

    });
    toast.present();} )

  }



  staffHasUser(staff:IMember[]){
    if(!staff) return;
    staff.forEach(member => {
      console.log(member.email, this.userEmail)
      if(member.email == this.userEmail){
        this.userProfile = member;
      }
    })
  }  

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate([""])
    })
  }
  home_page() {
    this.router.navigate(['home'])

  }
}
