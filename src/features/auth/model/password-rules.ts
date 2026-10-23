// Mirrors the API's password policy for instant feedback; the API decides.
export const PASSWORD_HINT =
  "Mínimo de 8 caracteres, com letras e números, sem conter o seu usuário.";

export function passwordProblem(
  password: string,
  confirmation: string,
): string | null {
  if (password.length < 8)
    return "A senha precisa ter pelo menos 8 caracteres.";
  if (!/\p{L}/u.test(password) || !/\d/.test(password)) {
    return "Use letras e números na senha.";
  }
  if (password !== confirmation) return "As senhas não conferem.";
  return null;
}
