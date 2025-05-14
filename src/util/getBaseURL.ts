/* eslint-disable import/prefer-default-export */

export const getBaseURL = () =>
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.docubot.app/';

// export default getBaseURL;
