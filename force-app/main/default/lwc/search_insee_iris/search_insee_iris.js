import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { getFieldValue } from 'lightning/uiRecordApi';

const FIELDS = [
    'npsp__Address__c.CityInseeId__c',
    'npsp__Address__c.IrisId__c',
    'npsp__Address__c.MailingStreet3__c',
    'npsp__Address__c.npsp__MailingCity__c',
    'npsp__Address__c.npsp__MailingPostalCode__c'
];

const API_URL = 'https://pyris.datajazz.io/api/search/?geojson=false&q=';

export default class SearchInseeIris extends LightningElement {
    @api recordId;

    @track error;

    address;
    code_insee;
    code_iris;
    code_postal;
    street3;
    city;
    address_new = {};

    isLoading = false;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            this.code_insee = getFieldValue(data, 'npsp__Address__c.CityInseeId__c');
            this.code_iris = getFieldValue(data, 'npsp__Address__c.IrisId__c');
            this.code_postal = getFieldValue(data, 'npsp__Address__c.npsp__MailingPostalCode__c');
            this.street3 = encodeURIComponent(getFieldValue(data, 'npsp__Address__c.MailingStreet3__c'));
            this.city = encodeURIComponent(getFieldValue(data, 'npsp__Address__c.npsp__MailingCity__c'));
        } else if (error) {
            console.error(error);
        }
    }

    async handleClick() {
        try {
            this.isLoading = true;
            let url = API_URL + this.street3 + '%20' + this.city + '&postcode=' + this.code_postal;
            if (this.code_insee) {
                url += '&citycode=' + this.code_insee;
            }
            // console.log(url);
            const response = await fetch(url);
            if (response.ok) {
                const returnedAddress = await response.json();
                if (returnedAddress.citycode && !this.code_insee) {
                    this.address_new['CityInseeId__c'] = returnedAddress.citycode;
                }
                if (returnedAddress.complete_code && !this.code_iris) {
                    this.address_new['IrisId__c'] = returnedAddress.complete_code;
                }
                if (Object.keys(this.address_new).length > 0) {
                    const recordInput = { fields: { ...this.address_new, Id: this.recordId } };
                    await updateRecord(recordInput);
                }
                this.address_new = {
                    code_insee: returnedAddress.citycode,
                    code_iris: returnedAddress.complete_code,
                    address: returnedAddress.address
                };
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            this.error = 'L\'adresse n\'a pas pu être vérifiée avec les informations fournies.';
            // console.error(error);
            // alert('Une erreur est survenue.\nL\'adresse n\'a pas pu être vérifiée avec les informations fournies.');
        } finally {
            this.isLoading = false;
        }
    }
}
