export default function checkForm(fields) {
  let isValid = true;

  for (const field of fields) {
    if (!field || field.trim() === '') {
      isValid = false;
    }
  }

  return isValid;
}
