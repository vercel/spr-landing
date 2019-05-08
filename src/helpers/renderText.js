import { createElement, Fragment } from 'react';

export default title => {
  return title.map((chunk, i) => {
    let wrapper = <span>{chunk[0]}</span>;

    (chunk[1] || []).forEach(el => {
      wrapper = createElement(el[0], {}, wrapper);
    });

    return <Fragment key={i}>{wrapper}</Fragment>;
  });
};
