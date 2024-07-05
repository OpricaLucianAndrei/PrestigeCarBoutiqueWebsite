import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  ngAfterViewInit() {
    const videoContainer = document.getElementById("videoContainer") as HTMLDivElement;
    const ret1 =document.getElementById("rettangolo1") as HTMLDivElement;
    const ret2 =document.getElementById("rettangolo2") as HTMLDivElement;
    const video = document.getElementById("myVideo") as HTMLVideoElement;
    const container = document.getElementById("replacementContainer") as HTMLDivElement;

    if (video && container) {
      video.addEventListener('ended', () => {
        video.classList.add("hidden");

        setTimeout(() => {
          video.style.display = "none";
          ret1.style.display = "none";
          ret2.style.display = "none";
          videoContainer.style.display = "none";
          container.classList.remove("hidden");
          container.classList.add("visible");
        }, 500); 
      });
    }
  }
}
