import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthWall from './pages/AuthWall';
import SelectLocation from './pages/SelectLocation';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import Documentation from './pages/Documentation';

import GenericContentPage from './pages/GenericContentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AuthWall />} />
          <Route path="auth" element={<Navigate to="/" replace />} />
          <Route path="select-location" element={<SelectLocation />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="docs" element={<Documentation />} />
          
          {/* Dynamic Header Routes */}
          <Route path="stadiums" element={<GenericContentPage title="Stadiums & Arenas" subtitle="High-density crowd orchestration for sporting events." content="OptiFlow Enterprise deploys edge-computed spatial intelligence at stadium entry gates, concourses, and exit ramps. By integrating with existing CCTV grids, the platform autonomously routes traffic away from congestion zones, ensuring seamless fan experiences and preemptive safety mitigations during mass egress." />} />
          <Route path="transit" element={<GenericContentPage title="Transit Hubs" subtitle="Maintain fluid movement in chaotic transport environments." content="Modern airports and train stations suffer from extreme localized density during delays. OptiFlow continuously monitors platform saturation and ticket gate velocity, predicting bottlenecks 5-15 minutes before they cascade, allowing staff to reallocate security lines and alter digital wayfinding dynamically." />} />
          <Route path="convention" element={<GenericContentPage title="Convention Centers" subtitle="Optimize spatial flow for massive exhibition layouts." content="With multiple interconnected halls and unpredictable footfall patterns, convention centers benefit directly from OptiFlow's IoT density tracking. Planners can visualize heatmaps in real-time, opening auxiliary doors and directing attendees to less congested pavilions without manual oversight." />} />
          
          <Route path="api-docs" element={<GenericContentPage title="API Documentation" subtitle="Developer resources and webhook integration." content="The OptiFlow REST API and WebSocket streams are secured via OAuth2.0 and require active enterprise licensing. Developers can subscribe to real-time `zone_congestion` events or query our TimescaleDB historical endpoint for aggregations. Detailed Swagger documentation is provided directly to licensed partners." />} />
          <Route path="case-studies" element={<GenericContentPage title="Case Studies" subtitle="Proven results across global deployments." content="From reducing average gate queue times by 40% at the HITEX Exhibition Centre to autonomously mitigating a potential crowd crush scenario at major European transit hubs, OptiFlow delivers actionable spatial intelligence. Read our detailed whitepapers on predictive ML accuracy in chaotic real-world environments." />} />
          <Route path="status" element={<GenericContentPage title="System Status" subtitle="Real-time operational metrics for OptiFlow Cloud." content="All Systems Operational.\n\nBackend Edge Ingestion: 99.99% Uptime\nMachine Learning Pipeline: Sub-10ms Inference\nReact WebSocket Relays: 24ms average latency\n\nNo active incidents reported in the last 72 hours." />} />

          {/* Dynamic Footer Routes */}
          <Route path="features" element={<GenericContentPage title="Platform Features" subtitle="Comprehensive crowd control tooling." content="OptiFlow features an integrated deterministic Multi-Agent architecture, edge IoT ingestion parsers, XGBoost-powered predictive capacity forecasting, and a real-time React command dashboard. Everything you need to secure massive venues in one unified SaaS application." />} />
          <Route path="integrations" element={<GenericContentPage title="Integrations" subtitle="Connect OptiFlow to your existing hardware." content="Our platform integrates natively with Axis Communications, Hikvision, and Cisco Meraki camera systems. Furthermore, Webhooks and MQTT bridges allow direct connection to existing digital signage and automated door-locking mechanisms." />} />
          <Route path="pricing" element={<GenericContentPage title="Enterprise Pricing" subtitle="Custom tailored solutions for your venue." content="OptiFlow is strictly an enterprise-grade platform. Pricing is determined by the total square footage of the venue and the number of active edge processing nodes required. Contact our sales team for a comprehensive spatial audit and hardware quote." />} />
          
          <Route path="careers" element={<GenericContentPage title="Careers" subtitle="Join the team building the future of safety." content="We are actively hiring Senior C++ Edge Engineers, Machine Learning Researchers, and React developers. Help us build robust spatial intelligence platforms that save lives and optimize global movement." />} />
          <Route path="blog" element={<GenericContentPage title="OptiFlow Blog" subtitle="Insights into spatial intelligence and ML." content="Read the latest thoughts from our engineering team regarding deploying XGBoost models at the edge, compiling memory-safe C++ for embedded IoT hardware, and designing high-performance WebSockets in FastAPI." />} />
          
          <Route path="privacy" element={<GenericContentPage title="Privacy Policy" subtitle="Your data, strictly protected." content="OptiFlow is committed to absolute privacy. All computer vision processing occurs entirely at the edge; video feeds are never transmitted or stored in the cloud. We only process anonymized numerical arrays and velocity vectors, ensuring 100% compliance with GDPR and global surveillance regulations." />} />
          <Route path="terms" element={<GenericContentPage title="Terms of Service" subtitle="Enterprise licensing agreements." content="Access to the OptiFlow platform is governed by your specific enterprise contract. Misuse of the API, unauthorized reverse engineering of the edge parsing algorithms, or distribution of your active Firebase authentication keys will result in immediate termination of service." />} />
          <Route path="security" element={<GenericContentPage title="Security Architecture" subtitle="Military-grade encryption and isolation." content="All data in transit is secured via TLS 1.3 and WebSockets operate over the secure WSS protocol. Our TimescaleDB instances are siloed per tenant in isolated AWS VPCs, and edge devices require strict rotating JWT authentication handshakes to broadcast telemetry." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
