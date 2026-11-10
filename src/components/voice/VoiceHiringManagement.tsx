import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Play,
  Pause,
  Volume2,
  Clock,
  IndianRupee,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Edit3,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  HardDrive,
  BadgeAlert,
} from 'lucide-react';
import { VoiceBooking, HirePartnerPricingConfig, Partner } from '../../types';
import { api } from '../../services/api';

export const VoiceHiringManagement: React.FC = () => {
  const [bookings, setBookings] = useState<VoiceBooking[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pricing, setPricing] = useState<HirePartnerPricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<VoiceBooking | null>(null);

  // Audio Playback state
  const [playingBookingId, setPlayingBookingId] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pricing Edit Modal / State
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newHourlyRateInput, setNewHourlyRateInput] = useState<string>('');
  const [priceConfirmModalOpen, setPriceConfirmModalOpen] = useState(false);
  const [priceSaving, setPriceSaving] = useState(false);
  const [priceSuccessMessage, setPriceSuccessMessage] = useState<string | null>(null);

  // Partner Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [bookingToAssign, setBookingToAssign] = useState<VoiceBooking | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  // Copied transcription toast
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsRes, pricingRes, partnersRes] = await Promise.all([
        api.getVoiceBookings({ status: statusFilter, search: searchQuery }),
        api.getHirePartnerPricing(),
        api.getPartners(),
      ]);
      setBookings(bookingsRes.bookings);
      setPricing(pricingRes);
      setPartners(partnersRes);
      if (bookingsRes.bookings.length > 0 && !selectedBooking) {
        setSelectedBooking(bookingsRes.bookings[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load voice bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  // Audio Player Handling
  const handlePlayAudio = (booking: VoiceBooking) => {
    if (!audioRef.current) return;

    if (playingBookingId === booking.id) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((e) => console.error(e));
      } else {
        audioRef.current.pause();
      }
      return;
    }

    // Switch to new audio
    setAudioLoading(true);
    setPlayingBookingId(booking.id);
    setSelectedBooking(booking);

    const streamUrl = api.getVoiceBookingAudioUrl(booking.id);
    audioRef.current.src = streamUrl;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => {
        setAudioLoading(false);
      })
      .catch((err) => {
        console.error('Audio playback error:', err);
        setAudioLoading(false);
      });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlaybackTime(audioRef.current.currentTime);
      setPlaybackDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setPlayingBookingId(null);
    setPlaybackTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setPlaybackTime(targetTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Pricing Form
  const handleOpenPriceModal = () => {
    if (pricing) {
      setNewHourlyRateInput(String(pricing.hourlyRate));
    }
    setIsEditingPrice(true);
  };

  const handleInitiatePriceSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newHourlyRateInput);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid positive number for hourly rate');
      return;
    }
    if (val < 99 || val > 5000) {
      alert('Hourly rate must be between ₹99 and ₹5,000 INR');
      return;
    }
    setPriceConfirmModalOpen(true);
  };

  const handleConfirmPriceSave = async () => {
    try {
      setPriceSaving(true);
      const val = parseFloat(newHourlyRateInput);
      const updated = await api.updateHirePartnerHourlyRate(val);
      setPricing(updated);
      setPriceConfirmModalOpen(false);
      setIsEditingPrice(false);
      setPriceSuccessMessage(`Successfully updated Hire a Partner hourly price to ₹${updated.hourlyRate}/hr INR.`);
      setTimeout(() => setPriceSuccessMessage(null), 6000);
      // Reload bookings metadata
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update pricing');
    } finally {
      setPriceSaving(false);
    }
  };

  // Partner Assignment
  const handleOpenAssignModal = (booking: VoiceBooking) => {
    setBookingToAssign(booking);
    setSelectedPartnerId(booking.assignedPartnerId || (partners[0]?.id || ''));
    setAssignModalOpen(true);
  };

  const handleSavePartnerAssignment = async () => {
    if (!bookingToAssign || !selectedPartnerId) return;
    try {
      setAssigning(true);
      const updated = await api.assignPartnerToVoiceBooking(bookingToAssign.id, selectedPartnerId);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      if (selectedBooking?.id === updated.id) {
        setSelectedBooking(updated);
      }
      setAssignModalOpen(false);
      setBookingToAssign(null);
    } catch (err: any) {
      alert(err.message || 'Failed to assign partner');
    } finally {
      setAssigning(false);
    }
  };

  // Status Update
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const updated = await api.updateVoiceBookingStatus(bookingId, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      if (selectedBooking?.id === updated.id) {
        setSelectedBooking(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const copyTranscription = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        (b.assignedPartnerName && b.assignedPartnerName.toLowerCase().includes(q)) ||
        b.workDescription.toLowerCase().includes(q) ||
        b.transcription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Status Badge Helper
  const getStatusBadge = (status: VoiceBooking['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Assignment
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Partner Assigned
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Job In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = Math.floor(sec % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Hidden audio element for real audio streaming */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={() => setAudioLoading(false)}
      />

      {/* Page Title & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Voice Hiring Management
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Hire a Partner
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Manage on-demand voice bookings submitted by customers, review verified voice notes, and set platform hourly pricing.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {priceSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{priceSuccessMessage}</span>
          </div>
          <button
            onClick={() => setPriceSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP SECTION: HIRE A PARTNER PRICING CONTROL (Requirement 3) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold tracking-wide uppercase text-indigo-200">
                Hire a Partner — Pricing Control & Rate Governance
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Configure the standardized platform hourly billing rate in INR. Newly created voice bookings will automatically reflect the updated rate; existing and completed bookings permanently retain their historical agreed rate.
            </p>
          </div>

          {/* Current Rate Display & Action */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/10 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-semibold text-indigo-300">Active Rate</div>
              <div className="text-xl font-extrabold text-white flex items-center">
                <span className="text-amber-400 font-sans mr-0.5">₹</span>
                {pricing ? pricing.hourlyRate : '...'}
                <span className="text-xs font-normal text-slate-300 ml-1">/ hour</span>
              </div>
            </div>

            <button
              onClick={handleOpenPriceModal}
              className="ml-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Update Price
            </button>
          </div>
        </div>

        {/* Pricing Meta Sub-Bar */}
        {pricing && (
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-4">
              <span>
                <strong>Last Updated:</strong>{' '}
                {new Date(pricing.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>
                <strong>Author:</strong> {pricing.updatedBy}
              </span>
              <span>
                <strong>Billing Currency:</strong> {pricing.currency}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Governed by HomeHelp Rate Card Service</span>
            </div>
          </div>
        )}
      </div>

      {/* Voice Bookings Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking #, customer, phone, partner, or work description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'assigned', label: 'Assigned' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Bookings Table (Left/Top) & Audio Playback & Inspection Pane (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Voice Bookings */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Voice Hiring Bookings ({filteredBookings.length})
            </span>
            <span className="text-xs text-slate-400">Click a card to play recording & inspect</span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading voice bookings from backend...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
              <Mic className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-700">No voice bookings found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No Hire a Partner voice notes match your current search and status filters.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isSelected = selectedBooking?.id === booking.id;
              const isPlaying = playingBookingId === booking.id && audioRef.current && !audioRef.current.paused;

              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative bg-white ${
                    isSelected
                      ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top line: Booking ID, Status, Rate, Audio Button */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {booking.bookingNumber}
                      </span>
                      {getStatusBadge(booking.status)}
                      {booking.priority === 'urgent' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded uppercase">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Hourly rate agreed */}
                      <span className="text-xs font-bold text-slate-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center">
                        <IndianRupee className="w-3 h-3 text-amber-600 mr-0.5" />
                        {booking.hourlyRate}/hr
                      </span>

                      {/* Play / Pause Voice Note Mini Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(booking);
                        }}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
                          isPlaying
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                        title={isPlaying ? 'Pause audio' : 'Play customer recording'}
                      >
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        <span className="font-mono text-[11px]">{booking.audioDurationSeconds}s</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer & Partner Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 my-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Customer
                      </span>
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {booking.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                        {booking.customerPhone}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Assigned Partner
                      </span>
                      {booking.assignedPartnerName ? (
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {booking.assignedPartnerName}
                            {booking.assignedPartnerRating && (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded ml-1">
                                ★ {booking.assignedPartnerRating}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {booking.assignedPartnerPhone}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600 font-medium italic">Unassigned</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAssignModal(booking);
                            }}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold rounded border border-blue-200"
                          >
                            Assign Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Work Description */}
                  <p className="text-xs text-slate-700 line-clamp-2 my-1.5">
                    <strong>Work Requirement:</strong> {booking.workDescription}
                  </p>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(booking.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[200px]">{booking.customerAddress}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Dedicated Audio Player & Detailed Booking Inspector */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          {selectedBooking ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
              {/* Card Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-400">
                      {selectedBooking.bookingNumber}
                    </span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Customer Voice Note & Inspection Panel
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Agreed Rate</div>
                  <div className="text-sm font-bold text-amber-400 flex items-center justify-end">
                    <span>₹{selectedBooking.hourlyRate}</span>
                    <span className="text-[11px] text-slate-300 font-normal">/hr</span>
                  </div>
                </div>
              </div>

              {/* REAL VOICE RECORDING PLAYER SECTION (Requirement 1 & 2) */}
              <div className="p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Customer Audio Note</h4>
                      <p className="text-[10px] text-slate-500">
                        Recorded on HomeHelp Customer App • PCM WAV
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    {formatSeconds(
                      playingBookingId === selectedBooking.id
                        ? playbackTime
                        : 0
                    )}{' '}
                    / {formatSeconds(selectedBooking.audioDurationSeconds)}
                  </span>
                </div>

                {/* Scrubber / Progress Bar */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max={selectedBooking.audioDurationSeconds}
                    step="0.1"
                    value={
                      playingBookingId === selectedBooking.id ? playbackTime : 0
                    }
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0:00</span>
                    <span>{formatSeconds(selectedBooking.audioDurationSeconds)}</span>
                  </div>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="h-10 bg-slate-900 rounded-lg p-2 flex items-center justify-center gap-1 overflow-hidden">
                  {Array.from({ length: 32 }).map((_, idx) => {
                    const isPlaying =
                      playingBookingId === selectedBooking.id &&
                      audioRef.current &&
                      !audioRef.current.paused;
                    // Dynamic waveform heights
                    const baseHeight = 15 + ((idx * 7) % 25);
                    const animatedHeight = isPlaying
                      ? Math.min(32, Math.max(6, baseHeight + Math.sin(playbackTime * 4 + idx) * 12))
                      : baseHeight;

                    return (
                      <div
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-100 ${
                          isPlaying ? 'bg-emerald-400' : 'bg-slate-700'
                        }`}
                        style={{ height: `${animatedHeight}px` }}
                      />
                    );
                  })}
                </div>

                {/* Main Player Controls Bar */}
                <div className="flex items-center justify-between pt-1">
                  {/* Play / Pause Primary Button */}
                  <button
                    onClick={() => handlePlayAudio(selectedBooking)}
                    disabled={audioLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    {audioLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : playingBookingId === selectedBooking.id &&
                      audioRef.current &&
                      !audioRef.current.paused ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Customer Audio</span>
                      </>
                    )}
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {[1, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          playbackRate === speed
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit & Security Compliance Notice */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-100 p-2 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    <strong>Authorized Admin Playback:</strong> Audio stream accessed via secure admin credentials; access event is logged to immutable audit records.
                  </span>
                </div>
              </div>

              {/* Transcription View */}
              <div className="p-4 border-b border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Audio Transcription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {selectedBooking.transcriptionLanguage}
                    </span>
                    <button
                      onClick={() =>
                        copyTranscription(selectedBooking.transcription, selectedBooking.id)
                      }
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      title="Copy text"
                    >
                      {copiedId === selectedBooking.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                  "{selectedBooking.transcription}"
                </div>
              </div>

              {/* Customer & Partner Details */}
              <div className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Booking Assignment & Logistics
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Customer
                      </span>
                      <span className="font-semibold text-slate-900">{selectedBooking.customerName}</span>
                      <div className="text-slate-500 text-[11px]">{selectedBooking.customerPhone}</div>
                      <div className="text-slate-600 text-[11px] mt-1 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span>{selectedBooking.customerAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Assigned Partner
                      </span>
                      {selectedBooking.assignedPartnerName ? (
                        <div>
                          <span className="font-semibold text-slate-900">
                            {selectedBooking.assignedPartnerName}
                          </span>
                          <div className="text-slate-500 text-[11px]">
                            {selectedBooking.assignedPartnerPhone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium">None assigned</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleOpenAssignModal(selectedBooking)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                    >
                      {selectedBooking.assignedPartnerName ? 'Change Partner' : 'Assign Partner'}
                    </button>
                  </div>

                  {/* Status Change Selector */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-600">Update Booking Status:</span>
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-xs text-slate-400">Select a voice booking on the left to inspect details.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: EDIT HOURLY PRICE FORM */}
      {isEditingPrice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleIn">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-sm">Update Hire a Partner Hourly Rate</h3>
                  <p className="text-[11px] text-slate-300">HomeHelp Platform Pricing Governance</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingPrice(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInitiatePriceSave} className="p-5 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Rate Persistence & Contract Guarantee</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  New voice bookings will automatically adopt the updated rate. Existing bookings retain their original locked rate (e.g. ₹299/hr) to uphold customer trust and partner agreements.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Hourly Rate in Indian Rupees (INR)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
                    ₹
                  </div>
                  <input
                    type="number"
                    min="99"
                    max="5000"
                    step="1"
                    required
                    value={newHourlyRateInput}
                    onChange={(e) => setNewHourlyRateInput(e.target.value)}
                    className="w-full pl-8 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    placeholder="299"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    / hour
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Current rate: ₹{pricing?.hourlyRate}/hr. Recommended range: ₹199 to ₹699.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingPrice(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Review & Confirm Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMATION MODAL BEFORE SAVING (Requirement 3: Confirm before saving) */}
      {priceConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-5 border border-slate-200 space-y-4 animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <BadgeAlert className="w-6 h-6 text-amber-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Confirm Hourly Rate Update?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to update the platform price for "Hire a Partner"?
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Previous</span>
                <span className="text-base font-extrabold text-slate-600 line-through">
                  ₹{pricing?.hourlyRate}/hr
                </span>
              </div>
              <div className="text-slate-400">➜</div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">New Rate</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ₹{newHourlyRateInput}/hr
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={priceSaving}
                onClick={() => setPriceConfirmModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={priceSaving}
                onClick={handleConfirmPriceSave}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {priceSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Persist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN PARTNER MODAL */}
      {assignModalOpen && bookingToAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Assign Partner to {bookingToAssign.bookingNumber}
                </h3>
                <p className="text-xs text-slate-500">Customer: {bookingToAssign.customerName}</p>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Available HomeHelp Partner:
              </label>
              {partners.map((partner) => (
                <label
                  key={partner.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPartnerId === partner.id
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="partner"
                      checked={selectedPartnerId === partner.id}
                      onChange={() => setSelectedPartnerId(partner.id)}
                      className="accent-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        {partner.name}
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                          ★ {partner.rating}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{partner.skills.join(', ')}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      partner.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {partner.status}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assigning || !selectedPartnerId}
                onClick={handleSavePartnerAssignment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
