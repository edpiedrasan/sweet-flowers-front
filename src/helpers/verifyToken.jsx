import jwt from 'jwt-decode' // import dependency
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
// import * as constants from "constants/index.jsx";




export const verifyToken = () => {
  //#region Mensajes de notificaciones
  const MySwal = withReactContent(Swal);
  // const Toast = MySwal.mixin({
  //   toast: true,
  //   position: 'bottom-right',
  //   showConfirmButton: true,
  //   timer: 5000,
  //   didOpen: toast => {
  //     toast.addEventListener('mouseenter', Swal.stopTimer)
  //     toast.addEventListener('mouseleave', Swal.resumeTimer)
  //   }
  // });
  //#endregion

  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  try {
    const { exp } = jwt(token);

    let quantityWaitingMinutes = 30;

    let lapseHour = parseInt((exp * 1000) / 1000 / 60) - (1440 - quantityWaitingMinutes);
    let dateNowHour = parseInt(Date.now() / 1000 / 60)

    let diference = lapseHour - dateNowHour;

    if (dateNowHour >= lapseHour) {
      const Toast = MySwal.mixin({
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        timer: 5000
      });
      Toast.fire({
        type: 'warning',
        title: `¡La sesión ha expirado!`,
      });

      localStorage.clear();



      return false;
    } else {
      return true;
    }
  } catch (err) {
    const Toast = MySwal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000
    });
    Toast.fire({
      type: 'warning',
      title: `¡La sesión ha expirado!`,
    });

    localStorage.clear();

    return false;
  }
}
