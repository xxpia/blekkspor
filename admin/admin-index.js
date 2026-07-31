/*==============================================================================
    INNLOGGING
==============================================================================*/

const loginForm = document.querySelector("#login-form");
const passwordInput = document.querySelector("#password");
const loginStatus = document.querySelector("#login-status");


if (loginForm && passwordInput && loginStatus) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const enteredPassword = passwordInput.value;


        if (enteredPassword === ADMIN_PASSWORD) {

            sessionStorage.setItem("admin", "true");

            window.location.href = "admin-dashboard.html";

        } else {

            loginStatus.textContent = "Feil administratorkode.";

            passwordInput.value = "";
            passwordInput.focus();

        }

    });

}