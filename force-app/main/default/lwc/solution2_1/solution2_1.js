import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import getObjects from '@salesforce/apex/wsSOQLCall.getObjects';


export default class PlayingWithInputs extends LightningElement {
    userId = Id;
    textValue="";
    contactNumber = 0;


    @wire(getObjects, { soqlQuery: '$formattedQuery'})
    wiredgetObjects({ error, data }) {
        if (data) {
            console.log(data);
            this.contactNumber = data.length;
           
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
    get formattedQuery(){
        var requestInConstruction ='';
        //SELECT
        requestInConstruction += 'SELECT id, name';
        //FROM
        requestInConstruction += ' FROM contact';
        //WHERE
        requestInConstruction += ' WHERE ownerId =\''+ this.userId +'\' AND Name like \'%' + this.textValue + '%\'';
        //GROUP BY
        requestInConstruction += '';
        return requestInConstruction;
    }

    //Cette fonction est appelée à chaque fois que le texte change de valeur.
    handleInputChange(event) {
        this.textValue = event.detail.value;
    }

    handleClick(event){
        this.textValue = "";
    }
}