/**
 * PropPilot Cross-Device Synchronization Client
 * 
 * Provides real-time bi-directional state synchronization across devices (Laptop <-> Phone)
 * using WebSocket connections backed by FastAPI and BroadcastChannel for cross-tab replication.
 */

class CrossDeviceSyncClient {
  constructor() {
    this.ws = null;
    this.sessionId = 'default_session';
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.status = 'disconnected'; // 'connected' | 'connecting' | 'disconnected'
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.pendingUpdateTimeout = null;
    this.deviceId = `device_${Math.random().toString(36).substring(2, 9)}`;

    // Cross-tab broadcast channel
    this.broadcastChannel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('proppilot_cross_device_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_STATE_UPDATE') {
            this.notifyListeners(event.data.state, event.data.source || 'cross_tab');
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or disabled', e);
      }
    }
  }

  getWebSocketUrl() {
    if (typeof window === 'undefined') return 'ws://localhost:8000/ws/sync/default_session';
    const host = window.location.hostname || 'localhost';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // If backend is running on port 8000:
    return `${protocol}//${host}:8000/ws/sync/${this.sessionId}`;
  }

  connect(sessionId = 'default_session') {
    if (typeof window === 'undefined') return;
    this.sessionId = sessionId;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setStatus('connecting');
    const wsUrl = this.getWebSocketUrl();

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INITIAL_STATE' || data.type === 'REMOTE_STATE_UPDATED' || data.type === 'STATE_BROADCAST') {
            const remoteState = data.state;
            const source = data.source || 'remote_device';
            this.notifyListeners(remoteState, source);
          }
        } catch (err) {
          console.error('[Sync] Error parsing WebSocket message:', err);
        }
      };

      this.ws.onclose = () => {
        this.setStatus('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.setStatus('disconnected');
      };
    } catch (err) {
      this.setStatus('disconnected');
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.sessionId);
    }, delay);
  }

  setStatus(status) {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  subscribeStatus(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(state, source) {
    this.listeners.forEach(listener => {
      try {
        listener(state, source);
      } catch (err) {
        console.error('[Sync] Listener error:', err);
      }
    });
  }

  sendUpdate(payloadState, sourceDevice = 'web') {
    // 1. Cross-tab local broadcast
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'SYNC_STATE_UPDATE',
          state: payloadState,
          source: `${sourceDevice}:${this.deviceId}`
        });
      } catch {}
    }

    // 2. Debounce WebSocket / REST broadcast
    if (this.pendingUpdateTimeout) clearTimeout(this.pendingUpdateTimeout);
    this.pendingUpdateTimeout = setTimeout(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({
            type: 'STATE_UPDATE',
            payload: payloadState,
            source: `${sourceDevice}:${this.deviceId}`
          }));
          return;
        } catch (e) {
          console.warn('[Sync] WS send failed, falling back to HTTP:', e);
        }
      }

      // HTTP fallback
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      fetch(`http://${host}:8000/api/sync/state?sessionId=${this.sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: payloadState,
          source: `${sourceDevice}:${this.deviceId}`
        })
      }).catch(() => {});
    }, 150);
  }
}

export const syncClient = new CrossDeviceSyncClient();
