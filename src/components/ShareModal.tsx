/**
 * @fileoverview Modal de compartilhamento de apresentações
 */

import { useState, useEffect } from 'react';
import {
    Share2,
    Link,
    Code,
    Copy,
    Check,
    RefreshCw,
    Globe,
    Lock,
    Eye,
    X,
    Loader2,
} from 'lucide-react';
import { useTheme } from '../stores/useThemeStore';
import { shareService, type ShareSettings } from '../services/share/shareService';
import { Button } from '../shared/components/ui/button';
import { toast } from 'sonner';

interface ShareModalProps {
    presentationId: number;
    presentationTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ShareModal({ presentationId, presentationTitle, isOpen, onClose }: ShareModalProps) {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<ShareSettings | null>(null);
    const [copied, setCopied] = useState<'link' | 'embed' | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen, presentationId]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await shareService.getShareSettings(presentationId);
            setSettings(data);
        } catch (error) {
            toast.error('Erro ao carregar configurações');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSharing = async () => {
        if (!settings) return;

        try {
            setSaving(true);
            if (settings.is_public) {
                await shareService.disableSharing(presentationId);
                setSettings({ ...settings, is_public: false, share_url: null });
                toast.success('Compartilhamento desabilitado');
            } else {
                const result = await shareService.enableSharing(presentationId, settings.allow_embed);
                setSettings({
                    ...settings,
                    is_public: true,
                    share_url: result.share_url,
                    share_token: result.share_token,
                    embed_code: result.embed_code,
                });
                toast.success('Compartilhamento habilitado!');
            }
        } catch (error) {
            toast.error('Erro ao alterar compartilhamento');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEmbed = async () => {
        if (!settings) return;

        try {
            setSaving(true);
            const result = await shareService.updateSettings(presentationId, !settings.allow_embed);
            setSettings({
                ...settings,
                allow_embed: !settings.allow_embed,
                embed_code: result.embed_code,
            });
            toast.success('Configuração atualizada!');
        } catch (error) {
            toast.error('Erro ao atualizar configuração');
        } finally {
            setSaving(false);
        }
    };

    const handleRegenerateToken = async () => {
        try {
            setSaving(true);
            const result = await shareService.regenerateToken(presentationId);
            setSettings({
                ...settings!,
                share_url: result.share_url,
                share_token: result.share_token,
                embed_code: result.embed_code,
            });
            toast.success('Link regenerado!');
        } catch (error) {
            toast.error('Erro ao regenerar link');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = async (text: string, type: 'link' | 'embed') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
            toast.success('Copiado!');
        } catch {
            toast.error('Erro ao copiar');
        }
    };

    const colors = {
        bg: isDark ? 'bg-slate-900' : 'bg-white',
        border: isDark ? 'border-slate-700' : 'border-slate-200',
        text: isDark ? 'text-white' : 'text-slate-900',
        textMuted: isDark ? 'text-slate-400' : 'text-slate-600',
        inputBg: isDark ? 'bg-slate-800' : 'bg-slate-100',
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-lg rounded-2xl border ${colors.border} ${colors.bg} shadow-2xl overflow-hidden`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${colors.border}`}>
                    <div className="flex items-center gap-3">
                        <Share2 className="text-blue-500" size={20} />
                        <div>
                            <h2 className={`font-semibold ${colors.text}`}>Compartilhar</h2>
                            <p className={`text-sm ${colors.textMuted} truncate max-w-[300px]`}>
                                {presentationTitle}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg hover:bg-slate-800/50 transition-colors`}
                    >
                        <X size={20} className={colors.textMuted} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : settings ? (
                        <>
                            {/* Toggle Compartilhamento */}
                            <div className={`flex items-center justify-between p-4 rounded-xl ${colors.inputBg}`}>
                                <div className="flex items-center gap-3">
                                    {settings.is_public ? (
                                        <Globe className="text-green-500" size={20} />
                                    ) : (
                                        <Lock className={colors.textMuted} size={20} />
                                    )}
                                    <div>
                                        <p className={`font-medium ${colors.text}`}>
                                            {settings.is_public ? 'Público' : 'Privado'}
                                        </p>
                                        <p className={`text-sm ${colors.textMuted}`}>
                                            {settings.is_public
                                                ? 'Qualquer pessoa com o link pode ver'
                                                : 'Apenas você pode ver'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleSharing}
                                    disabled={saving}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                        settings.is_public ? 'bg-green-500' : 'bg-slate-600'
                                    }`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                        settings.is_public ? 'left-7' : 'left-1'
                                    }`} />
                                </button>
                            </div>

                            {/* Link de Compartilhamento */}
                            {settings.is_public && settings.share_url && (
                                <div className="space-y-3">
                                    <label className={`text-sm font-medium ${colors.text}`}>
                                        <Link size={14} className="inline mr-2" />
                                        Link de Compartilhamento
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={settings.share_url}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm ${colors.inputBg} ${colors.text} border ${colors.border}`}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => copyToClipboard(settings.share_url!, 'link')}
                                        >
                                            {copied === 'link' ? <Check size={16} /> : <Copy size={16} />}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleRegenerateToken}
                                            disabled={saving}
                                        >
                                            <RefreshCw size={16} className={saving ? 'animate-spin' : ''} />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Toggle Embed */}
                            {settings.is_public && (
                                <div className={`flex items-center justify-between p-4 rounded-xl ${colors.inputBg}`}>
                                    <div className="flex items-center gap-3">
                                        <Code className={colors.textMuted} size={20} />
                                        <div>
                                            <p className={`font-medium ${colors.text}`}>Permitir Embed</p>
                                            <p className={`text-sm ${colors.textMuted}`}>
                                                Incorporar em outros sites
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleToggleEmbed}
                                        disabled={saving}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            settings.allow_embed ? 'bg-blue-500' : 'bg-slate-600'
                                        }`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                            settings.allow_embed ? 'left-7' : 'left-1'
                                        }`} />
                                    </button>
                                </div>
                            )}

                            {/* Código Embed */}
                            {settings.is_public && settings.allow_embed && settings.embed_code && (
                                <div className="space-y-3">
                                    <label className={`text-sm font-medium ${colors.text}`}>
                                        <Code size={14} className="inline mr-2" />
                                        Código Embed
                                    </label>
                                    <div className="relative">
                                        <pre className={`p-3 rounded-lg text-xs overflow-x-auto ${colors.inputBg} ${colors.text} border ${colors.border}`}>
                                            {settings.embed_code}
                                        </pre>
                                        <Button
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => copyToClipboard(settings.embed_code!, 'embed')}
                                        >
                                            {copied === 'embed' ? <Check size={14} /> : <Copy size={14} />}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Estatísticas */}
                            {settings.is_public && (
                                <div className={`flex items-center gap-4 p-4 rounded-xl ${colors.inputBg}`}>
                                    <Eye className={colors.textMuted} size={20} />
                                    <div>
                                        <p className={`font-medium ${colors.text}`}>
                                            {settings.view_count} visualizações
                                        </p>
                                        {settings.shared_at && (
                                            <p className={`text-sm ${colors.textMuted}`}>
                                                Compartilhado em {new Date(settings.shared_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className={colors.textMuted}>Erro ao carregar configurações</p>
                    )}
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t ${colors.border} flex justify-end`}>
                    <Button variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
}

