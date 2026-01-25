
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BookingData, RoomType, BookingPlatform } from './types';
import { ROOM_TYPES } from './constants';
import BookingForm from './components/BookingForm';
import BillPreview from './components/BillPreview';
import { Eye, Printer, PlusCircle, LayoutDashboard, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingId: '',
    guestName: '',
    bookingDate: new Date().toISOString().split('T')[0],
    checkInDate: '',
    checkOutDate: '',
    numRooms: 1,
    numNights: 0,
    reservation: '',
    roomType: '', 
    adults: 2,
    children: 0,
    roomRent: 0,
    advanceCollected: 0,
    platform: BookingPlatform.DIRECT,
    logo: '',
    includeBreakfast: false,
    breakfastItems: [],
    breakfastCustomItems: [],
    includeDinner: false,
    dinnerItems: [],
    dinnerCustomItems: [],
    includeSnacks: false,
    snacksItems: [],
    snacksCustomItems: [],
    // New fields
    paymentMethod: '',
    amtPerAdult: 0,
    amtPerChild: 0,
    amtPerRoom: 0,
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!bookingData.bookingId) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setBookingData(prev => ({ ...prev, bookingId: `DV-${timestamp}-${random}` }));
    }
  }, []);

  // DERIVED VALUES RULE: Compute numNights, reservation, and roomRent INLINE.
  let nights = 0;
  let resStr = '';
  if (bookingData.checkInDate && bookingData.checkOutDate) {
    const start = new Date(bookingData.checkInDate);
    const end = new Date(bookingData.checkOutDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    nights = diff > 0 ? diff : 0;
    if (nights > 0) {
      resStr = `${nights} Night${nights > 1 ? 's' : ''}, ${bookingData.numRooms} Room${bookingData.numRooms > 1 ? 's' : ''}`;
    }
  }

  // Payment Calculation Logic
  let calculatedRent = bookingData.roomRent;
  if (bookingData.paymentMethod === 'perPerson') {
    calculatedRent = (bookingData.adults * (bookingData.amtPerAdult || 0)) + (bookingData.children * (bookingData.amtPerChild || 0));
  } else if (bookingData.paymentMethod === 'perRoom') {
    calculatedRent = (bookingData.numRooms * (bookingData.amtPerRoom || 0));
  }
  // Full Payment uses the manual roomRent field directly

  const activeBookingData: BookingData = {
    ...bookingData,
    numNights: nights,
    reservation: resStr,
    roomRent: calculatedRent
  };

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    const hiddenHost = document.createElement('div');
    Object.assign(hiddenHost.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      width: '210mm',
      backgroundColor: '#FFFFFF',
      zIndex: '-1000'
    });
    document.body.appendChild(hiddenHost);

    const root = createRoot(hiddenHost);
    await new Promise<void>((resolve) => {
      root.render(<BillPreview data={activeBookingData} isPdf={true} />);
      setTimeout(resolve, 600);
    });

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      const pdfWidth = 210; 
      const pdfHeight = 297; 
      const billPages = hiddenHost.querySelectorAll('.page');

      for (let i = 0; i < billPages.length; i++) {
        const page = billPages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          width: 794,
          windowWidth: 794, 
          imageTimeout: 15000
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.90);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        const logoTarget = page.querySelector('[data-pdf-logo="true"]') as HTMLElement;
        if (logoTarget && activeBookingData.logo) {
          try {
            const rect = logoTarget.getBoundingClientRect();
            const pageRect = page.getBoundingClientRect();
            const scaleFactor = pdfWidth / pageRect.width;
            const x = (rect.left - pageRect.left) * scaleFactor;
            const y = (rect.top - pageRect.top) * scaleFactor;
            const w = rect.width * scaleFactor;
            const h = rect.height * scaleFactor;
            pdf.setFillColor(255, 255, 255);
            pdf.rect(x, y, w, h, 'F');
            pdf.addImage(activeBookingData.logo, 'PNG', x, y, w, h, undefined, 'MEDIUM');
          } catch (logoError) {
            console.warn("Logo injection skipped", logoError);
          }
        }
      }
      pdf.save(`DreamyVacations_${activeBookingData.bookingId}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Error generating the PDF.');
    } finally {
      root.unmount();
      document.body.removeChild(hiddenHost);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-12 overflow-x-hidden">
      <header className="no-print sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-y-4 w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-black border border-white p-1.5 rounded">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-lg sm:text-xl tracking-tight text-white font-bold uppercase">
            DreamyVacations
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            disabled={isGenerating}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all text-xs sm:text-sm font-medium disabled:opacity-50 whitespace-nowrap"
          >
            {isPreviewMode ? <PlusCircle className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreviewMode ? "Edit Details" : "Preview Bill"}
          </button>
          
          {isPreviewMode && (
            <button
              disabled={isGenerating}
              onClick={handleGeneratePdf}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white border border-white text-black hover:bg-zinc-200 transition-all text-xs sm:text-sm font-medium shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        {!isPreviewMode ? (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-white uppercase tracking-tight">Booking Information</h1>
              <p className="text-[#AAAAAA] text-sm">Enter the required guest and stay details below.</p>
            </div>
            <BookingForm 
              data={activeBookingData} 
              onChange={(newData) => setBookingData(newData)} 
              onSubmit={() => setIsPreviewMode(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="bill-wrapper w-full max-w-4xl shadow-2xl border border-[#2A2A2A] rounded-lg overflow-hidden bg-white text-black">
              <BillPreview data={activeBookingData} isPdf={false} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
