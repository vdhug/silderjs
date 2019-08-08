import {SlideNav} from './slide.js';

const slideNav = new SlideNav('.slide', '.slide-wrapper');
slideNav.init();
slideNav.addArrow('.prev', '.next');



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

