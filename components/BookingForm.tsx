
import React, { useRef, useState } from 'react';
import { BookingData, RoomType, BookingPlatform, PaymentMethod } from '../types';
import { ROOM_TYPES, PLATFORMS, BREAKFAST_MENU, DINNER_MENU, EVENING_SNACKS_MENU, RESORT_DETAILS } from '../constants';
import { User, Calendar, Home, CreditCard, ExternalLink, AlertCircle, Clock, Upload, Trash2, Utensils, Plus, X, Circle, CheckCircle2 } from 'lucide-react';

interface BookingFormProps {
  data: BookingData;
  onChange: (data: BookingData) => void;
  onSubmit: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ data, onChange, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customBreakfast, setCustomBreakfast] = useState('');
  const [customDinner, setCustomDinner] = useState('');
  const [customSnacks, setCustomSnacks] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) || 0 : value;
    onChange({ ...data, [name]: val });
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    onChange({ ...data, paymentMethod: method });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ ...data, [name]: checked });
  };

  const toggleItem = (listName: 'breakfastItems' | 'dinnerItems' | 'snacksItems', item: string) => {
    const current = data[listName];
    if (current.includes(item)) {
      onChange({ ...data, [listName]: current.filter(i => i !== item) });
    } else {
      onChange({ ...data, [listName]: [...current, item] });
    }
  };

  const addCustomItem = (listName: 'breakfastCustomItems' | 'dinnerCustomItems' | 'snacksCustomItems', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    onChange({ ...data, [listName]: [...data[listName], value.trim()] });
    setter('');
  };

  const removeCustomItem = (listName: 'breakfastCustomItems' | 'dinnerCustomItems' | 'snacksCustomItems', index: number) => {
    const newList = [...data[listName]];
    newList.splice(index, 1);
    onChange({ ...data, [listName]: newList });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo file size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange({ ...data, logo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ ...data, logo: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.roomType) {
      alert("Please select a Room Type (Room or Cottage).");
      return;
    }
    if (data.numNights <= 0 && data.checkInDate && data.checkOutDate) {
      alert("Check-out date must be after Check-in date.");
      return;
    }
    onSubmit();
  };

  const inputClasses = "w-full bg-[#111111] border border-[#2A2A2A] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 outline-none transition-all text-white placeholder:text-[#AAAAAA] input-shadow";
  const labelClasses = "text-sm font-bold text-[#E0E0E0] ml-1 block mb-1";
  const sectionHeaderClasses = "text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2 border-b border-[#2A2A2A] pb-2 mb-6";
  const iconColor = "#FFFFFF";

  const isInvalidDateRange = data.checkInDate && data.checkOutDate && data.numNights <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-[#000000] border border-[#2A2A2A] p-6 md:p-10 rounded-2xl shadow-sm">
      {/* Logo Upload */}
      <section className="space-y-4">
        <h2 className={sectionHeaderClasses}>
          <Upload className="w-4 h-4" color={iconColor} /> Upload Resort Logo
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[#0F0F0F] border border-dashed border-[#2A2A2A] rounded-2xl">
          <div className="w-24 h-24 bg-[#111111] border border-[#2A2A2A] rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {data.logo ? (
              <img src={data.logo} alt="Resort Logo" className="w-full h-full object-contain" />
            ) : (
              <Home className="w-8 h-8 text-[#2A2A2A]" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xs text-[#E0E0E0] font-medium">Add your resort logo to appear on all pages of the bill. (PNG/JPG, Max 2MB)</p>
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-[#E0E0E0] transition-colors shadow-sm">
                {data.logo ? "Change Logo" : "Choose Logo"}
              </button>
              {data.logo && (
                <button type="button" onClick={removeLogo} className="px-4 py-2 border border-[#2A2A2A] text-white text-xs font-bold rounded-lg hover:bg-white hover:text-black transition-colors flex items-center gap-1 shadow-sm">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Resort Information */}
      <section className="space-y-4">
        <h2 className={sectionHeaderClasses}>
          <Home className="w-4 h-4" color={iconColor} /> Resort Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#0F0F0F] rounded-xl border border-[#2A2A2A] shadow-sm">
            <label className="block text-[#E0E0E0] text-[10px] uppercase tracking-wider mb-1 font-bold">Resort Name</label>
            <p className="font-semibold text-white">Dreamy Vacations</p>
          </div>
          <div className="p-4 bg-[#0F0F0F] rounded-xl border border-[#2A2A2A] shadow-sm">
            <label className="block text-[#E0E0E0] text-[10px] uppercase tracking-wider mb-1 font-bold">Address</label>
            <p className="text-sm line-clamp-2 text-white font-medium">{RESORT_DETAILS.address}</p>
          </div>
        </div>
      </section>

      {/* Guest & Dates */}
      <section className="space-y-6">
        <h2 className={sectionHeaderClasses}>
          <User className="w-4 h-4" color={iconColor} /> Guest & Booking Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Guest Name</label>
            <input required type="text" name="guestName" value={data.guestName} onChange={handleChange} placeholder="Full name of guest" className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Booking Date</label>
            <input required type="date" name="bookingDate" value={data.bookingDate} onChange={handleChange} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Check-in Date</label>
            <input required type="date" name="checkInDate" value={data.checkInDate} onChange={handleChange} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Check-out Date</label>
            <input required type="date" name="checkOutDate" value={data.checkOutDate} onChange={handleChange} className={inputClasses} />
            {isInvalidDateRange && (
              <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-bold mt-1 ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Check-out must be after Check-in date
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0F0F0F] border border-[#2A2A2A] p-4 rounded-xl flex flex-wrap gap-8 items-center shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white/60" />
            <div>
              <p className="text-[10px] font-bold text-[#E0E0E0] uppercase tracking-widest">Check-in Time</p>
              <p className="text-sm font-bold text-white">12:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-white/60" />
            <div>
              <p className="text-[10px] font-bold text-[#E0E0E0] uppercase tracking-widest">Check-out Time</p>
              <p className="text-sm font-bold text-white">Until 11:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room & Occupancy */}
      <section className="space-y-6">
        <h2 className={sectionHeaderClasses}>
          <Calendar className="w-4 h-4" color={iconColor} /> Room & Occupancy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Room Type</label>
            <select required name="roomType" value={data.roomType} onChange={handleChange} className={inputClasses}>
              <option value="" className="bg-[#111111]">Select Room Type</option>
              {ROOM_TYPES.map(type => <option key={type} value={type} className="bg-[#111111]">{type}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Number of Rooms</label>
            <input required type="number" name="numRooms" value={data.numRooms} onChange={handleChange} min="1" className={inputClasses} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClasses}>Adults</label>
              <input type="number" name="adults" value={data.adults} onChange={handleChange} min="1" className={inputClasses} />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Children</label>
              <input type="number" name="children" value={data.children} onChange={handleChange} min="0" className={inputClasses} />
            </div>
          </div>
        </div>
      </section>

      {/* Meal Selection */}
      <section className="space-y-10">
        <h2 className={sectionHeaderClasses}>
          <Utensils className="w-4 h-4" color={iconColor} /> Meal Selection
        </h2>
        <div className="space-y-12">
          {/* Breakfast */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" name="includeBreakfast" checked={data.includeBreakfast} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
              <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Breakfast</span>
            </label>
            {data.includeBreakfast && (
              <div className="pl-8 space-y-4 animate-fadeIn">
                <div>
                  <p className={labelClasses}>Select Predefined Items:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                    {BREAKFAST_MENU.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                        <input type="checkbox" checked={data.breakfastItems.includes(item)} onChange={() => toggleItem('breakfastItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                        <span className={`${data.breakfastItems.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={labelClasses}>Add Custom Items:</p>
                  <div className="flex gap-2">
                    <input type="text" value={customBreakfast} onChange={(e) => setCustomBreakfast(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('breakfastCustomItems', customBreakfast, setCustomBreakfast))} placeholder="Type custom food name..." className={inputClasses} />
                    <button type="button" onClick={() => addCustomItem('breakfastCustomItems', customBreakfast, setCustomBreakfast)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.breakfastCustomItems.map((item, idx) => (
                      <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                        {item} <button type="button" onClick={() => removeCustomItem('breakfastCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Dinner */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" name="includeDinner" checked={data.includeDinner} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
              <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Dinner</span>
            </label>
            {data.includeDinner && (
              <div className="pl-8 space-y-4 animate-fadeIn">
                <div>
                  <p className={labelClasses}>Select Predefined Items:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                    {DINNER_MENU.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                        <input type="checkbox" checked={data.dinnerItems.includes(item)} onChange={() => toggleItem('dinnerItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                        <span className={`${data.dinnerItems.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={labelClasses}>Add Custom Items:</p>
                  <div className="flex gap-2">
                    <input type="text" value={customDinner} onChange={(e) => setCustomDinner(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('dinnerCustomItems', customDinner, setCustomDinner))} placeholder="Type custom food name..." className={inputClasses} />
                    <button type="button" onClick={() => addCustomItem('dinnerCustomItems', customDinner, setCustomDinner)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.dinnerCustomItems.map((item, idx) => (
                      <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                        {item} <button type="button" onClick={() => removeCustomItem('dinnerCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Evening Snacks */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <input type="checkbox" name="includeSnacks" checked={data.includeSnacks} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-[#2A2A2A] bg-[#111111] text-white focus:ring-white focus:ring-offset-black" />
              <span className="text-white font-bold group-hover:text-white/80 transition-colors">Complimentary Evening Snacks</span>
            </label>
            {data.includeSnacks && (
              <div className="pl-8 space-y-4 animate-fadeIn">
                <div>
                  <p className={labelClasses}>Select Predefined Items:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A]">
                    {EVENING_SNACKS_MENU.map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer text-xs group">
                        <input type="checkbox" checked={data.snacksItems.includes(item)} onChange={() => toggleItem('snacksItems', item)} className="w-4 h-4 rounded border-[#2A2A2A] bg-black text-white focus:ring-white" />
                        <span className={`${data.snacksItems.includes(item) ? 'text-white font-bold' : 'text-[#AAAAAA]'} transition-colors`}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={labelClasses}>Add Custom Items:</p>
                  <div className="flex gap-2">
                    <input type="text" value={customSnacks} onChange={(e) => setCustomSnacks(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem('snacksCustomItems', customSnacks, setCustomSnacks))} placeholder="Type custom snack name..." className={inputClasses} />
                    <button type="button" onClick={() => addCustomItem('snacksCustomItems', customSnacks, setCustomSnacks)} className="px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.snacksCustomItems.map((item, idx) => (
                      <span key={idx} className="bg-white/10 border border-white/20 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-2">
                        {item} <button type="button" onClick={() => removeCustomItem('snacksCustomItems', idx)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Payment Details */}
      <section className="space-y-6">
        <h2 className={sectionHeaderClasses}>
          <CreditCard className="w-4 h-4" color={iconColor} /> Payment & Calculations
        </h2>
        
        <div className="space-y-6 bg-[#0F0F0F] p-6 rounded-2xl border border-[#2A2A2A]">
          <p className={labelClasses}>Select Payment Method:</p>
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'perPerson', label: 'Per Person' },
              { id: 'perRoom', label: 'Per Room' },
              { id: 'fullPayment', label: 'Full Payment' }
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handlePaymentMethodSelect(method.id as PaymentMethod)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  data.paymentMethod === method.id 
                  ? 'bg-white text-black border-white font-bold' 
                  : 'bg-[#111111] text-white border-[#2A2A2A] hover:border-white/50'
                }`}
              >
                {data.paymentMethod === method.id ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                {method.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-[#2A2A2A] animate-fadeIn">
            {data.paymentMethod === 'perPerson' && (
              <>
                <div className="space-y-1">
                  <label className={labelClasses}>Amount per Adult (₹)</label>
                  <input type="number" name="amtPerAdult" value={data.amtPerAdult} onChange={handleChange} className={inputClasses} placeholder="Enter rate..." />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Amount per Child (₹)</label>
                  <input type="number" name="amtPerChild" value={data.amtPerChild} onChange={handleChange} className={inputClasses} placeholder="Enter rate..." />
                </div>
              </>
            )}
            {data.paymentMethod === 'perRoom' && (
              <div className="space-y-1">
                <label className={labelClasses}>Amount per Room (₹)</label>
                <input type="number" name="amtPerRoom" value={data.amtPerRoom} onChange={handleChange} className={inputClasses} placeholder="Enter rate..." />
              </div>
            )}
            {data.paymentMethod === 'fullPayment' && (
              <div className="space-y-1">
                <label className={labelClasses}>Room Rent (₹)</label>
                <input required type="number" name="roomRent" value={data.roomRent} onChange={handleChange} className={inputClasses} placeholder="Enter total rent..." />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <label className={labelClasses}>Advance Collected (₹)</label>
              <input required type="number" name="advanceCollected" value={data.advanceCollected} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Booking Platform</label>
              <select name="platform" value={data.platform} onChange={handleChange} className={inputClasses}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border-2 bg-[#111111] border-white text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA]">Total Room Rent:</span>
            <span className="text-xl font-bold">₹ {data.roomRent}</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA]">Balance to Pay:</span>
            <span className="text-2xl font-black">{data.roomRent - data.advanceCollected === 0 ? 'FULL PAYMENT DONE' : `₹ ${data.roomRent - data.advanceCollected}`}</span>
          </div>
        </div>
      </section>

      <div className="pt-8">
        <button type="submit" className="w-full md:w-auto px-12 py-4 bg-white text-black font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-3 hover:bg-[#E0E0E0] hover:scale-[1.02] active:scale-100">
          Generate Bill Preview <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
