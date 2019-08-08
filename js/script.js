import Slide from './slide.js';

const slide = new Slide('.slide', '.slide-wrapper');
slide.init();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function demo() {
  await sleep(1500);
  slide.activeNextSlide();
  await sleep(1500);
  slide.activeNextSlide();
  await sleep(1500);
  slide.activeNextSlide();
  await sleep(1500);
  slide.activeNextSlide();
}

