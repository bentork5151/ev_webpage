import { io } from 'socket.io-client'
import { WS_CONFIG } from '../config/api.config'
import CacheService from './cache.service'

class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
  }
  

  connect(sessionId) {
    if (this.socket?.connected) {
      return
    }
    
    const token = CacheService.getToken()
    
    this.socket = io(WS_CONFIG.URL, {
      auth: {
        token: token
      },
      query: {
        sessionId: sessionId
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: WS_CONFIG.RECONNECT_ATTEMPTS,
      reconnectionDelay: WS_CONFIG.RECONNECT_DELAY,
    })
    

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      this.emit('connection:status', { connected: true })
    })
    
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      this.emit('connection:status', { connected: false, reason })
    })
    
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= WS_CONFIG.RECONNECT_ATTEMPTS) {
        this.disconnect()
        this.emit('connection:failed', { message: 'Failed to connect to server' })
      }
    })
    

    this.socket.on('charging:update', (data) => {
      this.emit('charging:update', data)
    })
    

    this.socket.on('session:status', (data) => {
      this.emit('session:status', data)
    })
    

    this.socket.on('kwh:update', (data) => {
      this.emit('kwh:update', data)
    })
  }
  

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.listeners.clear()
  }
  

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event).add(callback)
    

    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        callbacks.delete(callback)
      }
    }
  }
  

  emit(event, data) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }
  

  send(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.error('WebSocket not connected')
    }
  }
  

  requestSessionUpdate(sessionId) {
    this.send('request:session:update', { sessionId })
  }
  

  stopCharging(sessionId) {
    this.send('stop:charging', { sessionId })
  }
}


const wsService = new WebSocketService()
export default wsService