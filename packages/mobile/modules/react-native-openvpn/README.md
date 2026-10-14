<p align="center">
  <img src="https://aliakhgar.com/ovpheader2.png" alt="React Native OpenVPN Banner" style="width:100%;">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-Turbo%20Module-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React Native Turbo Module" />
  <img src="https://img.shields.io/badge/OpenVPN-2.x%20%7C%203.x-orange?style=flat-square&logo=openvpn" alt="OpenVPN Support" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square&logo=opensourceinitiative&logoColor=white" alt="MIT License" />
</p>


<div valign="top" align="right">
  <img align="right" padding="200" width="53%" height="600" style="margin:200px;" src="https://github.com/user-attachments/assets/8803e977-283f-4c8b-baa3-3175fbee3532">
</div>

<h3>Features</h3>

⚡ **Turbo Module** architecture for optimal performance  
🍎 **+70 Dynamically Controlled** OpenVPN Options  
🔔 **Customizable notifications** with actions and timers   
🔄 **Event-driven** connection state management  
🔧 **OpenVPN 2.x and 3.x** SDK compatibility  
📝 **Fully typed** APIs with IntelliSense support  
🔐 **Multiple TLS** profiles and security options  
📄 **Config file** support and inline configurations  
🌐 **Advanced routing** and custom DNS features  

## 🧭 Fast Navigation

<div align="center">

**📦 Installation** - Complete setup and platform configuration guide  
<a href="docs/INSTALLATION.md" style="color: #007acc; text-decoration: none;">→ Browse Installation Guide</a>

**📋 API Reference** - Complete method and interface documentation  
<a href="docs/API.md" style="color: #007acc; text-decoration: none;">→ Browse API Documentation</a>

**💡 Usage Example** - Practical implementation examples and guides  
<a href="docs/EXAMPLES.md" style="color: #007acc; text-decoration: none;">→ View Usage Examples</a>

**🔧 Troubleshoot and Debug** - Problem solutions and debugging tools  
<a href="docs/DEBUG.md" style="color: #007acc; text-decoration: none;">→ Access Troubleshooting Guide</a>

</div>

---

## 📦 Installation

### Quick Install

```bash
# Using npm
npm install @aliakhgar1/react-native-openvpn

# Using yarn
yarn add @aliakhgar1/react-native-openvpn

# Install iOS dependencies (iOS only)
cd ios && pod install
```

### 🎯 Prerequisites

**React Native:** 0.68+  
**Android:** API 24+  
**iOS:** 15.1+

---

## 🚀 Quick Start

Get up and running with VPN connectivity in under 5 minutes:

```typescript
import * as OpenVPN from 'react-native-openvpn';

// 1. Check permissions (Android only)
const connectToVPN = async () => {
  if (Platform.OS === 'android') {
    const isPrepared = await OpenVPN.isPrepared();
    if (!isPrepared) {
      const granted = await OpenVPN.prepare();
      if (!granted) return; // User denied permission
    }
  }

  // 2. Connect with minimal configuration
  await OpenVPN.connect({
    address: 'your-vpn-server.com',
    username: 'your-username', 
    password: 'your-password',
    openVPNConfig: yourOvpnConfigString,
    
    iOSOptions: {
      localizedDescription: 'My VPN Connection',
      networkExtensionBundleIdentifier: 'com.yourapp.vpn-extension',
      disconnectOnSleep: false,
      onDemandEnabled: false,
    },
    
    androidOptions: {
      Notification: {
        openActivityPackageName: 'com.yourapp.MainActivity',
        titleNotification: 'VPN Connected',
        titleConnected: '🔒 Secure Connection Active',
        titleConnecting: '🔄 Connecting to VPN...',
        showDisconnectAction: true,
      },
    },
  });
};

// 3. Listen for connection state changes
const subscription = OpenVPN.addOpenVPNStateChangeListener((state) => {
  switch (state.state) {
    case OpenVPN.ConnectionState.CONNECTED:
      console.log('🟢 VPN Connected Successfully!');
      break;
    case OpenVPN.ConnectionState.DISCONNECTED:
      console.log('🔴 VPN Disconnected');
      break;
    case OpenVPN.ConnectionState.CONNECTING:
      console.log('🟡 Connecting to VPN...');
      break;
  }
});

// 4. Disconnect when done
await OpenVPN.disconnect();
subscription.remove();
```
