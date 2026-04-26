'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import OrderForm from '../components/OrderForm/OrderForm';
import ShipmentPreview from '../components/ShipmentPreview/ShipmentPreview';
import styles from './page.module.css';

const defaultSubmitState = {
  type: 'idle',
  message: 'Fill all required details and submit your shipment request.',
  errors: [],
};

const generateOrderId = () => {
  const prefix = 'LSP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const packageId = (number) => `pkg-${String(number).padStart(3, '0')}`;

const createEmptyPackage = (id) => ({
  id,
  label: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  declaredValue: '',
});

const pinRegex = /^\d{6}$/;

const validateParty = (partyLabel, partyData) => {
  const errors = [];

  if (!partyData.name.trim()) {
    errors.push(`${partyLabel}: full name is required.`);
  }
  if (!partyData.address.trim()) {
    errors.push(`${partyLabel}: address is required.`);
  }
  if (!partyData.city.trim()) {
    errors.push(`${partyLabel}: city is required.`);
  }
  if (!pinRegex.test(partyData.pincode)) {
    errors.push(`${partyLabel}: pincode must be exactly 6 digits.`);
  }

  return errors;
};

const validatePackages = (packages) => {
  const errors = [];

  packages.forEach((pkg, index) => {
    const packageLabel = `Package ${index + 1}`;

    if (!pkg.label.trim()) {
      errors.push(`${packageLabel}: label is required.`);
    }

    const weight = Number(pkg.weight);
    if (!pkg.weight || Number.isNaN(weight) || weight <= 0) {
      errors.push(`${packageLabel}: weight must be greater than 0.`);
    }

    ['length', 'width', 'height'].forEach((dimension) => {
      const dimValue = Number(pkg[dimension]);
      if (!pkg[dimension] || Number.isNaN(dimValue) || dimValue <= 0) {
        errors.push(`${packageLabel}: ${dimension} must be greater than 0.`);
      }
    });
  });

  return errors;
};

const validateOrder = (formData) => {
  const errors = [];

  if (!formData.shipmentDate) {
    errors.push('Shipment date is required.');
  }

  errors.push(...validateParty('Consignor', formData.consignor));
  errors.push(...validateParty('Consignee', formData.consignee));
  errors.push(...validatePackages(formData.packages));

  return errors;
};

export default function Home() {
  const nextPackageNumberRef = useRef(2);
  const [submitState, setSubmitState] = useState(defaultSubmitState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({ show: false, status: 'idle' });

  const [formData, setFormData] = useState(() => ({
    orderId: '',
    shipmentDate: '',
    deliveryType: 'standard',
    consignor: { name: '', address: '', city: '', pincode: '' },
    consignee: { name: '', address: '', city: '', pincode: '' },
    packages: [createEmptyPackage(packageId(1))],
    fragile: false,
    insurance: false,
  }));

  useEffect(() => {
    setFormData(prev => (prev.orderId ? prev : { ...prev, orderId: generateOrderId() }));
  }, []);

  const handlePrint = useCallback(() => {
    const originalTitle = document.title;
    document.title = `LogiShip - ${formData.orderId}`;
    window.print();
    document.title = originalTitle;
    setModalState({ show: false, status: 'idle' });
  }, [formData.orderId]);

  const clearSubmitFeedback = useCallback(() => {
    setSubmitState(prev => (prev.type === 'idle' ? prev : defaultSubmitState));
  }, []);

  const handleShipmentChange = useCallback((field, value) => {
    clearSubmitFeedback();
    setFormData(prev => ({ ...prev, [field]: value }));
  }, [clearSubmitFeedback]);

  const handlePartyChange = useCallback((party, field, value) => {
    clearSubmitFeedback();
    setFormData(prev => ({
      ...prev,
      [party]: { ...prev[party], [field]: value },
    }));
  }, [clearSubmitFeedback]);

  const handlePackageChange = useCallback((id, field, value) => {
    clearSubmitFeedback();
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map(pkg =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      ),
    }));
  }, [clearSubmitFeedback]);

  const addPackage = useCallback(() => {
    clearSubmitFeedback();
    const nextId = packageId(nextPackageNumberRef.current);
    nextPackageNumberRef.current += 1;

    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, createEmptyPackage(nextId)],
    }));
  }, [clearSubmitFeedback]);

  const removePackage = useCallback((id) => {
    clearSubmitFeedback();
    setFormData(prev => {
      if (prev.packages.length <= 1) return prev;
      return { ...prev, packages: prev.packages.filter(pkg => pkg.id !== id) };
    });
  }, [clearSubmitFeedback]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const errors = validateOrder(formData);
    if (errors.length > 0) {
      setSubmitState({
        type: 'error',
        message: `Please resolve ${errors.length} issue${errors.length > 1 ? 's' : ''} before submitting.`,
        errors,
      });
      return;
    }

    setIsSubmitting(true);
    setModalState({ show: true, status: 'processing' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const submittedAt = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

      setSubmitState({
        type: 'success',
        message: `Shipment ${formData.orderId} submitted successfully on ${submittedAt}.`,
        errors: [],
      });
      setModalState({ show: true, status: 'success' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoGroup}>
            <img src="/logo.png" alt="LogiShip Logo" className={styles.logoImage} />
            <span className={styles.logoText}>LogiShip</span>
          </div>
          <span className={styles.headerTag}>Order Management System</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.split}>
          <div className={styles.formPanel}>
            <OrderForm
              formData={formData}
              onShipmentChange={handleShipmentChange}
              onPartyChange={handlePartyChange}
              onPackageChange={handlePackageChange}
              onAddPackage={addPackage}
              onRemovePackage={removePackage}
              onSubmit={handleSubmit}
              submitState={submitState}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className={styles.previewPanel}>
            <ShipmentPreview formData={formData} />
          </div>
        </div>
      </main>

      {modalState.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {modalState.status === 'processing' ? (
              <>
                <div className={`${styles.modalIcon} ${styles.modalIconSpinner}`}>
                  <i className="fa-solid fa-circle-notch"></i>
                </div>
                <h3 className={styles.modalTitle}>Processing Order...</h3>
                <p className={styles.modalText}>Please wait while we securely process your shipment request.</p>
              </>
            ) : (
              <>
                <div className={`${styles.modalIcon} ${styles.modalIconSuccess}`}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3 className={styles.modalTitle}>Order Successful!</h3>
                <p className={styles.modalText}>Your shipment has been booked. Please wait for the pickup to be arranged.</p>
                <div className={styles.modalActions}>
                  <button className={styles.btnSecondary} onClick={() => setModalState({ show: false, status: 'idle' })}>Close</button>
                  <button className={styles.btnPrimary} onClick={handlePrint}>Print Slip</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
