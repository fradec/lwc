import { LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';
import getObjects from '@salesforce/apex/wsSOQLCall.getObjects';


export default class Arnaudc extends LightningElement {
    userId = Id;
    userName = 'GetExplicit';
    userNameWire = 'Wire';
    contactNumber = 0;


    //Option 1 avec un @wire
    @wire(getObjects, { soqlQuery: '$formattedQuery'})
    wiredgetObjects({ error, data }) {
        if (data) {
            console.log(data);
            this.userNameWire = data[0].Name;
           
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

    //Solution1: Ajouter un 2ème appel pour récupérer les contacts du owner et compter le nombre de lignes récupérées.
    @wire(getObjects, { soqlQuery: '$formattedQuery2'})
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
    //Solution 2 (plus jolie) on peut en une seule requête récupérer toutes les informations dont nous avons besoin (le nom du user et le nombre de contacts)
    @wire(getObjects, { soqlQuery: '$formattedQuery3'})
    wiredgetObjects({ error, data }) {
        if (data) {
            console.log(data);
            this.userName = data[0].Name;
            this.contactNumber = data[0].Nbr;
           
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




    //Option 2 en appelant explicitement la fonction après le chargement du composant
    connectedCallback() {
        //Méthode pour appeler 
        getObjects({ soqlQuery: this.formattedQuery})
        .then(result =>{
            console.log(result);
            //this.userName = result[0].Name;
        })
        .catch(error =>{
            console.log(error);
        })
    }
    //fin option 2

    get formattedQuery(){
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

    get formattedQuery2(){
        var requestInConstruction ='';
        //SELECT
        requestInConstruction += 'SELECT id, name';
        //FROM
        requestInConstruction += ' FROM contact';
        //WHERE
        requestInConstruction += ' WHERE OwnerId =\''+ this.userId +'\'';
        //GROUP BY
        requestInConstruction += '';
        return requestInConstruction;
    }

    get formattedQuery3(){
        var requestInConstruction ='';
        //SELECT
        requestInConstruction += 'SELECT Owner.Name Name, count(id) Nbr';
        //FROM
        requestInConstruction += ' FROM contact';
        //WHERE
        requestInConstruction += ' WHERE OwnerId =\''+ this.userId +'\'';
        //GROUP BY
        requestInConstruction += ' GROUP BY OwnerId, Owner.Name ';
        return requestInConstruction;
    }
}