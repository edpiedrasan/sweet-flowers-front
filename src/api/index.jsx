// Promise based HTTP client for the browser and node.js
import axios from "axios";

const instance = axios.create();

export const get = (url) => () =>
  instance
    .get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Platform: "SS",
      },
    })
    .then((response) => {
      return response;
    })
    .catch(async (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 403 || error.response.status === 401) {
          setTimeout(() => {
            // console.log("Pa Fuera")
            localStorage.clear();
            window.location.reload();
          }, 3000);
        }
      }
      return error;
    });

export const post = (url, body) => () =>
  instance
    .post(url, body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Platform: "SS",
      },
    })
    .then((response) => {
      // console.log("aqui resou
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (
          (error.response.status === 403 || error.response.status === 401) &&
          window.location.pathname !== "/"
        ) {
          // console.log(window.location.pathname)
          setTimeout(() => {
            // console.log("Pa Fuera")
            localStorage.clear();
            window.location.reload();
          }, 3000);
        }
      }
      return error;
    });

export const put = (url, body) => () =>
  instance
    .put(url, body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Platform: "SS",
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 403 || error.response.status === 401) {
          setTimeout(() => {
            // console.log("Pa Fuera")
            localStorage.clear();
            window.location.reload();
          }, 3000);
        }
      }
      return error;
    });

export const del = (url) => () =>
  instance
    .delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Platform: "SS",
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 403 || error.response.status === 401) {
          setTimeout(() => {
            // console.log("Pa Fuera")
            localStorage.clear();
            window.location.reload();
          }, 3000);
        }
      }
      return error;
    });

// export const fileUpload = (url, body) => () =>
//   instance
//     .put(url, body, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//         "Content-Type": "multipart/form-data",
//       },
//     })
//     .then((response) => {
//       return response;
//     })
//     .catch((error) => {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         if (error.response.status === 403 || error.response.status === 401) {
//           setTimeout(() => {
//             // console.log("Pa Fuera")
//             localStorage.clear();
//             window.location.reload();
//           }, 3000);
//         }
//       }
//       return error;
//     });

// export const fileDownload = (url) => () =>
//   instance
//     .get(url, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       responseType: "blob",
//     })
//     .then((response) => {
//       return response;
//     })
//     .catch(async (error) => {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         if (error.response.status === 403 || error.response.status === 401) {
//           setTimeout(() => {
//             // console.log("Pa Fuera")
//             localStorage.clear();
//             window.location.reload();
//           }, 3000);
//         }
//       }
//       return error;
//     });

// export const downloadDataTables = (url, body) => () =>
//   instance
//     .post(url, body, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       responseType: "blob",
//     })
//     .then((response) => {
//       return response;
//     })
//     .catch(async (error) => {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         if (error.response.status === 403 || error.response.status === 401) {
//           setTimeout(() => {
//             // console.log("Pa Fuera")
//             localStorage.clear();
//             window.location.reload();
//           }, 3000);
//         }
//       }
//       return error;
//     });
