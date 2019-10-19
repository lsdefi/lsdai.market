const animate = (element, animationName) => {
  let handleAnimationEnd;

  handleAnimationEnd = () => {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);
    resolve();
  };

  return new Promise((resolve) => {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName);
    node.addEventListener('animationend', handleAnimationEnd);
  });
};

export default animate;
