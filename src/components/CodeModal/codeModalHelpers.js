export const displayCode = (code) => `Код: ${code}`;
export const displayEmail = (email) => `Электронная почта: ${email}`;
export const displaySelectedCodes = (numSelectedCodes) => `Выбранные коды: ${numSelectedCodes}`;

export function appendUserCodeDetails(assignedEmail, assignedCode, assignments) {
  assignments.push({
    user: {
      email: assignedEmail,
    },
    code: assignedCode,
  });
  return assignments;
}
