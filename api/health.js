export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Apresentação funcionando (Vercel - sem controle remoto)',
    platform: 'vercel',
    websockets: false,
    timestamp: new Date().toISOString()
  });
}