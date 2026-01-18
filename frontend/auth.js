/* ================= AUTH CORE ================= */

function isLoggedIn() {
  return !!sessionStorage.getItem("token");
}

function requireAuthLink(event, targetPage) {
  if (!isLoggedIn()) {
    event.preventDefault();
    sessionStorage.setItem("redirectAfterAuth", targetPage);
    location.href = "login.html";
    return false;
  }
  return true;
}

function protectPage() {
  if (!isLoggedIn()) {
    sessionStorage.setItem(
      "redirectAfterAuth",
      location.pathname.split("/").pop()
    );
    location.replace("login.html");
  }
}

function setupNavbarAuth() {
  const signupNav = document.getElementById("signupNav");
  const dashboardNav = document.getElementById("dashboardNav");
  const logoutNav = document.getElementById("logoutNav");
  const logoutBtn = document.getElementById("logoutBtn");

  if (isLoggedIn()) {
    signupNav?.remove();
    dashboardNav && (dashboardNav.style.display = "block");
    logoutNav && (logoutNav.style.display = "block");
  }

  logoutBtn?.addEventListener("click", () => {
    sessionStorage.clear();
    location.replace("home.html");
  });
}
function saveRedirectIfNotAuth() {
  if (!sessionStorage.getItem("token")) {
    const page = location.pathname.split("/").pop();
    sessionStorage.setItem("redirectAfterAuth", page);
  }
}
function logout() {
  sessionStorage.clear();
  location.replace("home.html");
}
