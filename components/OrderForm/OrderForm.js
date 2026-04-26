'use client';

import PackageItem from '../PackageItem/PackageItem';
import styles from './OrderForm.module.css';

export default function OrderForm({
  formData,
  onShipmentChange,
  onPartyChange,
  onPackageChange,
  onAddPackage,
  onRemovePackage,
  onSubmit,
  submitState,
  isSubmitting,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div
        className={`${styles.statusPanel} ${
          submitState.type === 'success' ? styles.statusSuccess : submitState.type === 'error' ? styles.statusError : styles.statusIdle
        }`}
        aria-live="polite"
      >
        <p className={styles.statusMessage}>{submitState.message}</p>
        {submitState.type === 'error' && submitState.errors.length > 0 && (
          <ul className={styles.errorList}>
            {submitState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Shipment Details */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIndex}>01</span>
          <h2 className={styles.sectionTitle}>Shipment Details</h2>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label className={styles.label}>Order ID</label>
            <input
              className={`${styles.input} ${styles.readOnly}`}
              value={formData.orderId}
              readOnly
              aria-label="Auto-generated Order ID"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="shipmentDate">Shipment Date</label>
            <input
              id="shipmentDate"
              type="date"
              className={styles.input}
              value={formData.shipmentDate}
              required
              onChange={e => onShipmentChange('shipmentDate', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Delivery Type</label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${formData.deliveryType === 'standard' ? styles.toggleActive : ''}`}
                onClick={() => onShipmentChange('deliveryType', 'standard')}
              >
                Standard
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${formData.deliveryType === 'express' ? styles.toggleActiveExpress : ''}`}
                onClick={() => onShipmentChange('deliveryType', 'express')}
              >
                Express
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Consignor */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIndex}>02</span>
          <h2 className={styles.sectionTitle}>Consignor <span className={styles.sectionSub}>— Sender</span></h2>
        </div>
        <PartyFields party="consignor" data={formData.consignor} onChange={onPartyChange} />
      </section>

      {/* Consignee */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIndex}>03</span>
          <h2 className={styles.sectionTitle}>Consignee <span className={styles.sectionSub}>— Receiver</span></h2>
        </div>
        <PartyFields party="consignee" data={formData.consignee} onChange={onPartyChange} />
      </section>

      {/* Packages */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIndex}>04</span>
          <h2 className={styles.sectionTitle}>Packages
            <span className={styles.packageCount}>{formData.packages.length}</span>
          </h2>
        </div>

        <div className={styles.packageList}>
          {formData.packages.map((pkg, index) => (
            <PackageItem
              key={pkg.id}
              pkg={pkg}
              index={index}
              canRemove={formData.packages.length > 1}
              onChange={onPackageChange}
              onRemove={onRemovePackage}
            />
          ))}
        </div>

        <button type="button" className={styles.addPackageBtn} onClick={onAddPackage}>
          <span className={styles.addIcon}><i className="fa-solid fa-plus"></i></span>
          Add Package
        </button>
      </section>

      {/* Additional Options */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIndex}>05</span>
          <h2 className={styles.sectionTitle}>Additional Options</h2>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={formData.fragile}
              onChange={e => onShipmentChange('fragile', e.target.checked)}
            />
            <span className={styles.checkboxCustom}>
              <span className={styles.checkMark}><i className="fa-solid fa-check"></i></span>
            </span>
            <span className={styles.checkboxText}>
              <span className={styles.checkboxTitle}>Fragile</span>
              <span className={styles.checkboxDesc}>Handle with extra care</span>
            </span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={formData.insurance}
              onChange={e => onShipmentChange('insurance', e.target.checked)}
            />
            <span className={styles.checkboxCustom}>
              <span className={styles.checkMark}><i className="fa-solid fa-check"></i></span>
            </span>
            <span className={styles.checkboxText}>
              <span className={styles.checkboxTitle}>Insurance Required</span>
              <span className={styles.checkboxDesc}>Coverage for declared value</span>
            </span>
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Shipment'}
          </button>
          <span className={styles.submitNote}>
            Required fields: date, sender, receiver, package label, weight, and dimensions.
          </span>
        </div>
      </section>
    </form>
  );
}

function PartyFields({ party, data, onChange }) {
  const id = (field) => `${party}-${field}`;
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={id('name')}>Full Name</label>
        <input
          id={id('name')}
          className={styles.input}
          placeholder="e.g. Riya Sharma"
          required
          value={data.name}
          onChange={e => onChange(party, 'name', e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={id('address')}>Address</label>
        <input
          id={id('address')}
          className={styles.input}
          placeholder="Street / Area"
          required
          value={data.address}
          onChange={e => onChange(party, 'address', e.target.value)}
        />
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={id('city')}>City</label>
          <input
            id={id('city')}
            className={styles.input}
            placeholder="Mumbai"
            required
            value={data.city}
            onChange={e => onChange(party, 'city', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={id('pincode')}>Pincode</label>
          <input
            id={id('pincode')}
            className={styles.input}
            placeholder="400001"
            pattern="[0-9]{6}"
            required
            maxLength={6}
            value={data.pincode}
            onChange={e => onChange(party, 'pincode', e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>
    </div>
  );
}
