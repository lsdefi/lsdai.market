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

export default animate;
