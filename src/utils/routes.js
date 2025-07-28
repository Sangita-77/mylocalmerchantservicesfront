export const routes = {
  home_page: () => "/",
  forget_password: () => "/forget-password",
  reset_password: () => "/reset-password",
  msr_registration: () => "/merchant-service-providers-registration",
  user_registration: () => "/merchant-registration",
  merchant_list: () => "/merchant-service-providers",
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
  merchant_user_history: () => "/merchant/user_connected_history",


  ///////////   PROVIDERS ADMIN  ///////////////  

  provider_dashboard: () => "/provider/dashboard",
  provider_profile: () => "/provider/profile",
  provider_connectec_history: () => "/provider/connected_history"

  
};
