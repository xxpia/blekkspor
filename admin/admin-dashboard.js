/*==============================================================================
    TILGANG
==============================================================================*/

if (sessionStorage.getItem("admin") !== "true") {
    window.location.href = "admin-index.html";
}


/*==============================================================================
    LOGG UT
==============================================================================*/

const logoutButtons = document.querySelectorAll(
    "#logout-button, #dashboard-logout-button"
);

logoutButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        sessionStorage.removeItem("admin");

        window.location.href = "admin-index.html";

    });

});