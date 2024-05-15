export class GUI extends HTMLElement{
    constructor() {
        super();

        this.viewfinder = document.createElement('div');
        this.viewfinder.classList.add('viewfinder');
        this.appendChild(this.viewfinder);

        this.quickBar = document.createElement('div');
        this.quickBar.classList.add('quickBar');
        this.appendChild(this.quickBar);
        for(let i=0;i<10;i++){
            const slot = document.createElement('div');
            slot.classList.add('slot');
            this.quickBar.appendChild(slot);
        }
    }
    refreshEquipment(equipment){
        for (let i=0;i<this.quickBar.childElementCount;i++) {
            this.quickBar.children[i].dataset.blockType = equipment[i]?.type??0;
            this.quickBar.children[i].textContent = equipment[i]?.count??0;
        }
    }
}
customElements.define('game-gui', GUI);
