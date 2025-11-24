import { useState, useMemo } from 'react';
import { SLASH_COMMANDS, type SlashCommand } from '../../constants/editor/editorConstants';

export const useSlashCommands = () => {
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashQuery, setSlashQuery] = useState('');
    const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);

    const filteredSlashCommands = useMemo(() => {
        if (!slashQuery) return SLASH_COMMANDS;
        const query = slashQuery.toLowerCase();
        return SLASH_COMMANDS.filter(cmd =>
            cmd.name.toLowerCase().includes(query) ||
            cmd.keywords.some(kw => kw.includes(query)) ||
            cmd.description.toLowerCase().includes(query)
        );
    }, [slashQuery]);

    const resetSlashMenu = () => {
        setShowSlashMenu(false);
        setSlashQuery('');
        setSelectedSlashIndex(0);
    };

    const selectNextCommand = () => {
        setSelectedSlashIndex((prev) =>
            prev < filteredSlashCommands.length - 1 ? prev + 1 : 0
        );
    };

    const selectPreviousCommand = () => {
        setSelectedSlashIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSlashCommands.length - 1
        );
    };

    const getSelectedCommand = (): SlashCommand | undefined => {
        return filteredSlashCommands[selectedSlashIndex];
    };

    return {
        showSlashMenu,
        setShowSlashMenu,
        slashQuery,
        setSlashQuery,
        selectedSlashIndex,
        setSelectedSlashIndex,
        filteredSlashCommands,
        resetSlashMenu,
        selectNextCommand,
        selectPreviousCommand,
        getSelectedCommand,
    };
};
