export function generateSlug(text: string): string {
  return text 
  .normalize("NFD") //normalizacao, separa o caracter do acento
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "-")
};