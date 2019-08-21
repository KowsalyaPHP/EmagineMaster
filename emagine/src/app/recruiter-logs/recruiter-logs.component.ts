import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RecruiterLogsService } from "./recruiter-logs.service";
import { Router } from "@angular/router";
declare const $: any;

@Component({
  selector: "app-recruiter-logs",
  templateUrl: "./recruiter-logs.component.html",
  styleUrls: ["./recruiter-logs.component.css"]
})
export class RecruiterLogsComponent implements OnInit {
  constructor(
    private service: RecruiterLogsService,
    private routerObj: Router
  ) { }
  jobList = [];
  recruiterLogList = [];
  mxJobTitle: string;
  mxRecruiterName: string;
  mxRecruiterId: number;
  mxMaxCount: number;
  mxMaxCountOld: number;
  mxMaxCountPerRecruiter: number;
  mxFixedShare: number;
  mxBonusShare: number;
  mxFixedShareInPerc: number;
  mxBonusShareInPerc: number;
  mxJobId: number;
  userName: string;
  userType: string;

  @ViewChild("openJobMaxCountModal") openJobMaxCountModal: ElementRef;
  @ViewChild("closeJobMaxCountModal") closeJobMaxCountModal: ElementRef;
  @ViewChild("openRecruiterMaxCountModal")
  openRecruiterMaxCountModal: ElementRef;
  @ViewChild("closeRecruiterMaxCountModal")
  closeRecruiterMaxCountModal: ElementRef;

  ngOnInit() {
    setTimeout(function () {
      $(function () {
        $("#jobTable").DataTable();
        $("#recruiterTable").DataTable();
      });
      //alert(this.isData);
    }, 1000);

    $(document).ready(function () {
      $(this).scrollTop(0);
    });

    ///////////////////////////
    // Btn nav collapse
    setTimeout(function () {
      $("#nav .nav-collapse").on("click", function () {
        $("#nav").toggleClass("open");
      });
    }, 1000);

    this.userName = sessionStorage.getItem("username");
    this.userType = sessionStorage.getItem("usertype");
    this.getJobList();
    this.getRecruiterLogList();
  }

  getJobList() {
    this.service.getjobList().subscribe(
      res => {
        this.jobList = res;
        $(function () {
          $("#jobTable").DataTable();
          $("#recruiterTable").DataTable();
        });
      },
      error => {
        this.jobList = [];
      }
    );
  }

  getRecruiterLogList() {
    this.service.getRecruiterLogList().subscribe(
      res => {
        this.recruiterLogList = res;
        $(function () {
          $("#jobTable").DataTable();
          $("#recruiterTable").DataTable();
        });
      },
      error => {
        this.recruiterLogList = [];
      }
    );
  }

  editJobMaxCount(item) {
    this.mxJobId = item.openingId;
    this.mxJobTitle = item.openTitle;
    this.mxMaxCount = item.max_count;
    this.mxMaxCountOld = item.max_count;
    this.mxMaxCountPerRecruiter = item.max_per_recruiter;
    this.mxFixedShare = item.fixedShare;
    this.mxBonusShare = item.bonusShare;
    this.mxFixedShareInPerc = item.fixedShareInPerc;
    this.mxBonusShareInPerc = item.bonusShareInPerc;
    this.openJobMaxCountModal.nativeElement.click();
  }

  editRecruiterMaxCount(item) {
    this.mxJobId = item.openingId;
    this.mxJobTitle = item.openTitle;
    this.mxMaxCount = item.maxCount;
    this.mxRecruiterId = item.recruiterId;
    this.mxRecruiterName = item.recruiterName;
    this.openRecruiterMaxCountModal.nativeElement.click();
  }

  updateRecruiterMaxCount() {
    if (
      this.mxJobId > 0 &&
      this.mxMaxCount > 0 &&
      this.mxMaxCountPerRecruiter > 0
    ) {
      let data = {
        openingId: this.mxJobId,
        recruiterId: this.mxRecruiterId,
        maxCount: this.mxMaxCount,
        userName: this.userName
      };

      this.service.updateRecruiterMaxCount(data).subscribe(
        res => {
          this.closeRecruiterMaxCountModal.nativeElement.click();
          this.getRecruiterLogList();
          this.mxJobId = 0;
          this.mxJobTitle = "";
          this.mxRecruiterId = 0;
          this.mxRecruiterName = "";
          this.mxMaxCount = 0;
          this.mxMaxCountOld = 0;
          this.mxMaxCountPerRecruiter = 0;
        },
        error => { }
      );
    }
  }
  updateJobMaxCount() {
    if (
      this.mxJobId > 0 &&
      this.mxMaxCount > 0 &&
      this.mxMaxCountPerRecruiter > 0 && (this.mxBonusShare > 0 || this.mxBonusShareInPerc > 0) && (this.mxFixedShare > 0 || this.mxFixedShareInPerc > 0)
    ) {
      if (this.mxBonusShareInPerc > 0) {
        this.mxBonusShare = 0;
      }
      if (this.mxFixedShareInPerc > 0) {
        this.mxFixedShare = 0;
      }
      let data = {
        openingId: this.mxJobId,
        oldMaxCountRecruiter: this.mxMaxCountOld,
        newMaxCountRecruiter: this.mxMaxCountPerRecruiter,
        maxCount: this.mxMaxCount,
        fixedShare: this.mxFixedShare,
        bonusShare: this.mxBonusShare,
        fixedShareInPerc: this.mxFixedShareInPerc,
        bonusShareInPerc: this.mxBonusShareInPerc,
        userName: this.userName
      };

      this.service.updateJobMaxCount(data).subscribe(
        res => {
          this.closeJobMaxCountModal.nativeElement.click();
          alert('Job Max Count and Share has been updated successfully');
          this.getJobList();
          this.mxJobId = 0;
          this.mxJobTitle = "";
          this.mxRecruiterId = 0;
          this.mxRecruiterName = "";
          this.mxMaxCount = 0;
          this.mxMaxCountOld = 0;
          this.mxMaxCountPerRecruiter = 0;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  logout() {
    this.routerObj.navigate(["logout"]);
  }
}
