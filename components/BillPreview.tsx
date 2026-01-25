
import React from 'react';
import { BookingData } from '../types';
import { RESORT_DETAILS, FREE_ACTIVITIES } from '../constants';
import { MapPin, Phone, Mail, Coffee, Info, Activity, AlertTriangle, XCircle, Utensils } from 'lucide-react';

interface BillPreviewProps {
  data: BookingData;
  isPdf?: boolean;
}

const BillPreview: React.FC<BillPreviewProps> = ({ data, isPdf = false }) => {
  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const balance = data.roomRent - data.advanceCollected;
  const isPaidInFull = balance === 0;

  const LogoContainer = () => (
    <div 
      data-pdf-logo="true"
      style={{ 
        backgroundColor: '#FFFFFF', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        overflow: 'hidden',
        border: data.logo ? 'none' : '1px solid #E0E0E0'
      }} 
      className="shrink-0"
    >
      {data.logo ? (
        <img 
          src={data.logo} 
          alt="Logo" 
          loading="eager"
          style={{ 
            width: '60px', 
            height: 'auto', 
            objectFit: 'contain', 
            display: 'block'
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-1 text-center">
          <span className="font-serif font-black text-[8px] uppercase leading-tight text-black">Dreamy</span>
          <span className="font-serif font-black text-[8px] uppercase leading-tight text-black">Vacations</span>
        </div>
      )}
    </div>
  );

  const pagePadding = isPdf ? 'p-[15mm]' : 'p-6 md:p-12';
  const pageHeight = isPdf ? 'min-h-[297mm]' : 'min-h-screen';
  const pageWidth = isPdf ? 'w-[210mm]' : 'w-full';
  const gridLayout = isPdf ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2';
  const sectionGap = isPdf ? 'gap-10' : 'gap-8 md:gap-12';

  return (
    <div className={`bill-container bg-white text-black text-[13px] leading-relaxed ${isPdf ? 'w-[210mm]' : 'w-full'}`}>
      {/* PAGE 1 */}
      <div className={`page ${pageWidth} ${pagePadding} ${pageHeight} flex flex-col border-b border-[#E0E0E0] last:border-0 print:border-0 break-after-page bg-white mx-auto`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-black pb-6 mb-8 w-full gap-4">
          <div className="flex flex-col gap-2">
            <LogoContainer />
            <div>
              <h1 className="text-3xl font-serif font-bold text-black uppercase tracking-tight leading-none mt-2">Dreamy Vacations</h1>
              <p className="max-w-[280px] text-black font-semibold text-[11px] mt-2 leading-tight">
                {RESORT_DETAILS.address}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end w-full sm:w-auto">
            <div className="bg-white p-4 border-2 border-black rounded-lg min-w-full sm:min-w-[180px]">
              <p className="text-black uppercase text-[10px] font-bold tracking-widest mb-1 leading-none">Booking ID</p>
              <p className="text-xl font-mono font-bold text-black leading-none">{data.bookingId}</p>
            </div>
          </div>
        </div>

        <div className={`grid ${gridLayout} ${sectionGap} mb-8`}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs border-b border-[#E0E0E0] pb-1">Guest Information</h3>
              <div className="p-4 bg-white border border-[#E0E0E0] rounded-xl">
                <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Guest Name</span>
                <span className="text-lg font-bold text-black">{data.guestName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Check-in Date</span>
                  <span className="font-bold block text-sm text-black">{data.checkInDate}</span>
                  <span className="text-[10px] font-bold text-black uppercase">{getDayName(data.checkInDate)}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Check-out Date</span>
                  <span className="font-bold block text-sm text-black">{data.checkOutDate}</span>
                  <span className="text-[10px] font-bold text-black uppercase">{getDayName(data.checkOutDate)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 md:gap-6 mt-2 px-4 py-3 border border-[#E0E0E0] rounded-lg bg-zinc-50/50">
                <div className="flex flex-col">
                  <span className="font-bold text-[10px] uppercase text-black">Check-in Time</span>
                  <span className="text-[11px] text-black">12:00 PM</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[10px] uppercase text-black">Check-out Time</span>
                  <span className="text-[11px] text-black">Until 11:00 AM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs border-b border-[#E0E0E0] pb-1">Accommodation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Room Type</span>
                  <span className="font-bold text-[11px] leading-tight block text-black">{data.roomType}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Reservation</span>
                  <span className="font-bold text-black">{data.reservation}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Adults</span>
                  <span className="font-bold text-black">{data.adults}</span>
                </div>
                <div className="p-3 bg-white border border-[#E0E0E0] rounded-xl">
                  <span className="text-black font-normal block mb-0.5 text-[11px] uppercase tracking-tighter">Children</span>
                  <span className="font-bold text-black">{data.children}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-black flex flex-col justify-between h-fit md:h-full">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs pb-1 border-b border-[#E0E0E0]">Payment Summary</h3>
              <div className="flex justify-between items-center text-lg">
                <span className="text-black font-normal">Total Room Rent:</span>
                <span className="font-bold text-black">₹ {data.roomRent}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-black font-normal">Advance Paid:</span>
                <span className="font-bold text-black">₹ {data.advanceCollected}</span>
              </div>
              <div className="h-0.5 bg-[#E0E0E0] my-4" />
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center text-white ${isPaidInFull ? 'bg-[#2E7D32]' : 'bg-[#C62828]'}`}>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-90 mb-1">{isPaidInFull ? 'Status' : 'Balance to Pay'}</span>
                <span className="text-2xl font-bold">{isPaidInFull ? 'FULL PAYMENT DONE' : `₹ ${balance}`}</span>
              </div>
              <div className="pt-2 text-center">
                <span className="text-black text-xs font-normal">Booked via: <span className="font-bold">{data.platform}</span></span>
              </div>
            </div>
            <div className="mt-6 text-black text-[11px] italic font-medium leading-tight">
              "Dreamy Vacations Resort is situated amidst an intense coconut estate and hence spotting areas near Harangi reservoir."
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wider text-xs border-b border-[#E0E0E0] pb-1">Contact & Location</h3>
              <div className="space-y-2 text-black font-bold pt-2">
                 <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <a href={RESORT_DETAILS.googleMaps} target="_blank" rel="noopener noreferrer" className="hover:text-black underline transition-colors text-[11px]">{RESORT_DETAILS.address}</a>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Phone className="w-4 h-4 text-black shrink-0" />
                  <span>{RESORT_DETAILS.phone.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Mail className="w-4 h-4 text-black shrink-0" />
                  <span>{RESORT_DETAILS.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className={`page ${pageWidth} ${pagePadding} ${pageHeight} flex flex-col border-b border-[#E0E0E0] last:border-0 print:border-0 break-after-page bg-white mx-auto`}>
        <header className="mb-10 flex flex-wrap justify-between items-center border-b-2 pb-4 border-black gap-2">
           <div className="flex items-center gap-4">
             <LogoContainer />
             <h2 className="text-2xl font-serif font-bold text-black uppercase">Policies & Activities</h2>
           </div>
           <span className="text-black font-bold text-[10px] tracking-widest">{data.bookingId} - PAGE 2</span>
        </header>

        <div className={`grid ${gridLayout} ${sectionGap} md:gap-12`}>
          <div className="space-y-8">
            {/* Conditional Evening Snacks */}
            {data.includeSnacks && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-black">
                  <Coffee className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Evening Snacks</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-sm">
                  <p className="font-bold text-black text-lg mb-1">5 PM – 6 PM</p>
                  <div className="grid grid-cols-1 gap-y-1.5 pt-1">
                    {[...data.snacksItems, ...data.snacksCustomItems].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                        <span className="font-bold text-black text-[11px]">{item}</span>
                      </div>
                    ))}
                    {[...data.snacksItems, ...data.snacksCustomItems].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                  </div>
                  <p className="mt-2 text-[10px] text-black italic font-bold leading-tight">* Extra snacks available at extra cost. Please inform before check-in or before 2 PM.</p>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-black">
                <Info className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Dining Information</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-sm">
                  <p className="font-bold text-black text-[12px]">Lunch (On Demand)</p>
                  <p className="text-black text-[10px] font-bold">1:00 PM – 2:30 PM. Inform by previous day 7:00 PM.</p>
                </div>
              </div>
            </section>

            {/* Conditional Complimentary Breakfast */}
            {data.includeBreakfast && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-black">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Breakfast (8:30 AM – 9:30 AM)</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-2 pt-2 px-1">
                  {[...data.breakfastItems, ...data.breakfastCustomItems].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span className="font-bold text-black text-[11px]">{item}</span>
                    </div>
                  ))}
                  {[...data.breakfastItems, ...data.breakfastCustomItems].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                </div>
              </section>
            )}

            {/* Conditional Complimentary Dinner */}
            {data.includeDinner && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-black">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-widest text-sm underline decoration-2">Complimentary Dinner (8:00 PM – 9:00 PM)</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-2 pt-2 px-1">
                  {[...data.dinnerItems, ...data.dinnerCustomItems].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span className="font-bold text-black text-[11px]">{item}</span>
                    </div>
                  ))}
                  {[...data.dinnerItems, ...data.dinnerCustomItems].length === 0 && <span className="text-[11px] italic text-[#666]">No items selected</span>}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-black">
                <Activity className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Paid Activities</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-black">
                <div className="flex flex-col justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-black text-lg">Outdoor BBQ</p>
                    <p className="text-black text-[11px] italic font-bold">Weather dependent. Requires prior notice.</p>
                  </div>
                  <div className="text-left">
                    <p className="text-black font-bold text-2xl">₹1500</p>
                    <p className="text-[10px] text-black font-bold uppercase tracking-wider">per 1 Kg Chicken</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-black">
                <Activity className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Free Activities</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#E0E0E0] shadow-sm grid grid-cols-1 gap-y-2">
                {FREE_ACTIVITIES.map(activity => (
                  <div key={activity} className="flex items-center gap-3 py-1.5 border-b border-[#E0E0E0] last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    <span className="text-black font-bold text-[11px]">{activity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className={`page ${pageWidth} ${pagePadding} ${pageHeight} flex flex-col border-b border-[#E0E0E0] last:border-0 print:border-0 bg-white mx-auto`}>
        <header className="mb-10 flex flex-wrap justify-between items-center border-b-2 pb-4 border-black gap-2">
           <div className="flex items-center gap-4">
             <LogoContainer />
             <h2 className="text-2xl font-serif font-bold text-black uppercase">Terms & Cancellation</h2>
           </div>
           <span className="text-black font-bold text-[10px] tracking-widest">{data.bookingId} - PAGE 3</span>
        </header>
        <div className="space-y-12 max-w-2xl">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-black">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Resort Rules</h3>
            </div>
            <ul className="space-y-4">
              {[
                { n: 1, t: "Noise Regulation", d: "All lights and music must be turned off by 10:00 PM. Silence is mandatory after this time as per local regulations." },
                { n: 2, t: "Eco-Friendly Environment", d: "The resort is located within a coconut estate. Guests are requested to respect the local flora and fauna." },
                { n: 3, t: "Property & Linen Damage", d: "Any damage to resort property, including furniture, fixtures, linens, or bedding, will be charged to the guest." },
                { n: 4, t: "Vomiting & Excessive Cleaning", d: "Vomiting or any incident requiring excessive cleaning will attract cleaning or replacement charges if damage occurs." }
              ].map(rule => (
                <li key={rule.n} className="flex gap-4 p-5 bg-white border border-[#E0E0E0] rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 font-bold text-sm">{rule.n}</div>
                  <div>
                    <p className="font-bold text-sm text-black">{rule.t}</p>
                    <p className="text-black font-normal text-[11px] leading-relaxed mt-1">{rule.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-black">
              <XCircle className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Cancellation Policy</h3>
            </div>
            <div className="bg-white border-l-8 border-black p-6 border-y border-r border-[#E0E0E0] rounded-r-xl shadow-sm">
              <p className="text-black font-bold leading-relaxed text-[12px]">"Any cancellation received within 5 days prior to arrival date will incur the full period charge. Failure to arrive will be treated as No-Show and no refund will be given."</p>
            </div>
          </section>
        </div>
        <div className="mt-auto pt-20 text-center">
           <div className="w-20 h-0.5 bg-black mx-auto mb-4" />
           <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-black mb-2 opacity-80">Thank you for choosing</p>
           <p className="font-serif text-3xl font-bold text-black uppercase tracking-tighter">Dreamy Vacations</p>
           <p className="text-black text-[11px] mt-6 font-bold opacity-60">This is a system generated document. Signature not required.</p>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
