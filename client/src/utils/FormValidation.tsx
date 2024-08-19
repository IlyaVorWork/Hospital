export const passportSeriesRegex = new RegExp("^[0-9]{4}$");
export const passportNumberRegex = new RegExp("^[0-9]{6}$");
export const snilsRegex = new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}$");
export const fullNameRegex = new RegExp(
  "^[А-ЯЁ][а-яё]{1,29}\\s[А-ЯЁ][а-яё]{1,29}\\s[А-ЯЁ][а-яё]{1,29}$"
);
export const passwordRegex = new RegExp("^[a-zA-Z0-9!#$'()*+<=>?@]{5,}$");
export const cabinetNumberRegex = new RegExp("^[1-3][0-9]{2}$");
export const imgUrlRegex = new RegExp(
  "^https://i\\.ibb\\.co/3Nq70jd/.{1,}\\.png$"
);
