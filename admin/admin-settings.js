/*==============================================================================
    ADMINKONTROLL
==============================================================================*/

if (passwordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem("admin", "true");
    window.location.href = "admin-dashboard.html";
}