export function isEmailInvalid(email: string) {
  if (email == "") {
    return "Email is required";
  }
  if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  ) {
    return "Invalid Email";
  }
  return "";
}

export function isPasswordInvalid(password: string) {
  if (password == "") {
    return "Password is required";
  }
  if (password.includes(" ")) {
    return "Password cannot contain spaces";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
}
