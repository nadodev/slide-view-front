// Utility: generateSlug
export function generateSlug(text: string | null | undefined): string {
  return String(text || '')
    // Normaliza acentos: "ç" => "c", "ã" => "a" etc.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    // Mantém letras, números, espaços e hífens; remove o resto
    .replace(/[^a-z0-9\s-]/g, '')
    // Converte espaços em hífen
    .replace(/\s+/g, '-')
    // Colapsa hífens repetidos
    .replace(/-+/g, '-')
    // Remove hífens nas bordas
    .replace(/^-|-$/g, '');
}

export default generateSlug;
