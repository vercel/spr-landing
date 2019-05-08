import { useState, useEffect } from 'react';

export default () => {
  const [state, setState] = useState(null);
  const onFocusEvent = event => {
    setState(true);
  };
  const onBlurEvent = event => {
    setState(false);
  };
  useEffect(() => {
    window.addEventListener('focus', onFocusEvent);
    window.addEventListener('blur', onBlurEvent);
    return () => {
      window.removeEventListener('focus', onFocusEvent);
      window.removeEventListener('blur', onBlurEvent);
    };
  });
  return state;
};
