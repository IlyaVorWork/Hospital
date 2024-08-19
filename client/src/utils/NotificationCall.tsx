import { Store } from "react-notifications-component";

export const CallSuccessNotification = (message: string) => {
  Store.addNotification({
    title: "Успех",
    message: message,
    insert: "top",
    container: "bottom-right",
    type: "info",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export const CallErrorNotification = (message: string) => {
  console.log("Ошибка");
  Store.addNotification({
    title: "Ошибка",
    message: message,
    insert: "top",
    container: "bottom-right",
    type: "danger",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};
