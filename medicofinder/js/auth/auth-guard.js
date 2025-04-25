const auth = firebase.auth();

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("You must be logged in to access this page.");
    window.location.href = "provider-login.html";
  }
});
