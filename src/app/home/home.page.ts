import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { SpeechRecognition } from "@ionic-native/speech-recognition/ngx";
import { Gesture, GestureController, IonCard } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  people = [
    {
      name: "Adrian Jenson",
      job: "Web developer",
      power: 0,
    },

    {
      name: "Gongalt",
      job: "Mage x Sentinel",
      power: 0,
    },
    {
      name: "Kurimz",
      job: "Mage x Sentinel",
      power: 0,
    },
  ];

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;

  longPressActive: boolean = false;
  constructor(
    private speechRecognition: SpeechRecognition,
    private gestureCtrl: GestureController,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.useLongPress(cardArray);
  }

  ngOnInit() {
    // Check feature available
    this.speechRecognition
      .isRecognitionAvailable()
      .then((available: boolean) => console.log(available));

    let options = {
      language: "en-US",
    };
    // // Start the recognition process
    // this.speechRecognition.startListening(options).subscribe(
    //   (matches: string[]) => console.log(matches),
    //   (onerror) => console.log("error:", onerror)
    // );

    // // Stop the recognition process (iOS only)
    // this.speechRecognition.stopListening();

    // Get the list of supported languages
    this.speechRecognition.getSupportedLanguages().then(
      (languages: string[]) => console.log(languages),
      (error) => console.log(error)
    );

    // Check permission
    this.speechRecognition
      .hasPermission()
      .then((hasPermission: boolean) => console.log(hasPermission));

    // Request permissions
    this.speechRecognition.requestPermission().then(
      () => console.log("Granted"),
      () => console.log("Denied")
    );
  }

  useLongPress(cardArray) {
    console.log("pressed");
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      console.log("card", card);
      const gesture: Gesture = this.gestureCtrl.create(
        {
          el: card.nativeElement,
          gestureName: "long-press",
          onStart: (ev) => {
            this.longPressActive = true;
            this.openSpeechRecognition();
          },
          onEnd: (ev) => {
            this.longPressActive = false;
          },
        },
        true
      );
      gesture.enable();
    }
  }

  openSpeechRecognition() {
    setTimeout(() => {
      if (this.longPressActive) {
        this.ngZone.run(() => {
          console.log("openSpeechRecognition");
          // Start the recognition process
          this.speechRecognition.startListening().subscribe(
            (matches: string[]) => console.log(matches),
            (onerror) => console.log("error:", onerror)
          );
        });
      }
    }, 200);
  }
}
