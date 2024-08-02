import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <hr class="w-full h-[1px] bg-mainOrange border-0" />
    <footer
      class="flex flex-col space-y-6 font-mono items-center bg-mainGray w-full pt-6 pb-2 text-mainCreme">
      <div class="flex flex-row w-full items-center justify-around">
        <div class="flex flex-col items-start space-y-2">
          <div
            class="flex flex-row items-center justify-center space-x-2 group">
            <span class="size-10 relative">
              <img
                ngSrc="images/rag-2.png"
                alt="Logo"
                class="object-contain grayscale group-hover:grayscale-0 transition-all ease-in-out duration-500"
                fill />
            </span>
            <span class="font-bold text-lg">RUT-AI-GAMES 2</span>
          </div>
          <span
            >Rzeszów University of Technology<br />
            Games for Artificial Intelligence</span
          >
        </div>
        <div class="flex flex-col items-start space-y-2">
          <span class="font-bold text-lg">AUTHORS</span>
          @for (author of authors; track author.name) {
            <a
              [href]="'https://github.com/' + author.githubName"
              target="_blank"
              >{{ author.name }}</a
            >
          }
        </div>
        <div class="flex flex-col items-start space-y-2">
          <span class="font-bold text-lg">CONTACT</span>
          <span>the.immortalcoders&#64;gmail.com</span>
          <span class="font-bold text-lg">PROJECT SUPERVISOR</span>
          <span>Dawid Kalandyk</span>
        </div>
        <div class="flex flex-col items-start space-y-2">
          <a
            [href]="'https://w.prz.edu.pl/'"
            target="_blank"
            class="flex flex-row items-center justify-center space-x-2 group">
            <span class="w-20 h-10 relative">
              <img
                ngSrc="images/prz_orange.png"
                alt="Logo"
                class="object-contain grayscale group-hover:grayscale-0 transition-all ease-in-out duration-500"
                fill />
            </span>
            <span class="font-bold text-lg"
              >Rzeszów University of Technology</span
            >
          </a>
          <a
            [href]="'http://vision.kia.prz.edu.pl/gest/'"
            target="_blank"
            class="flex flex-row items-center justify-center space-x-2 group">
            <span class="w-20 h-10 relative">
              <img
                ngSrc="images/gest_orange.png"
                alt="Logo"
                class="object-contain grayscale group-hover:grayscale-0 transition-all ease-in-out duration-500"
                fill />
            </span>
            <span class="font-bold text-lg"
              >Human-Computer Interaction Club "GEST"</span
            >
          </a>
        </div>
      </div>
      <div
        class="flex flex-row space-x-12 w-full items-center justify-center text-sm text-mainOrange grayscale">
        <span> &copy; 2024 RUT & GEST</span>
        <span>PRIVACY POLICY</span>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  public authors = [
    {
      name: 'Marcin Bator',
      githubName: 'marcinbator',
    },
    {
      name: 'Paweł Buczek',
      githubName: 'pablitoo1',
    },
    {
      name: 'Bartłomiej Krówka',
      githubName: 'bkrowka',
    },
  ];
}
