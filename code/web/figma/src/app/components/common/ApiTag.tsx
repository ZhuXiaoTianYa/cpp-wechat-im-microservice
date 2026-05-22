import React from 'react';
import { useApp } from '../../context/AppContext';

interface ApiTagProps {
  method?: string;
  endpoint: string;
  params?: string;
  className?: string;
}

export function ApiTag({ method = 'POST', endpoint, params, className = '' }: ApiTagProps) {
  const { showApiAnnotations } = useApp();
  if (!showApiAnnotations) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono leading-none select-none ${className}`}
      style={{
        background: 'rgba(7,193,96,0.12)',
        border: '1px solid rgba(7,193,96,0.35)',
        color: '#07C160',
      }}
      title={params ? `入参: ${params}` : ''}
    >
      <span
        style={{
          background: '#07C160',
          color: '#fff',
          padding: '1px 4px',
          borderRadius: 3,
          fontWeight: 700,
          fontSize: 9,
        }}
      >
        {method}
      </span>
      <span style={{ color: '#555', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {endpoint}
      </span>
    </span>
  );
}

interface ApiTooltipProps {
  endpoint: string;
  method?: string;
  description: string;
  params?: Array<{ name: string; desc: string; required?: boolean }>;
  children: React.ReactNode;
}

export function ApiTooltip({ endpoint, method = 'POST', description, params, children }: ApiTooltipProps) {
  const { showApiAnnotations } = useApp();

  if (!showApiAnnotations) return <>{children}</>;

  return (
    <div className="relative group/api">
      {children}
      <div
        className="absolute z-50 bottom-full left-0 mb-2 w-72 hidden group-hover/api:block pointer-events-none"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
      >
        <div
          className="rounded-lg p-3 text-xs"
          style={{ background: '#fff', border: '1px solid #e8e8e8' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-1.5 py-0.5 rounded text-white font-bold"
              style={{ background: '#07C160', fontSize: 10 }}
            >
              {method}
            </span>
            <code className="font-mono text-[11px]" style={{ color: '#333' }}>
              {endpoint}
            </code>
          </div>
          <p className="mb-2" style={{ color: '#666' }}>{description}</p>
          {params && params.length > 0 && (
            <div>
              <div className="mb-1 font-semibold" style={{ color: '#333' }}>入参字段：</div>
              {params.map((p) => (
                <div key={p.name} className="flex gap-1 mb-0.5">
                  <code className="font-mono" style={{ color: '#07C160', minWidth: 120 }}>
                    {p.name}
                    {p.required && <span style={{ color: '#f00', marginLeft: 2 }}>*</span>}
                  </code>
                  <span style={{ color: '#888' }}>{p.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="absolute left-4 top-full w-2 h-2 rotate-45"
          style={{ background: '#fff', border: '1px solid #e8e8e8', borderTop: 'none', borderLeft: 'none', marginTop: -1 }}
        />
      </div>
    </div>
  );
}