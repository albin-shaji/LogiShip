'use client';

import { useState } from 'react';
import styles from './PackageItem.module.css';

export default function PackageItem({ pkg, index, canRemove, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const id = (field) => `pkg-${pkg.id}-${field}`;

  const hasData = pkg.label || pkg.weight;
  const summary = hasData
    ? `${pkg.label || 'Unnamed'} · ${pkg.weight ? pkg.weight + ' kg' : '—'}`
    : 'New Package';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
        >
          <span className={styles.pkgIndex}>PKG {String(index + 1).padStart(2, '0')}</span>
          <span className={styles.pkgSummary}>{summary}</span>
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}><i className="fa-solid fa-chevron-right"></i></span>
        </button>
        {canRemove && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onRemove(pkg.id)}
            aria-label="Remove package"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {expanded && (
        <div className={styles.cardBody}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={id('label')}>Package Label</label>
            <input
              id={id('label')}
              className={styles.input}
              placeholder="e.g. Electronics Box A"
              required
              value={pkg.label}
              onChange={e => onChange(pkg.id, 'label', e.target.value)}
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={id('weight')}>Weight (kg)</label>
              <input
                id={id('weight')}
                type="number"
                className={styles.input}
                placeholder="0.0"
                min="0"
                step="0.1"
                required
                value={pkg.weight}
                onChange={e => onChange(pkg.id, 'weight', e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={id('value')}>Declared Value (₹)</label>
              <input
                id={id('value')}
                type="number"
                className={styles.input}
                placeholder="0"
                min="0"
                step="0.01"
                value={pkg.declaredValue}
                onChange={e => onChange(pkg.id, 'declaredValue', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.dimLabel}>Dimensions (cm)</div>
          <div className={styles.row3}>
            {['length', 'width', 'height'].map(dim => (
              <div key={dim} className={styles.field}>
                <label className={styles.label} htmlFor={id(dim)}>
                  {dim.charAt(0).toUpperCase() + dim.slice(1)}
                </label>
                <input
                  id={id(dim)}
                  type="number"
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  required
                  value={pkg[dim]}
                  onChange={e => onChange(pkg.id, dim, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
