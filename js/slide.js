import debounce from './debounce.js';

export class Slide {
  constructor(slide, wrapper) {
      this.slide = document.querySelector(slide);
      this.wrapper = document.querySelector(wrapper);
      this.dist = {
          finalPosition: 0,
          startX: 0,
          movement: 0
      };
      this.activeClass = 'active';
  }


  // Método para adicionar transição entre os slides
  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }


  // Movendo o slider de acordo com a quantidade de pixels do arrastar e soltar
  moveSlide(distX) {
    // Salvando a distancia que o slide se moveu
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }


  updatePosition(clientX) {
    // O movimento natural é calculado pelo arrastar e soltar do mouse,
    // portanto para uma melhor experiência vamos multiplicar esse movimento 
    // para melhor fluidez da interação do usuario com o slide
    this.dist.movement = (this.dist.startX - clientX)* 1.6;
    // O movimento do slide é o resultado da sua posição atual menos o movimento
    // de arrasta e solta do usuario
    return this.dist.finalPosition - this.dist.movement;
  }


  // O slide irá mudar com o clique e arrasta
  // Função que define quando o clique no slide começa, então 
  // adiciona o evento de mouse move
  onStart(event) {
    this.transition(false);
    let moveType;
    if (event.type === 'mousedown') {
        event.preventDefault();
        this.dist.startX = event.clientX;
        moveType = 'mousemove';
    } else {
        this.dist.startX = event.changedTouches[0].clientX;
        moveType = 'touchmove';

    }
    this.wrapper.addEventListener(moveType, this.onMove);
  }


  onMove(event) {
    // criando um ternario para extrair informacao da posicao final
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }


  // Quando o usuario soltar o clique do mouse, a função de arrasta é encerrada
  onEnd(event) {   
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'; 
    // Guardar o valor que o slide se moveu
    this.dist.finalPosition = this.dist.movePosition;
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.transition(true);
    this.changeSlideOnEnd();
  }


  // Ao clicar e arrastar, centralizar elemento do slide que tem o foco
  changeSlideOnEnd() {
    // Checa se o movimento foi para o próximo e se existe um proximo slide
    if (this.dist.movement > 120 && this.index.next !== false) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== false){
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // Evento de resize na janela que o slide está
  onResize() {
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 1000);
    
  }


  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  // Slides config
  // Metodo para calcular a posicao de um slide no centro da tela
  slidePosition(slide) {
    // Calcula o valor de margem que o objeto possui
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;

    // Retorna o valor exato que o objet precisa para ficar centralizado na tela.
    return -(slide.offsetLeft - margin);
  }


  slideConfig() {
    // Criando o array de slides com cada li dentro dele atraves da desestruturação
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element
      }
    });
  }


  // Criando metodo para navegacao pelos indices
  slidesIndexNav(index) {
    
    const last = this.slideArray.length - 1;

    this.index = {
      prev: index === 0 ? false : index-1,
      active: index,
      next: index === last ? false : index+1,
    };
  }


  // Método que controla o slide de acordo com o indice passado
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(this.slideArray[index].position);
    this.slidesIndexNav(index);

    // Atualizar a distancia do elemento do slide
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  } 


  changeActiveClass() {
    this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }


  activePrevSlide() {
    console.log(this.index);
    if (this.index.prev !== false)
      this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== false)
      this.changeSlide(this.index.next);
  }


  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slideConfig();
    this.addResizeEvent();
    this.changeSlide(0);

    return this;
  }

}


export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }
}