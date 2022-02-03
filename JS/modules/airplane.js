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

const createBlockSeat = (n, count) => {
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

      const check = createElement('input', {
        name: 'seat',
        type: 'checkbox',
        value: `${i}${letter}`,

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
      const blockSeat = createBlockSeat(n, type);
      n = n + type;

      return blockSeat;
    }
  });

  plane.append(cockpit, ...elements);
  choisesSeat.append(plane);

  return choisesSeat;
};

const checkSeat = (form, data, main) => {
  form.addEventListener('change', () => {
    const formData = new FormData(form);
    const checked = [...formData].map(([, value]) => value);
    if (checked.length === data.length) {
      [...form].forEach(item => {
      if (item.checked === false && item.name === 'seat') {
        item.disabled = true;
      }
    })
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
    console.log('data: ', data);
    form.remove();
    const result = createElement('p', {
      textContent: `Спасибо хорошего полёта, ваши места ${[...booking]}`
    });
    console.log(result);
    main.append(result);
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
  const result = checkSeat(choiseForm, data, main);
  

};

export default airplane;
