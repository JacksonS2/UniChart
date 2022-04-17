import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { IonLabel } from '@ionic/angular';
import { TreeNode } from 'primeng/api';
import { OrganizationChart } from 'primeng/organizationchart';
import { logWarnings } from 'protractor/built/driverProviders';
import { IDatabase, IMember } from '../core/interfaces/database/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  orgChart: TreeNode[];




  constructor(private auth: AngularFireAuth, private router: Router, private fs: AngularFirestore) {
    fs.collection("database").doc("database").get().subscribe((data) => {
      this.processData(data.data() as any)
    })
  }
  onNodeSelect(event){
    console.log(event)
  }
  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate([""])
    })
  }

  profile() {
    this.router.navigate(['profile'])
  }


  processData(fsData: IDatabase) {
    this.orgChart = [{ //generate org chart
      label: "Wings",   //label etop node
      children: getWingData(), //generate wing name node
      expanded: true
    }]

    function getWingData() {
      const wingsNode: TreeNode[] = []
      const wings = fsData.wings;
      if (wings) {
        for (const wingName in wings) {
          wingsNode.push({
            expanded: true,
            label: wingName,
            children: [
              {
                label: "Staff",
                expanded: true,
                children: getStaff(wings[wingName])
              },
              {
                label: "Groups",
                expanded: true,
                children: getGroups(wings[wingName])
              }
            ]
          })
        }
      }

      return wingsNode;
    }
    function getStaff(wing) {
      const staffMembers: TreeNode[] = []

      // Look through wing staff
      for (const memberName in wing.staff) {
        const member: IMember = wing.staff[memberName];
        const memberNode: TreeNode = {
          label: `${member.dutyTitle} ${member.firstName} ${member.lastName}`,
          type: 'member',
          data: member
        }
        staffMembers.push(memberNode);
      }
      return (staffMembers)
    }
    function getGroups(wing) {
      const groups = wing.groups;
      const groupsNode: TreeNode[] = []

      for (const groupName in groups) {
        groupsNode.push({
          label: groupName,
          expanded: true,
          children: [{
            label: "Staff",
            expanded: true,
            children: getStaff(groups[groupName])
          },
          {
            label: "Squadrons",
            expanded: true,
            children: getSquadrons(groups[groupName])
          }]
        })
      }
      return groupsNode
    }
    function getSquadrons(group) {
      const squadrons = group.squadrons;
      const squadronsNode: TreeNode[] = []

      for (const squadronName in squadrons) {
        squadronsNode.push({
          label: squadronName,
          expanded: true,
          children: [{
            label: "Staff",
            expanded: true,
            children: getStaff(squadrons[squadronName])
          },
          {
            label: "Flights",
            expanded: true,
            children: getFlights(squadrons[squadronName])
          }]
        })
      }
      return (squadronsNode)
    }
    function getFlights(squadron) {
      const flights = squadron.flights;
      const flightsNode: TreeNode[] = []

      for (const flightName in flights) {
        flightsNode.push({
          label: flightName,
          expanded: true,
          children: [{
            label: "Staff",
            expanded: true,
            children: getStaff(flights[flightName])
          },
          {
            label: "Member",
            expanded: true,
            children: getMember(flights[flightName])
          }]
        })

      }
    return(flightsNode)
    }
    function getMember(flight){
      const flightMembers: TreeNode[] = []
      for (const memberName in flight.members) {
        const member: IMember = flight.members[memberName];
        const memberNode: TreeNode = {
          label: `${member.dutyTitle} ${member.firstName} ${member.lastName}`,
          type: 'member',
          data: member
        }
        flightMembers.push(memberNode);
      }
      return (flightMembers)
      return
    }
  }
}