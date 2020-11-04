var LOGO = 'https://out-sorcerer.vercel.app/logo.png';

const boardButtons = {
  'board-buttons': async function (t, options) {
    return [
      {
        icon: {
          dark: LOGO,
          light: LOGO
        },
        text: 'OS Market',
        callback: function (t, opt) {
          t.modal({
            url: 'https://out-sorcerer.vercel.app/market',
            fullscreen: true,
            callback: function (t, opt) {
              console.log('modal closed');
              // t.closeModal();
            }
          });
        }
      }
    ];
  }
};

export default boardButtons;
