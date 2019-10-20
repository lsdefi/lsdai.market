const animate = (element, ...animationNames) => new Promise((resolve) => {
  const node = document.querySelector(element);
  const classes = ['animated', ...animationNames];

  const handleAnimationEnd = () => {
    node.classList.remove(...classes);
    node.removeEventListener('animationend', handleAnimationEnd);
    resolve();
  };

  node.classList.add(...classes);
  node.addEventListener('animationend', handleAnimationEnd);
});

export const animateIn = (element, ...animationNames) => {
  const node = document.querySelector(element);

  return new Promise((resolve) => {
    animate(element, ...animationNames).then(resolve);
    node.classList.remove('hidden');
  });
};

export const animateOut = (element, ...animationNames) => {
  const node = document.querySelector(element);

  return new Promise((resolve) => {
    animate(element, ...animationNames).then(() => {
      node.classList.add('hidden');
      resolve();
    });
  });
};

export const spin = (element, on = true) => {
  const node = document.querySelector(element);

  if (on) {
    node.classList.add('spin');
  } else {
    node.classList.remove('spin');
  }
};

export default animate;
