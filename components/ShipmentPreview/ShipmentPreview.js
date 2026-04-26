'use client';

import { useEffect, useState } from 'react';
import styles from './ShipmentPreview.module.css';

const fmt = (val, fallback = '—') => (val && String(val).trim() ? val : fallback);
const fmtWeight = (val) => (val && !isNaN(val) ? `${Number(val).toFixed(2)} kg` : '—');

export default function ShipmentPreview({ formData }) {
  const [footerTimestamp, setFooterTimestamp] = useState('');
  const { orderId, shipmentDate, deliveryType, consignor, consignee, packages, fragile, insurance } = formData;

  useEffect(() => {
    setFooterTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const totalWeight = packages.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0);
  const totalValue = packages.reduce((sum, p) => sum + (parseFloat(p.declaredValue) || 0), 0);
  const pkgCount = packages.length;

  const formattedDate = shipmentDate
    ? new Date(shipmentDate + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null;

  let pickupDateFormatted = null;
  if (shipmentDate) {
    const d = new Date(shipmentDate + 'T00:00:00');
    // Add 1 day for pickup
    d.setDate(d.getDate() + 1);
    pickupDateFormatted = d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  // Calculate insurance fee: ₹50 per kg (rounded up)
  const insuranceFee = insurance && totalWeight > 0 ? Math.ceil(totalWeight) * 50 : 0;

  const isExpress = deliveryType === 'express';

  // Calculate Base Shipping Fee
  const baseRate = isExpress ? 300 : 150;
  const weightRate = totalWeight > 0 ? Math.ceil(totalWeight) * 30 : 0;
  const shippingFee = baseRate + weightRate;
  
  // Calculate Grand Total
  const grandTotal = shippingFee + insuranceFee;

  return (
    <div className={styles.preview}>
      {/* Header */}
      <div className={styles.previewHeader}>
        <div className={styles.previewHeaderTop}>
          <span className={styles.previewLabel}>Shipment Summary</span>
          <span className={`${styles.deliveryBadge} ${isExpress ? styles.badgeExpress : styles.badgeStandard}`}>
            {isExpress ? <><i className="fa-solid fa-bolt"></i> Express</> : <><i className="fa-solid fa-box"></i> Standard</>}
          </span>
        </div>
        <div className={styles.orderBlock}>
          <span className={styles.orderIdLabel}>ORDER ID</span>
          <span className={styles.orderId}>{orderId}</span>
        </div>
        {formattedDate && (
          <div className={styles.dateGroup}>
            <div className={styles.dateRow}>
              <span className={styles.dateIcon}><i className="fa-regular fa-calendar"></i></span>
              <span className={styles.dateText}>Booking: {formattedDate}</span>
            </div>
            {pickupDateFormatted && (
              <div className={styles.dateRow}>
                <span className={styles.dateIcon}><i className="fa-solid fa-truck-pickup"></i></span>
                <span className={styles.dateText}>Pickup: {pickupDateFormatted}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Route */}
      <div className={styles.routeSection}>
        <AddressCard type="FROM" party={consignor} />
        <div className={styles.routeArrow}>
          <i className="fa-solid fa-arrow-right-long"></i>
        </div>
        <AddressCard type="TO" party={consignee} />
      </div>

      {/* Indicators */}
      {(fragile || insurance) && (
        <div className={styles.indicators}>
          {fragile && (
            <span className={styles.indicator}>
              <span className={styles.indicatorIcon}><i className="fa-solid fa-triangle-exclamation"></i></span>
              Fragile
            </span>
          )}
          {insurance && (
            <span className={`${styles.indicator} ${styles.indicatorInsured}`}>
              <span className={styles.indicatorIcon}><i className="fa-solid fa-shield-halved"></i></span>
              Insured
            </span>
          )}
        </div>
      )}

      {/* Packages */}
      <div className={styles.packagesSection}>
        <div className={styles.sectionHeading}>
          <span>Packages</span>
          <span className={styles.pkgCountBadge}>{pkgCount}</span>
        </div>
        <div className={styles.packagesList}>
          {packages.map((pkg, i) => (
            <PackageRow key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </div>

      {/* Summary totals */}
      <div className={styles.totalsSection}>
        <TotalRow label="Total Packages" value={`${pkgCount} pkg${pkgCount !== 1 ? 's' : ''}`} />
        <TotalRow label="Total Weight" value={fmtWeight(totalWeight || null)} />
        <TotalRow
          label="Total Declared Value"
          value={totalValue > 0 ? `₹ ${totalValue.toLocaleString('en-IN')}` : '—'}
        />
        <TotalRow
          label="Shipping Fee"
          value={`₹ ${shippingFee.toLocaleString('en-IN')}`}
        />
        {insuranceFee > 0 && (
          <TotalRow
            label="Insurance Fee (Weight-based)"
            value={`₹ ${insuranceFee.toLocaleString('en-IN')}`}
          />
        )}
        <TotalRow
          label="Grand Total"
          value={`₹ ${grandTotal.toLocaleString('en-IN')}`}
          highlight
        />
      </div>

      {/* Footer */}
      <div className={styles.previewFooter}>
        <span className={styles.footerTag}>Generated by LogiShip</span>
        <span className={styles.footerDot}>·</span>
        <span className={styles.footerTimestamp}>{footerTimestamp || '--:--'}</span>
      </div>
    </div>
  );
}

function AddressCard({ type, party }) {
  const hasData = party.name || party.city;
  return (
    <div className={styles.addressCard}>
      <span className={styles.addressType}>{type}</span>
      {hasData ? (
        <>
          <span className={styles.addressName}>{fmt(party.name)}</span>
          {party.address && <span className={styles.addressLine}>{party.address}</span>}
          <span className={styles.addressCity}>
            {[party.city, party.pincode].filter(Boolean).join(' — ') || '—'}
          </span>
        </>
      ) : (
        <span className={styles.addressEmpty}>Not filled</span>
      )}
    </div>
  );
}

function PackageRow({ pkg, index }) {
  const hasInfo = pkg.label || pkg.weight || pkg.length;
  const dims = [pkg.length, pkg.width, pkg.height].every(Boolean)
    ? `${pkg.length} × ${pkg.width} × ${pkg.height} cm`
    : null;

  return (
    <div className={styles.packageRow}>
      <div className={styles.pkgRowHeader}>
        <span className={styles.pkgRowIndex}>#{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.pkgRowLabel}>{fmt(pkg.label, 'Unnamed Package')}</span>
        {pkg.weight && (
          <span className={styles.pkgRowWeight}>{pkg.weight} kg</span>
        )}
      </div>
      {hasInfo && (
        <div className={styles.pkgRowMeta}>
          {dims && <span className={styles.pkgDims}>{dims}</span>}
          {pkg.declaredValue && (
            <span className={styles.pkgValue}>₹ {Number(pkg.declaredValue).toLocaleString('en-IN')}</span>
          )}
        </div>
      )}
    </div>
  );
}

function TotalRow({ label, value, highlight }) {
  return (
    <div className={`${styles.totalRow} ${highlight ? styles.totalRowHighlight : ''}`}>
      <span className={styles.totalLabel}>{label}</span>
      <span className={`${styles.totalValue} ${highlight ? styles.totalValueHighlight : ''}`}>{value}</span>
    </div>
  );
}
