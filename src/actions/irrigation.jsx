import urls from "api/urls.jsx";
import * as method from "api/index.jsx";
import axios from "axios";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Platform: "SS",
});

export const getSchedules = () => method.get(urls.IRRIGATION.getSchedules)();

export const createSchedule = (props) => method.post(urls.IRRIGATION.createSchedule, props)();

export const updateSchedule = (id, props) => method.put(urls.IRRIGATION.updateSchedule(id), props)();

export const deleteSchedule = (id) => method.del(urls.IRRIGATION.deleteSchedule(id))();

export const toggleSchedule = (id, enabled) => method.put(urls.IRRIGATION.toggleSchedule(id), { enabled })();

export const getLogs = (limit = 50, offset = 0) =>
  method.get(`${urls.IRRIGATION.getLogs}?limit=${limit}&offset=${offset}`)();

export const getGpioStatus = () => method.get(urls.IRRIGATION.getGpioStatus)();

export const toggleGpio = (id, turn, gpio_label) =>
  method.post(urls.IRRIGATION.toggleGpio(id), { turn, gpio_label })();
