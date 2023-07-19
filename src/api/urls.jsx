export const urlBase = "http://localhost:43888";
export const urlLogin = "https://vault-qa.gbm.net";

export default {
  SIGNIN: {
    auth: `${urlBase}/auth`,
    protected: `${urlBase}/protected`,
    signOut: `${urlBase}/auth/sign-out`,
    generateSignature: `${urlBase}/auth/signature`,
    getSession: `${urlLogin}/vault/find-session-by-uuid`,
    // getUrlCisco: `${urlLogin}/authenticate/ss`,
  },

  MASTERDATA: {
    newmasterdata: `${urlBase}/master-data/new-masterdata`,
    options: `${urlBase}/master-data/options`,
  },

  PRODUCTION: {
    registerProductionProducts: `${urlBase}/production/register-production-products`,
  },

  BILLING: {
    newpurchaseorder: `${urlBase}/billing/new-purchase-order`,
    newbilling: `${urlBase}/billing/new-billing`,
    newdeleteorder: `${urlBase}/billing/new-delete-order`,
    todeleteorder: `${urlBase}/billing/to-delete-order`,
    getbillings: `${urlBase}/billing/get-billings`,
    getpaymenthistory: `${urlBase}/billing/get-payment-history`,



  },

};