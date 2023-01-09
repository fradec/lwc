import { LightningElement } from 'lwc';
import Id from '@salesforce/user/Id';
import getObjects from '@salesforce/apex/wsSOQLCall.getObjects'

export default class TD1_Gabriel extends LightningElement {
    userId = Id;

    connectedCallback() {
        getObjects({ soqlQuery: this.createTheRequest()})
        .then(result =>{
            console.log(result);
            this.userName = result[0].Name;
						// Ajouter la logique de traitement du résultat.
        })
        .catch(error =>{
            console.log(error);
        })
    }

    createTheRequest(){
        var requestInConstruction ='';
        //SELECT
        requestInConstruction += 'SELECT id, name';
        //FROM
        requestInConstruction += ' FROM user';
        //WHERE
        requestInConstruction += ' WHERE Id =\''+ this.userId +'\'';
        //GROUP BY
        requestInConstruction += '';
        return requestInConstruction;
    }
}