import { io, Socket } from 'socket.io-client';

export type RemoteCommand = {
    command: 'next' | 'previous' | 'goto' | 'scroll' | 'scroll-sync' | 'presenter' | 'focus';
    slideIndex?: number;
    scrollDirection?: 'up' | 'down';
    scrollPosition?: number;
    toggle?: boolean;
    fromClient?: string;
};

export type SessionData = {
    sessionId: string;
    qrUrl: string;
    remoteClients: string[];
    isConnected: boolean;
};

let socket: Socket | null = null;

export const socketService = {
    connect(url?: string): Socket {
        if (socket?.connected) return socket;

        const socketUrl = url || import.meta.env.VITE_API_URL || window.location.origin;

        socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.setupBaseListeners();
        return socket;
    },

    disconnect() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    },

    isConnected(): boolean {
        return socket?.connected || false;
    },

    getSocketId(): string | undefined {
        return socket?.id;
    },

    createPresentation(callback: (response: any) => void) {
        if (!socket) return;
        socket.emit('create-presentation', callback);
    },

    joinRemote(sessionId: string, callback: (response: any) => void) {
        if (!socket) return;
        socket.emit('join-remote', sessionId, callback);
    },

    sendCommand(sessionId: string, command: RemoteCommand) {
        if (!socket) return;
        socket.emit('remote-command', { sessionId, ...command });
    },

    updatePresentationState(sessionId: string, currentSlide: number, totalSlides: number) {
        if (!socket) return;
        socket.emit('update-presentation', { sessionId, currentSlide, totalSlides });
    },

    shareContent(sessionId: string, content: any) {
        if (!socket) return;
        socket.emit('share-presentation-content', sessionId, content);
    },

    on(event: string, callback: Function) {
        if (!socket) return;
        socket.on(event, callback as any);
    },

    off(event: string, callback?: Function) {
        if (!socket) return;
        socket.off(event, callback as any);
    },

    setupBaseListeners() {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('SocketService: Connected', socket?.id);
        });

        socket.on('disconnect', () => {
            console.log('SocketService: Disconnected');
        });

        socket.on('connect_error', (err) => {
            console.error('SocketService: Connection error', err);
        });
    }
};
