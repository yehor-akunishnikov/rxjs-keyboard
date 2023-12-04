import './style.css';

import { fromEvent, map, tap } from 'rxjs';

const btnContainer = document.querySelector('#btn-container');
const resultDisplayContainer = document.querySelector('#result-display');

const renderButtons = (word) => {
  const lettersMap = {};

  word.split('').forEach((letter) => {
    if (lettersMap[letter]) {
      lettersMap[letter]++;
    } else {
      lettersMap[letter] = 1;
    }
  });

  const buttons = Object.keys(lettersMap).map((letter) => {
    const button = document.createElement('button');
    const counter = document.createElement('span');
    const count = lettersMap[letter];

    if (count > 1) {
      counter.classList.add('letter-counter');
      counter.innerText = count;
    }

    button.classList.add('letter-btn');
    button.setAttribute('data-letter', letter);
    button.setAttribute('data-letter-count', count);
    button.innerText = letter;

    if (count > 1) {
      button.append(counter);
    }

    return button;
  });

  btnContainer.append(...buttons);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const renderResultDisplay = (word) => {
  const boxes = word.split('').map((letter) => {
    const box = document.createElement('span');
    box.classList.add('result-box');

    return box;
  });

  resultDisplayContainer.append(...boxes);
};

const start = (word) => {
  const shuffledWord = word.split('');

  shuffleArray(shuffledWord);

  renderButtons(shuffledWord.join(''));
  renderResultDisplay(word);

  const clicksStream = fromEvent(btnContainer, 'click').pipe(
    tap((event: any) => {
      const currentCount = event.target.getAttribute('data-letter-count');

      if (currentCount > 0) {
        event.target.setAttribute('data-letter-count', currentCount - 1);
      }
    }),
    map((event: any) => ({
      letter: event.target.getAttribute('data-letter'),
      count: event.target.getAttribute('data-letter-count'),
    }))
  );

  clicksStream.subscribe(console.log);
};

start('banana');
