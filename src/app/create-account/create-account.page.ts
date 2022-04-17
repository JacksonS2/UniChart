import { Component, OnInit, Query } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IDatabase, IMember } from '../core/interfaces/database/database';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage {
  member: Boolean = false;
  database: IDatabase;
  password: string;
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
  wingName: "";
  groupName: "";
  squadronName: "";
  flightName: "";
  constructor(private auth: AngularFireAuth, private router: Router, private toastController: ToastController, private fs: AngularFirestore) {
    fs.collection("database").doc("database").get().subscribe((data) => {
      this.database = data.data() as any;
    })
  }

  createAccount() {
    this.createLogin()

  }
  setupDatabase() {
    this.fs.doc
  }
  createLogin() {
    this.auth.createUserWithEmailAndPassword(this.userProfile.email, this.password).then(data => {
      if (data.user) {
        console.log("added user")
        this.enteredData();
      }
    }).catch(async error => {
      console.log(error)
      const toast = await this.toastController.create({
        message: error,
        duration: 2000

      });
      toast.present();
    })

  }
  enteredData() {
    if (!this.database) {
      console.error("Error retriving database.")
      return;
    }

    let staffLevel:any;

    const wings = this.database.wings || {};
    const specificWing = wings[`${this.wingName}`]

    if (this.wingName != undefined) {
      if (!specificWing) {
        wings[`${this.wingName}`] = {
          name: this.wingName,
          groups: {},
          staff: []
        }
      }
      staffLevel = wings[`${this.wingName}`];
    }

    const groups = wings[`${this.wingName}`] ? wings[`${this.wingName}`].groups : {};

    const specificGroup = groups[`${this.groupName}`]

    if (this.groupName != undefined) {
      if (!specificGroup) {
        groups[`${this.groupName}`] = {
          name: this.groupName,
          squadrons: {},
          staff: []
        }
      }
      staffLevel = groups[`${this.groupName}`];
    }

    const squadrons = groups[`${this.groupName}`] ? groups[`${this.groupName}`].squadrons : {};
    const specificSquadron = squadrons[`${this.squadronName}`]
    if (this.squadronName != undefined) {
      
      if (!specificSquadron) {
        squadrons[`${this.squadronName}`] = {
          name: this.squadronName,
          flights: {},
          staff: []
        }
      }
      staffLevel = squadrons[`${this.squadronName}`]
    }

    if (this.flightName != undefined){
      const flights = squadrons[`${this.squadronName}`].flights || {}
      const specificFlight = flights[`${this.flightName}`]
      if (!specificFlight) {
        flights[`${this.flightName}`] = {
          name: this.flightName,
          members: [],
          staff: []
        }
      }
      staffLevel = flights[`${this.flightName}`]
    }

    if (this.member) {
      staffLevel.members.push(this.userProfile)
    } else {
      staffLevel.staff.push(this.userProfile)
    }
    this.updateDatabase(this.database)
    console.log("added user")
  }

  updateDatabase(database){
    this.fs.collection("database").doc("database").update(database).then(() => {
      this.router.navigate(["home"]);
    })
  }

  prettyPrint(field: string) {
    let words = field.match(/[A-Za-z][a-z]*/g) || [];

    return words.map(this.capitalize).join(" ");//https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded
  }
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }
  back() {
    this.router.navigate([""])
  }
}
