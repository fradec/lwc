import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';
import getObjects from '@salesforce/apex/wsSOQLCall.getObjects';

export default class Nono_1_1 extends LightningElement {
  userId = Id;
  userName = '';
  countContact = '';

  connectedCallback() {
    //Méthode pour appeler
    getObjects({ soqlQuery: this.formattedQuery})
    .then(result =>{
        console.log(result);
        this.userName = result[0].Name;
    })
    .catch(error =>{
        console.log(error);
    });
    getObjects({ soqlQuery: this.contactsQuery})
    .then(result =>{
        console.log(result);
        this.countContact = result.length;
        // console.log(countContact);
    })
    .catch(error =>{
        console.log(error);
    })
  }

  get formattedQuery(){
    var requestInConstruction ='';
    //SELECT
    requestInConstruction += 'SELECT Id, Name, Username';
    //FROM
    requestInConstruction += ' FROM user';
    //WHERE
    requestInConstruction += ' WHERE Id =\''+ this.userId +'\'';
    //GROUP BY
    requestInConstruction += '';
    return requestInConstruction;
  }

  get contactsQuery(){
    var requestInConstruction ='';
    //SELECT
    requestInConstruction += 'SELECT Id';
    //FROM
    requestInConstruction += ' FROM Contact';
    //WHERE
    requestInConstruction += ' WHERE OwnerId =\''+ this.userId +'\'';
    //GROUP BY
    requestInConstruction += '';
    return requestInConstruction;
  }
}