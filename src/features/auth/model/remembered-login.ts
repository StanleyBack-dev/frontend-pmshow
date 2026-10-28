// "Lembrar meu usuário": the login (never the password) kept on this browser
// after a successful sign-in, to fill the field next time.
const REMEMBERED_LOGIN_KEY = "pms:remembered-login";

export function rememberedLogin(): string | null {
  try {
    return window.localStorage.getItem(REMEMBERED_LOGIN_KEY);
  } catch {
    // Storage blocked: the field just starts empty.
    return null;
  }
}

/** Keeps `login` for next time, or forgets it (`null`). */
export function rememberLogin(login: string | null) {
  try {
    if (login) window.localStorage.setItem(REMEMBERED_LOGIN_KEY, login);
    else window.localStorage.removeItem(REMEMBERED_LOGIN_KEY);
  } catch {
    // Nothing to remember it with.
  }
}
