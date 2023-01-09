import { LightningElement } from 'lwc';

export default class PlayingWithInputs extends LightningElement {
    textValue="Tu n'as encore rien tapé...";
    sliderValue = 0;
    nbrOfClicks = 0;

    //Cette fonction est appelée à chaque fois que le texte change de valeur.
    handleInputChange(event) {
        this.textValue = event.detail.value;
    }

    handleSliderChange(event){
        this.sliderValue = event.detail.value;
    }

    handleClick(event){
        this.nbrOfClicks++;
    }
}