import uuid from 'uuid/v4';
import { store } from 'react-notifications-component';

const defaults = {
  insert: 'top',
  type: 'success',
  container: 'top-center',
  animationIn: ['animated', 'fadeIn'],
  animationOut: ['animated', 'fadeOut'],
  dismiss: {
    duration: 3000,
  },
};

const notify = (options) => new Promise((resolve) => {
  const config = {
    id: uuid(),
    onRemoval: () => resolve(),

    ...defaults,
    ...options,
  };

  if (options.dismiss) {
    const { dismiss } = defaults;
    config.dismiss = { ...dismiss, ...options.dismiss };
  }

  store.addNotification(config);
});

export default notify;
