export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
    }
    // O slide irá mudar com o clique e arrasta
    // Função que define quando o clique no slide começa, então 
    // adiciona o evento de mouse move
    onStart(event) {
        event.preventDefault();
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onMove(event) {

    }

    // Quando o usuario soltar o clique do mouse, a função de arrasta é encerrada
    onEnd(event) {        
        this.wrapper.removeEventListener('mousemove', this.onMove);
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onMove = this.onMove.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
    }

}