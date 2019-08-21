import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployerListService } from '../../app/employer-list/employer-list.service';
import { Router } from '@angular/router';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
declare var $: any;
@Component({
  selector: 'app-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.css']
})
export class EmployerListComponent implements OnInit {
  regDataArr = [];
  isData: boolean = false;
  sessionId: any;
  userID: any;
  usrtype: any;
  data: any;
  news_image: any;
  idToUpdate: any;
  isUploadLogo: boolean;
  cropperSettings: CropperSettings;

  @ViewChild("openUploadImage") openUploadImage: ElementRef;


  constructor(private EmpListService: EmployerListService, private routerObj: Router) {
    this.sessionId = sessionStorage.getItem('uniqueSessionId');
    this.userID = sessionStorage.getItem('userID');
    this.usrtype = sessionStorage.getItem('usertype');

    this.showEmployerList(this.sessionId, this.userID);

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 140;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 330;
    this.cropperSettings.canvasHeight = 300;
    //this.cropperSettings.rounded = true; 
    this.data = {};
  }

  ngOnInit() {

    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }

    $(document).ready(function () {
      $(this).scrollTop(0);
    });


    setTimeout(function () {
      $(function () {
        $('#employerTable').DataTable();
      });
      //alert(this.isData);
    }, 1000);
  }

  showEmployerList(sessionID, userId) {
    this.EmpListService.showEmployerList(sessionID, userId).subscribe(
      response => {
        if (response != '') {
          if (response == 'Session MisMatch') {
            this.routerObj.navigate(['/login']);
          }
          else {
            this.regDataArr = response;
          }
          //alert('Status changed');
        }
        else {
          console.log('something is wrong with Service  Execution');
        }
      },
      error => console.log("Error Occurd!")
    );
  }
  uploadLogoEmp(id) {
    this.idToUpdate = id;
    // $('#uploadImage').modal('show');
    this.openUploadImage.nativeElement.click();
  }
  uploadImage() {
    if (this.idToUpdate != '') {
      var imgToUpload: any;
      var imgToSplit: any;
      imgToUpload = this.data.image;
      imgToSplit = imgToUpload.split(',');
      this.news_image = imgToSplit[1];

      this.EmpListService.uploadEmployerLogo(this.idToUpdate, this.news_image, this.sessionId, this.userID).subscribe(
        response => {
          if (response == 'Success') {
            alert('Logo Uploaded');
            this.showEmployerList(this.sessionId, this.userID);
          }
          else {
            alert('Error Occurd! Please Upload Logo!');
            console.log('something is wrong with Service Execution');
          }
        },
        error => console.log("Error Occurd!")
      );
    }
    this.idToUpdate = '';
  }

  deleteLogoEmp(id) {
    this.idToUpdate = id;

    if (confirm("Are you sure, to delete this logo?")) {

      this.EmpListService.deleteEmployerLogo(this.idToUpdate).subscribe(
        response => {
          if (response == 'Success') {
            alert('Logo Deleted');
            this.showEmployerList(this.sessionId, this.userID);
          }
          else {
            alert('Error Occurd! Please Upload Logo!');
            console.log('something is wrong with Service Execution');
          }
        },
        error => console.log("Error Occurd!")
      );


    }
  }

  logout() {
    this.routerObj.navigate(['logout']);
  }

}
