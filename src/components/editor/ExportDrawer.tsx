import React from 'react';
import { FileText, Code, Table, Download } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '../../shared/components/ui/drawer';
import { Button } from '../../shared/components/ui/button';

type ExportDrawerProps = {
    show: boolean;
    onClose: () => void;
    onExportMarkdown: () => void;
    onExportHTML: () => void;
    onExportPDF: () => void;
    onExportTXT: () => void;
    onExportXLS: () => void;
};

export const ExportDrawer: React.FC<ExportDrawerProps> = ({
    show,
    onClose,
    onExportMarkdown,
    onExportHTML,
    onExportPDF,
    onExportTXT,
    onExportXLS,
}) => {
    return (
        <Drawer open={show} onOpenChange={onClose}>
            <DrawerTrigger asChild>
                <button
                    className="group px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/50"
                    title="Exportar"
                >
                    <Download
                        size={16}
                        className="transition-transform group-hover:scale-110"
                    />
                    <span className="text-sm font-medium">Exportar</span>
                </button>
            </DrawerTrigger>
            <DrawerContent side="right" className="bg-slate-900 border-slate-700">
                <DrawerHeader>
                    <DrawerTitle className="text-white text-xl font-bold">
                        Exportar Conteúdo
                    </DrawerTitle>
                    <DrawerDescription className="text-slate-400">
                        Escolha o formato para exportar seu conteúdo
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-6 py-4 space-y-3">
                    <ExportOption
                        icon={FileText}
                        title="Markdown (.md)"
                        description="Exportar como arquivo Markdown"
                        color="blue"
                        onClick={() => {
                            onExportMarkdown();
                            onClose();
                        }}
                    />
                    <ExportOption
                        icon={Code}
                        title="HTML (.html)"
                        description="Exportar como página HTML"
                        color="green"
                        onClick={() => {
                            onExportHTML();
                            onClose();
                        }}
                    />
                    <ExportOption
                        icon={FileText}
                        title="PDF (.pdf)"
                        description="Exportar como PDF (usa impressão do navegador)"
                        color="red"
                        onClick={() => {
                            onExportPDF();
                            onClose();
                        }}
                    />
                    <ExportOption
                        icon={FileText}
                        title="Texto (.txt)"
                        description="Exportar como texto simples"
                        color="yellow"
                        onClick={() => {
                            onExportTXT();
                            onClose();
                        }}
                    />
                    <ExportOption
                        icon={Table}
                        title="Excel/CSV (.csv)"
                        description="Exportar como planilha CSV"
                        color="purple"
                        onClick={() => {
                            onExportXLS();
                            onClose();
                        }}
                    />
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Fechar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

type ExportOptionProps = {
    icon: React.ComponentType<{ size: number; className?: string }>;
    title: string;
    description: string;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
    onClick: () => void;
};

const ExportOption: React.FC<ExportOptionProps> = ({
    icon: Icon,
    title,
    description,
    color,
    onClick,
}) => {
    const colorClasses = {
        blue: 'bg-blue-600/20 group-hover:bg-blue-600/30 text-blue-400 hover:border-blue-500/50',
        green: 'bg-green-600/20 group-hover:bg-green-600/30 text-green-400 hover:border-green-500/50',
        red: 'bg-red-600/20 group-hover:bg-red-600/30 text-red-400 hover:border-red-500/50',
        yellow: 'bg-yellow-600/20 group-hover:bg-yellow-600/30 text-yellow-400 hover:border-yellow-500/50',
        purple: 'bg-purple-600/20 group-hover:bg-purple-600/30 text-purple-400 hover:border-purple-500/50',
    };

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 ${colorClasses[color].split(' ').slice(2).join(' ')} transition-all duration-200 text-left group`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${colorClasses[color].split(' ').slice(0, 2).join(' ')}`}>
                    <Icon size={20} className={colorClasses[color].split(' ')[2]} />
                </div>
                <div className="flex-1">
                    <div className="text-white font-semibold mb-1">{title}</div>
                    <div className="text-xs text-slate-400">{description}</div>
                </div>
            </div>
        </button>
    );
};
