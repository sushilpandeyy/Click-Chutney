/**
 * ClickChutney Analytics - Core Tracking Script
 * Embodies the spirit of Indian street food culture - vibrant, accessible, and bringing people together
 * Version: 1.0.0
 */

(function(window, document) {
  'use strict';

  // Prevent double initialization
  if (window.ClickChutney && window.ClickChutney._initialized) {
    return;
  }

  // Core tracking object
  const ClickChutney = {
    _initialized: false,
    _config: {
      trackingId: null,
      endpoint: null,
      autoPageview: true,
      debug: false,
      enableHeartbeat: true,
      heartbeatInterval: 30000, // 30 seconds
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
    },
    _session: {
      id: null,
      startTime: null,
      lastActivity: null,
      pageviews: 0
    },
    _queue: [],
    _heartbeatTimer: null,

    /**
     * Initialize ClickChutney Analytics
     * @param {Object} config - Configuration object
     * @param {string} config.trackingId - Project tracking ID
     * @param {string} [config.endpoint] - Analytics endpoint URL
     * @param {boolean} [config.autoPageview=true] - Automatically track pageviews
     * @param {boolean} [config.debug=false] - Enable debug logging
     */
    init: function(config) {
      if (this._initialized) {
        this._log('warn', 'ClickChutney already initialized');
        return;
      }

      // Validate required config
      if (!config || !config.trackingId) {
        this._log('error', 'trackingId is required for initialization');
        return;
      }

      // Merge config
      this._config = Object.assign({}, this._config, config);
      
      // Set default endpoint if not provided
      if (!this._config.endpoint) {
        this._config.endpoint = this._detectEndpoint() + '/api/analytics/collect';
      }

      // Initialize session
      this._initSession();

      // Set up page visibility handling
      this._setupVisibilityHandling();

      // Track initial pageview if enabled
      if (this._config.autoPageview) {
        this.pageview();
      }

      // Start heartbeat if enabled
      if (this._config.enableHeartbeat) {
        this._startHeartbeat();
      }

      this._initialized = true;
      this._log('info', 'ClickChutney Analytics initialized', {
        trackingId: this._config.trackingId,
        endpoint: this._config.endpoint,
        sessionId: this._session.id
      });

      // Process any queued events
      this._processQueue();
    },

    /**
     * Track a pageview event
     * @param {string} [page] - Page path (defaults to current location)
     * @param {string} [title] - Page title (defaults to document title)
     */
    pageview: function(page, title) {
      const data = {
        type: 'pageview',
        page: page || this._getCurrentPage(),
        title: title || document.title,
        referrer: document.referrer || null,
        timestamp: Date.now()
      };

      this._session.pageviews++;
      this._track(data);
    },

    /**
     * Track a custom event
     * @param {string} event - Event name
     * @param {Object} [properties] - Event properties
     */
    event: function(event, properties) {
      if (!event) {
        this._log('error', 'Event name is required');
        return;
      }

      const data = {
        type: 'event',
        event: event,
        properties: properties || {},
        page: this._getCurrentPage(),
        timestamp: Date.now()
      };

      this._track(data);
    },

    /**
     * Identify a user
     * @param {string} userId - User ID
     * @param {Object} [traits] - User traits
     */
    identify: function(userId, traits) {
      if (!userId) {
        this._log('error', 'User ID is required for identify');
        return;
      }

      const data = {
        type: 'identify',
        userId: userId,
        traits: traits || {},
        timestamp: Date.now()
      };

      this._track(data);
    },

    /**
     * Track user engagement (heartbeat)
     */
    heartbeat: function() {
      const data = {
        type: 'heartbeat',
        page: this._getCurrentPage(),
        sessionDuration: Date.now() - this._session.startTime,
        pageviews: this._session.pageviews,
        timestamp: Date.now()
      };

      this._track(data);
    },

    /**
     * Core tracking method
     * @private
     */
    _track: function(data) {
      if (!this._initialized) {
        this._queue.push(data);
        return;
      }

      // Add session and config data
      const payload = Object.assign({}, data, {
        trackingId: this._config.trackingId,
        sessionId: this._session.id,
        url: window.location.href,
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height
        },
        viewport: {
          width: window.innerWidth || document.documentElement.clientWidth,
          height: window.innerHeight || document.documentElement.clientHeight
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      });

      this._updateActivity();
      this._send(payload);
    },

    /**
     * Send data to analytics endpoint
     * @private
     */
    _send: function(payload) {
      this._log('debug', 'Sending analytics data', payload);

      // Use sendBeacon if available for better reliability
      if (navigator.sendBeacon && !this._config.debug) {
        const blob = new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        });
        
        if (navigator.sendBeacon(this._config.endpoint, blob)) {
          this._log('debug', 'Data sent via sendBeacon');
          return;
        }
      }

      // Fallback to fetch
      fetch(this._config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).then(function(response) {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
      }).catch(function(error) {
        this._log('error', 'Failed to send analytics data', error);
      }.bind(this));
    },

    /**
     * Initialize session
     * @private
     */
    _initSession: function() {
      const now = Date.now();
      let sessionId = this._getStoredSessionId();
      
      // Check if existing session is still valid
      const lastActivity = localStorage.getItem('cc_last_activity');
      if (sessionId && lastActivity) {
        const timeSinceActivity = now - parseInt(lastActivity, 10);
        if (timeSinceActivity > this._config.sessionTimeout) {
          sessionId = null; // Session expired
        }
      }

      // Create new session if needed
      if (!sessionId) {
        sessionId = this._generateSessionId();
        localStorage.setItem('cc_session_id', sessionId);
      }

      this._session.id = sessionId;
      this._session.startTime = now;
      this._session.lastActivity = now;
      this._session.pageviews = 0;

      this._updateActivity();
    },

    /**
     * Update last activity timestamp
     * @private
     */
    _updateActivity: function() {
      this._session.lastActivity = Date.now();
      localStorage.setItem('cc_last_activity', this._session.lastActivity.toString());
    },

    /**
     * Set up page visibility handling
     * @private
     */
    _setupVisibilityHandling: function() {
      // Track when page becomes hidden/visible
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          this._stopHeartbeat();
        } else {
          this._updateActivity();
          if (this._config.enableHeartbeat) {
            this._startHeartbeat();
          }
        }
      }.bind(this));

      // Track page unload
      window.addEventListener('beforeunload', function() {
        this._stopHeartbeat();
        // Send final heartbeat
        this.heartbeat();
      }.bind(this));
    },

    /**
     * Start heartbeat timer
     * @private
     */
    _startHeartbeat: function() {
      this._stopHeartbeat(); // Clear any existing timer
      
      this._heartbeatTimer = setInterval(function() {
        if (!document.hidden) {
          this.heartbeat();
        }
      }.bind(this), this._config.heartbeatInterval);
    },

    /**
     * Stop heartbeat timer
     * @private
     */
    _stopHeartbeat: function() {
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = null;
      }
    },

    /**
     * Process queued events
     * @private
     */
    _processQueue: function() {
      while (this._queue.length > 0) {
        const data = this._queue.shift();
        this._track(data);
      }
    },

    /**
     * Get current page path
     * @private
     */
    _getCurrentPage: function() {
      return window.location.pathname + window.location.search;
    },

    /**
     * Detect endpoint from script source
     * @private
     */
    _detectEndpoint: function() {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        if (src && src.includes('clickchutney-analytics.js')) {
          const url = new URL(src);
          return url.origin;
        }
      }
      return window.location.origin;
    },

    /**
     * Generate session ID
     * @private
     */
    _generateSessionId: function() {
      return 'cc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Get stored session ID
     * @private
     */
    _getStoredSessionId: function() {
      try {
        return localStorage.getItem('cc_session_id');
      } catch (e) {
        return null;
      }
    },

    /**
     * Debug logging
     * @private
     */
    _log: function(level, message, data) {
      if (!this._config.debug && level === 'debug') return;
      
      const prefix = '🍛 ClickChutney';
      const logFn = console[level] || console.log;
      
      if (data) {
        logFn(prefix + ':', message, data);
      } else {
        logFn(prefix + ':', message);
      }
    }
  };

  // Expose ClickChutney globally
  window.ClickChutney = ClickChutney;

  // Process any pre-existing commands
  if (window.cc && Array.isArray(window.cc)) {
    window.cc.forEach(function(command) {
      if (Array.isArray(command) && command.length > 0) {
        const method = command[0];
        const args = command.slice(1);
        if (ClickChutney[method]) {
          ClickChutney[method].apply(ClickChutney, args);
        }
      }
    });
  }

  // Replace the queue with direct calls
  window.cc = function() {
    const args = Array.prototype.slice.call(arguments);
    const method = args[0];
    const params = args.slice(1);
    
    if (ClickChutney[method]) {
      ClickChutney[method].apply(ClickChutney, params);
    } else {
      ClickChutney._log('error', 'Unknown method: ' + method);
    }
  };

})(window, document);