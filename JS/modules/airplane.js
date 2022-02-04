import { setStorage, getStorage } from "../Service/storage.js";
import createElement from "./createElement.js";

const createCockpit = (titleText) => {
  const cockpit = createElement('div', {
    className: 'cockpit',
  });

  const title = createElement('h1', {
    className: 'cockpit-title',
    textContent: titleText,
  });

  const button = createElement('button', {
    className: 'cockpit-confirm',
    type: 'submit',
    textContent: 'Подтвердить',
    disabled: true,
  });

  cockpit.append(title, button);

  return cockpit;
  };

const createExit = () => {
  const fuselage = createElement('div', {
    className: 'fuselage exit'
  }); 

  return fuselage;
};

const createBlockSeat = (n, count, bookingSeat) => {
  const letters = ['A', 'B', 'C', 'D', "E", 'F'];

  const fuselage = createElement('ol', {
    className: 'fuselage',
  });

  for (let i = n; i < count + n; i++) {
    const wrapperRow = createElement('li');
    const seats = createElement('ol', {
      className: 'seats'
    });

    const seatsRow = letters.map(letter => {
      const seat = createElement('li', {
        className: 'seat',
      });

      const wrapperCheck = createElement('label');
      const seatValue = `${i}${letter}`
      const check = createElement('input', {
        name: 'seat',
        type: 'checkbox',
        value: seatValue,
        disabled: bookingSeat.includes(seatValue),


      });
      
      wrapperCheck.append(check);
      seat.append(wrapperCheck);
      return seat;
    })

    seats.append(...seatsRow);

    wrapperRow.append(seats);

    fuselage.append(wrapperRow);
  }
  return fuselage;
};

const createAirplane = (title, tourData) => {
  const scheme = tourData.scheme;
  const bookingSeat = getStorage(tourData.id).map(item => item.seat)
  const choisesSeat = createElement('form', {
    className: 'choises-seat',
  }); 

  const plane = createElement('fieldset', {
    className: 'plane',
    name: 'plane',
  });

  const cockpit = createCockpit(title);

  let n = 1;


  const elements = scheme.map((type) => {
    if (type === 'exit') {
      return createExit();
    }

    if(typeof type === 'number') {
      const blockSeat = createBlockSeat(n, type, bookingSeat);
      n = n + type;

      return blockSeat;
    }
  });

  plane.append(cockpit, ...elements);
  choisesSeat.append(plane);

  return choisesSeat;
};

const checkSeat = (form, data, main, id) => {
  form.addEventListener('change', () => {
    const formData = new FormData(form);
    const checked = [...formData].map(([, value]) => value);
    if (checked.length === data.length) {
      [...form].forEach(item => {
      if (item.checked === false && item.name === 'seat') {
        item.disabled = true;
      }
    }) 
    const okBtn = document.querySelector('.cockpit-confirm');
    okBtn.disabled = false;
    } else [...form].forEach(item => {
        item.disabled = false;
    })
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const booking = [...formData].map(([, value]) => value);

    for(let i = 0; i < data.length; i++) {
      data[i].seat = booking[i];
    }
    
    setStorage(id, data);

    form.remove();



    const resultSingle = createElement('h1', {
      className: 'title',
      textContent: `Спасибо хорошего полёта!`
    
    });
    const resultMulti = createElement('h2', {
      className: 'title',
      textContent: `${booking.length === 1 ? 
        `Ваше место ${booking}` : `Ваши места: ${[...booking]}`}`
    })
    main.append(resultSingle, resultMulti);
    
  });
  
};

const airplane = (main, data, tourData) => {
  let title = '';
  if (data.length === 1) {
    title = 'Выберите 1 место';
  } else if (data.length > 1 && data.length <5) {
    title = `Выберите ${data.length} места`;
  } else {`Выберите ${data.length} мест`
  };

  const choiseForm = createAirplane(title, tourData);
  main.append(choiseForm);
  checkSeat(choiseForm, data, main, tourData.id);
  

};

export default airplane;
