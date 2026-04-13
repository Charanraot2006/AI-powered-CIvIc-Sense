'use client';

import { useState, useRef } from 'react';
import { MapPin, Camera, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { createIssue } from '../actions';

export default function ReportPage() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [description, setDescription] = useState('');
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePinLocation = () => {
    setLocationLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          alert('Could not get your location. Please check browser permissions.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLocationLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    // Simulate smart classification for category based on description
    let category = 'General Issue';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('pothole') || lowerDesc.includes('road')) category = 'Road Damage';
    else if (lowerDesc.includes('waste') || lowerDesc.includes('trash')) category = 'Waste Management';
    else if (lowerDesc.includes('water') || lowerDesc.includes('pipe')) category = 'Water Supply';

    const result = await createIssue({
      description,
      lat: location?.lat || undefined,
      lng: location?.lng || undefined,
      category
    });

    if (result.success) {
      toast.success('Issue reported successfully!');
      setDescription('');
      setLocation(null);
      setMediaFile(null);
    } else {
      toast.error('There was a problem reporting the issue.');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <div className="glass-panel animate-fade-in interactive" style={{ cursor: 'default' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--primary)' }}>
          <AlertCircle /> Report a Civic Issue
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Issue Description</label>
            <textarea 
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue (e.g., Deep pothole on Main St. causing traffic danger)"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Location</label>
              <div 
                onClick={handlePinLocation}
                style={{
                  padding: '2rem',
                  border: location ? '1px solid var(--primary)' : '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: location ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {location ? (
                  <>
                    <CheckCircle color="var(--primary)" size={32} />
                    <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>Location Pinned!</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </span>
                  </>
                ) : (
                  <>
                    <Navigation color={locationLoading ? 'var(--text-muted)' : 'var(--primary)'} className={locationLoading ? 'animate-pulse' : ''} />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {locationLoading ? 'Getting location...' : 'Pin Location Automatically'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Upload Evidence</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*,video/*"
                style={{ display: 'none' }} 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '2rem',
                  border: mediaFile ? '1px solid var(--secondary)' : '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: mediaFile ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {mediaFile ? (
                  <>
                    <CheckCircle color="var(--secondary)" size={32} />
                    <span style={{ color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 600 }}>File Attached</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {mediaFile.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Camera color="var(--secondary)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add Photos/Video</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary interactive" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Submit Report to Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
