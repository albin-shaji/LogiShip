import './globals.css';
import styles from './layout.module.css';
import AccessibilityProvider from '../components/AccessibilityProvider/AccessibilityProvider';
import AccessibilityWidget from '../components/AccessibilityWidget/AccessibilityWidget';

export const metadata = {
  title: 'LogiShip — Order Management',
  description: 'Create and preview logistics shipment orders',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={styles.body}>
        <AccessibilityProvider>
          {children}
          <AccessibilityWidget />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
