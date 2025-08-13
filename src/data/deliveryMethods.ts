// src/data/deliveryMethods.ts

import { DeliveryMethod } from "../types/product";

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "russianpost",
    name: "Почта РФ",
    description: "Доставка Почтой России",
    price: 0,
    estimatedDays: "",
    icon: "mail"
  },
  {
    id: "cdek",
    name: "СДЭК",
    description: "Доставка курьерской службой СДЭК",
    price: 0,
    estimatedDays: "",
    icon: "truck"
  },
  {
    id: "wb",
    name: "В ПВЗ WB",
    description: "Самовывоз из пункта выдачи Wildberries",
    price: 0,
    estimatedDays: "",
    icon: "map-pin"
  }
];
