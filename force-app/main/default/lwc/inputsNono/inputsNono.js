import { LightningElement } from 'lwc';
import getObjects from '@salesforce/apex/wsSOQLCall.getObjects';

export default class PlayingWithInputs extends LightningElement {
    textValue='Vide';
    nbrContact = 0;
    nbrOfClicks = 0;
    contacts = '';

    //Cette fonction est appelée à chaque fois que le texte change de valeur.
    handleInputChange(event) {
        this.textValue = event.detail.value;

        getObjects({ soqlQuery: this.formattedQuery})
        .then(result =>{
            console.log(result);
            this.contacts = result;
            this.nbrContact = result.length;
        })
        .catch(error =>{
            console.log(error);
        })
    }

    handleClick(event){
        this.nbrOfClicks++;
    }

    get formattedQuery(){
      var requestInConstruction ='';
      //SELECT
      requestInConstruction += 'SELECT Id, Name';
      //FROM
      requestInConstruction += ' FROM Contact';
      //WHERE
      requestInConstruction += ' WHERE Name LIKE \'%'+ this.textValue +'%\'';
      //GROUP BY
      requestInConstruction += '';
      return requestInConstruction;
  }
}