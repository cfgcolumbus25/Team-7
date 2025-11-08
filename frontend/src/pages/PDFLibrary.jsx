import { useState, useEffect } from 'react';
import { pdfAPI } from '../services/api';

export default function PDFLibrary() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const data = await pdfAPI.getAll();
      setPdfs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading PDFs...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 30 }}>PDF Library</h1>
      
      {pdfs.length === 0 ? (
        <p>No PDFs uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 20,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px' }}>{pdf.original_name}</h3>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>
                    Uploaded: {new Date(pdf.uploaded_at).toLocaleString()}
                  </p>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>
                    Size: {(pdf.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: 14 }}>
                    Status: {pdf.processed ? '✅ Processed' : '⏳ Processing...'}
                  </p>
                </div>
                
                <a
                  href={`https://foliylmmwevcanfnssna.supabase.co/storage/v1/object/public/pdfs/${pdf.storage_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  View PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
