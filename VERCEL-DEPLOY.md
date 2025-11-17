# 🎯 Deploy na Vercel (Sem Controle Remoto)

## ⚠️ Importante

**Vercel não suporta WebSockets**, portanto o **controle remoto não funcionará**. 
A apresentação funcionará perfeitamente, mas você não poderá controlá-la pelo celular.

## ✅ Para usar controle remoto

Use uma dessas plataformas:
- **Railway** ⭐ (recomendado)
- **Render** 
- **Heroku**

## 🚀 Deploy na Vercel

### Opção 1: Via CLI
```bash
npm run build
npx vercel --prod
```

### Opção 2: Via Dashboard
1. Conecte repositório no dashboard da Vercel
2. Build Command: `npm run build`
3. Deploy automático

## 📝 O que funciona na Vercel

✅ **Apresentação completa**
✅ **Navegação por teclado**
✅ **Upload de arquivos .md**
✅ **Geração de slides por IA**
✅ **Editor de markdown**
✅ **Modo apresentador**
✅ **Download de slides**
✅ **Todas as funcionalidades de apresentação**

## ❌ O que NÃO funciona na Vercel

❌ **Botão QR Code**
❌ **Controle remoto por celular**
❌ **WebSocket em tempo real**

## 🎮 Alternativa para controle remoto

Se precisar do controle remoto, faça deploy adicional no Railway:

1. **Vercel**: Para speed/performance (apresentação)
2. **Railway**: Para controle remoto (recurso completo)

## 🔧 Configuração automática

O sistema detecta automaticamente que está na Vercel e:
- ✅ Desabilita botão QR Code
- ✅ Mostra mensagem explicativa 
- ✅ Funciona normalmente para apresentação

---

**💡 Recomendação**: Para experiência completa, use Railway que suporta WebSockets gratuitamente!