import { createAction } from 'redux-actions';
import urls from "api/urls.jsx";
// import * as constants from "constants/index.jsx";
import * as method from "api/index.jsx";


export const newPurchaseOrder =  (props) => method.post(urls.BILLING.newpurchaseorder, props)();

export const newBilling =  (props) => method.post(urls.BILLING.newbilling, props)();

//Este es para la order de eliminar
export const newDeleteOrder =  (props) => method.post(urls.BILLING.newdeleteorder, props)();

//Este es para eliminar una orden de compra 
export const toDeleteOrder =  (props) => method.post(urls.BILLING.todeleteorder, props)();

//Este es para eliminar una orden de compra 
// export const getBillings =  () => method.get(urls.BILLING.getbillings)();
export const getBillings =  (props) => method.post(urls.BILLING.getbillings, props)();

export const getPaymentHistory =  (props) => method.post(urls.BILLING.getpaymenthistory, props)();

//Este es para realizar un pago en una factura
export const payBilling =  (props) => method.post(urls.BILLING.paybilling, props)();



