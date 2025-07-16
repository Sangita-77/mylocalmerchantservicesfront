export const routes = {
  home_page: () => "/",
  forget_password: () => "/forget-password",
  reset_password: () => "/reset-password",
  registration: () => "/registration",
  merchant_list: () => "/merchant-list",
  contact: () => "/contact",



  //////////////   SUPER ADMIN     ///////////////
  admin_dashboard: () => "/admin/dashboard",
  admin_profile: () => "/admin/profile",
  // admin_merchant_list: () => "/admin/merchant_list",
  admin_user_list: () => "/admin/user_list",
  admin_user_connect: () => "/admin/connect",
  admin_merchant_list: () => "/admin/admin-merchant-list",
  admin_contact: () => "/admin/contact",
  admin_agent: () => "/admin/admin-agent",
  admin_iso: () => "/admin/agent-iso",
  admin_processor: () => "/admin/agent-processor",




  ////////////    MERCHANT ADMIN    /////////////
  merchant_dashboard: () => "/merchant/dashboard",
  merchant_products: () => "/merchant/products",
  merchant_profile: () => "/merchant/profile",
  merchant_user_history: () => "/merchant/user_connected_history"
};
