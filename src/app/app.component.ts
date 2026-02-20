import { Component } from '@angular/core';
import { ResourcesService } from 'src/app/resources.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'clasificator';
  result = false;
  positives = 0;
  negatives = 0;
  analyzer: String = "";

  positiveWords: any = [];
  negativeWords: any = [];
  stopWords: any = [];

  constructor(
    private resourcesService: ResourcesService
  ) {
    // Obtenemos las palabras positivas
    this.resourcesService.getPositiveWords().subscribe(
      response => {
        this.positiveWords = response;
      },
      error => {
        console.log("No se han podido obtener las palabras positivas.");
      }
    );

    // Obtenemos las palabras negativas
    this.resourcesService.getNegativeWords().subscribe(
      response => {
        this.negativeWords = response;
      },
      error => {
        console.log("No se han podido obtener las palabras positivas.");
      }
    );

    // Obtenemos las palabras vacías
    this.resourcesService.getStopWords().subscribe(
      response => {
        this.stopWords = response;
      },
      error => {
        console.log("No se han podido obtener las palabras vacías.");
      }
    );
  }

  modelChanged(comment: String) {
    this.analyzer = comment;
    if (!this.analyzer) {
      this.result = false;
    }
  }

  analyze() {
    if (this.positiveWords.length > 0 && this.negativeWords.length > 0 && this.stopWords.length > 0) {
      if (this.analyzer) {
        this.result = true;
        let aux = "";
        let auxArray = [];
        aux = this.removePunctuation(this.analyzer);
        auxArray = aux.split(" ");

        // Eliminamos las palabras vacías del array
        auxArray = this.removeStopWords(auxArray);

        // Calculamos número de palabras positivas
        this.calculatePositives(auxArray);
        // Calculamos número de palabras negativas
        this.calculateNegatives(auxArray);
      } else {
        this.positives = 0;
        this.negatives = 0;
      }
    }
  }

  removePunctuation(comment: String) {
    return comment.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, "");
  }

  removeStopWords(comments: any) {
    // Borrar del array los elementos vacíos
    let final = [];

    for (let i = 0; i < comments.length; ++i) {
      if(!this.stopWords.includes(comments[i].toLowerCase())){
        final.push(comments[i]);
      }
    }

    return final;
  }

  calculatePositives(comments: any) {
    let count = 0;    

    for (let i = 0; i < comments.length; ++i) {
      if(this.positiveWords.includes(comments[i].toLowerCase())){
        count++;
      }
    }
    
    this.positives = count;
  }

  calculateNegatives(comments: any) {
    let count = 0;

    for (let i = 0; i < comments.length; ++i) {
      if(this.negativeWords.includes(comments[i].toLowerCase())){
        count++;
      }
    }
    
    this.negatives = count;
  }
}