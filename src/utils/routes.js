export const routes = {
  home_page: () => "/",
  forget_password: () => "/forget-password",
  reset_password: () => "/reset-password",
  registration: () => "/registration",
  merchant_list: () => "/merchant-list",



  //////////////   SUPER ADMIN     ///////////////
  admin_dashboard: () => "/admin/dashboard",
  admin_merchant_list: () => "/admin/merchant_list",




  ////////////    MERCHANT ADMIN    /////////////
  merchant_dashboard: () => "/merchant/dashboard",
  merchant_products: () => "/merchant/products",
  merchant_profile: () => "/merchant/profile",
  merchant_user_history: () => "/merchant/user_connected_history"
};
