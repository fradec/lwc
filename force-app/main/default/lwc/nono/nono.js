import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import getObjects from '@salesforce/apex/wsSOQLCall.getObjects';


export default class Nono extends LightningElement {
    userId = Id;
    userName = 'GetExplicit';
    userNameWire = 'Wire';
    userUsernameWire = '';
    // wholeData = '';


    //Option 1 avec un @wire
    @wire(getObjects, { soqlQuery: '$formattedQuery'})
    wiredgetObjects({ data, error }) {
        if (data) {
            console.log(data);
            // this.wholeData = data[0];
            this.userNameWire = data[0].Name;
            this.userUsernameWire = data[0].Username;

        } else if (error) {
            console.log('erreur:');
            console.log(error);
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.isError = true;
        }
    }
    //Fin option 1

    //Option 2 en appelant explicitement la fonction après le chargement du composant
    connectedCallback() {
        //Méthode pour appeler
        getObjects({ soqlQuery: this.formattedQuery})
        .then(result =>{
            console.log(result);
            this.userName = result[0].Name;
        })
        .catch(error =>{
            console.log(error);
        })
    }
    //fin option 2

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
}