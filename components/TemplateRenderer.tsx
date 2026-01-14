import React from 'react';
import { PropertyDetails, TemplateType, BrandSettings, TemplateConfig, LayoutConfig } from '../types';
import { MapPin, Bed, Bath, Square, User, Globe, Home, ArrowRight, Tag, Star, Key, Phone, Mail } from 'lucide-react';

interface Props {
  type: TemplateType;
  data: PropertyDetails;
  brandSettings?: BrandSettings;
  scale?: number;
  customConfig?: TemplateConfig;
}

const TemplateRenderer: React.FC<Props> = ({ type, data, brandSettings, scale = 1, customConfig }) => {
  const containerStyle = {
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: '400px',
    height: '500px', // 4:5 Aspect Ratio (Instagram Portrait)
    fontFamily: brandSettings?.fontFamily || 'Inter',
  };

  const primaryColor = customConfig?.primaryColor || brandSettings?.primaryColor || '#0284c7'; // brand-600
  const secondaryColor = customConfig?.secondaryColor || brandSettings?.secondaryColor || '#0c4a6e'; // brand-900
  const bgImage = data.imageUrl || 'https://picsum.photos/800/1000';
  const overlayOpacity = customConfig?.overlayOpacity !== undefined ? customConfig.overlayOpacity : 0.9;
  const imageStyles = customConfig?.imageStyles;
  
  // Default Layout Config
  const layout: LayoutConfig = {
      showLogo: true,
      showAgentInfo: true,
      showBadge: true,
      textAlignment: 'left',
      contentPosition: 'bottom',
      headerStyle: 'transparent',
      footerStyle: 'transparent',
      ...customConfig?.layout
  };

  const getBadgeText = (defaultText: string) => customConfig?.badgeText || defaultText;

  // Helper to construct image CSS
  const getImageStyle = (): React.CSSProperties => {
      if (!imageStyles) return { opacity: overlayOpacity, objectFit: 'cover' };
      
      return {
          filter: `brightness(${imageStyles.brightness}%) contrast(${imageStyles.contrast}%) saturate(${imageStyles.saturation}%) sepia(${imageStyles.sepia}%) blur(${imageStyles.blur}px)`,
          transform: `scale(${imageStyles.zoom}) rotate(${imageStyles.rotation}deg)`,
          opacity: overlayOpacity,
          objectFit: 'cover',
          transition: 'all 0.3s ease'
      };
  };

  const baseImgStyle = getImageStyle();

  const AgentBadge = ({ light = false, simple = false, className = "" }) => {
    if (!brandSettings || !layout.showAgentInfo) return null;
    
    // Container classes
    const textMain = light ? 'text-white' : 'text-gray-900';
    const textSub = light ? 'text-gray-300' : 'text-gray-500';
    const bg = light ? 'bg-black/50 border-white/20' : 'bg-white/95 border-gray-100';

    if (simple) {
         return (
             <div className={`flex items-center gap-2 ${className}`}>
                 {brandSettings.agentPhotoUrl && (
                    <img src={brandSettings.agentPhotoUrl} className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                 )}
                 <div className="flex flex-col justify-center">
                    <span className={`text-[10px] font-bold leading-none ${textMain}`}>{brandSettings.agentName}</span>
                    <span className={`text-[8px] leading-tight ${textSub} opacity-90`}>{brandSettings.phone}</span>
                 </div>
             </div>
         )
    }

    return (
        <div className={`flex items-center gap-3 backdrop-blur-md p-2.5 rounded-lg shadow-lg border max-w-[240px] ${bg} ${className}`}>
            {brandSettings.agentPhotoUrl ? (
                <img src={brandSettings.agentPhotoUrl} alt="Agent" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                </div>
            )}
            <div className="flex-1 min-w-0 text-left">
                <p className={`text-[10px] font-bold uppercase leading-tight ${textMain}`}>{brandSettings.agentName}</p>
                <p className={`text-[8px] mb-1 ${textSub}`}>{brandSettings.agencyName}</p>
                <div className={`flex flex-col text-[8px] leading-tight font-medium ${textMain} opacity-90`}>
                     {brandSettings.phone && <span className="flex items-center gap-1"><Phone className="w-2 h-2" /> {brandSettings.phone}</span>}
                     {brandSettings.email && <span className="flex items-center gap-1"><Mail className="w-2 h-2" /> {brandSettings.email}</span>}
                </div>
            </div>
        </div>
    );
  };

  const Logo = ({ dark = false }) => {
      if (!brandSettings?.logoUrl || !layout.showLogo) return null;
      return (
          <img src={brandSettings.logoUrl} alt="Logo" className={`h-10 w-auto object-contain drop-shadow-md ${dark ? 'brightness-0' : ''}`} />
      );
  };

  // Helper for text alignment classes
  const getTextAlignClass = () => {
      switch(layout.textAlignment) {
          case 'center': return 'text-center items-center';
          case 'right': return 'text-right items-end';
          default: return 'text-left items-start';
      }
  };

  // Helper for flex content positioning
  const getFlexPositionClass = () => {
       switch(layout.contentPosition) {
           case 'top': return 'justify-start pt-20';
           case 'center': return 'justify-center';
           case 'below-image': return 'justify-start'; // Not used in flex-overlay mode, but good fallback
           default: return 'justify-end pb-8';
       }
  };
  
  // --- CUSTOM BUILDER (Blank Canvas) ---
  if (type === 'custom-builder') {
      const isSplit = layout.contentPosition === 'below-image';
      
      // Calculate Colors based on style
      const headerBg = layout.headerStyle === 'solid-white' ? 'white' : 
                       layout.headerStyle === 'solid-primary' ? primaryColor : 
                       layout.headerStyle === 'solid-secondary' ? secondaryColor : 'transparent';
      
      const footerBg = layout.footerStyle === 'solid-white' ? 'white' : 
                       layout.footerStyle === 'solid-primary' ? primaryColor : 
                       layout.footerStyle === 'solid-secondary' ? secondaryColor : 'transparent';

      const isHeaderDark = layout.headerStyle === 'solid-primary' || layout.headerStyle === 'solid-secondary';
      const isFooterDark = layout.footerStyle === 'solid-primary' || layout.footerStyle === 'solid-secondary';
      
      const contentBg = isSplit ? 'white' : 'transparent';
      const textColor = isSplit ? 'text-gray-900' : 'text-white';

      return (
          <div className="flex flex-col w-full h-full shadow-2xl bg-white relative overflow-hidden" style={containerStyle}>
             
             {/* Header Section */}
             {(layout.headerStyle !== 'transparent' || layout.showLogo) && (
                 <div className={`absolute top-0 left-0 w-full z-30 p-4 flex items-center justify-between transition-colors`} style={{ backgroundColor: headerBg }}>
                     <Logo dark={!isHeaderDark && layout.headerStyle !== 'transparent'} />
                     {layout.showBadge && (
                         <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isHeaderDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                             {getBadgeText('Just Listed')}
                         </div>
                     )}
                 </div>
             )}

             {/* Main Content Wrapper */}
             <div className="flex-1 flex flex-col relative h-full">
                 
                 {/* Image Area */}
                 <div className={`relative overflow-hidden ${isSplit ? 'h-[60%]' : 'h-full absolute inset-0 z-0'}`}>
                     <img src={bgImage} alt="Property" className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                     {/* Overlay for non-split view if needed */}
                     {!isSplit && (
                         <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />
                     )}
                 </div>

                 {/* Body Content */}
                 <div 
                    className={`relative z-10 p-6 flex flex-col ${getTextAlignClass()} ${isSplit ? 'h-[40%] justify-center' : `h-full ${getFlexPositionClass()}`}`}
                    style={{ backgroundColor: contentBg }}
                 >
                     <h2 className={`text-4xl font-bold mb-2 ${textColor}`}>{data.price}</h2>
                     <p className={`text-lg mb-6 opacity-90 ${textColor}`}>{data.address}</p>
                     
                     <div className={`flex gap-4 text-sm font-medium ${textColor} opacity-80 border-t pt-4 border-current`}>
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {data.beds} Beds</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {data.baths} Baths</span>
                        <span className="flex items-center gap-1"><Square className="w-4 h-4" /> {data.sqft} Sqft</span>
                     </div>
                 </div>
             </div>

             {/* Footer Section */}
             {layout.showAgentInfo && (
                 <div className={`relative z-30 w-full p-4 transition-colors ${layout.footerStyle === 'minimal' ? 'absolute bottom-4 right-4 w-auto p-0' : ''}`} style={{ backgroundColor: layout.footerStyle === 'minimal' ? 'transparent' : footerBg }}>
                      {layout.footerStyle === 'minimal' ? (
                          <AgentBadge simple light={!isSplit} className={isSplit ? 'bg-white/10 border-gray-200' : ''} />
                      ) : (
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  {brandSettings?.agentPhotoUrl && (
                                      <img src={brandSettings.agentPhotoUrl} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
                                  )}
                                  <div className={isFooterDark ? 'text-white' : 'text-gray-900'}>
                                      <p className="font-bold text-sm leading-none">{brandSettings?.agentName}</p>
                                      <p className="text-xs opacity-80">{brandSettings?.agencyName}</p>
                                  </div>
                              </div>
                              <div className={`text-right text-xs ${isFooterDark ? 'text-white/80' : 'text-gray-600'}`}>
                                  <p>{brandSettings?.phone}</p>
                                  <p>{brandSettings?.website}</p>
                              </div>
                          </div>
                      )}
                 </div>
             )}
          </div>
      );
  }


  // --- NEW CANVA INSPIRED TEMPLATES ---

  // 1. Sidebar Listing (Modern clean split)
  if (type === 'sidebar-listing') {
      return (
          <div className="flex w-full h-full shadow-2xl bg-white" style={containerStyle}>
              {/* Sidebar */}
              <div className={`w-[35%] h-full p-6 flex flex-col justify-between relative z-10 ${getTextAlignClass()}`} style={{ backgroundColor: primaryColor }}>
                  <div className="flex flex-col gap-4">
                      <Logo dark={false} />
                      <div className="h-0.5 w-12 bg-white/30"></div>
                      <div className="text-white">
                          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">{getBadgeText('Just Listed')}</p>
                          <h2 className="text-2xl font-bold leading-tight">{data.price}</h2>
                      </div>
                  </div>

                  <div className="text-white space-y-4">
                      <div>
                          <p className="text-xs font-bold uppercase opacity-70 mb-1">Address</p>
                          <p className="text-sm font-medium leading-tight">{data.address}</p>
                      </div>
                      <div>
                          <p className="text-xs font-bold uppercase opacity-70 mb-1">Features</p>
                          <p className="text-sm leading-tight">{data.beds} Bed • {data.baths} Bath</p>
                          <p className="text-sm leading-tight">{data.sqft} Sqft</p>
                      </div>
                  </div>

                  <AgentBadge light simple className="border-t border-white/20 pt-4" />
              </div>

              {/* Image Area */}
              <div className="w-[65%] h-full relative overflow-hidden">
                  <img src={bgImage} alt="Property" className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                  {layout.showBadge && (
                      <div className="absolute top-0 right-0 bg-white text-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-widest z-10">
                          New Listing
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // 2. Diagonal Feature (Dynamic geometry)
  if (type === 'diagonal-feature') {
      return (
          <div className="relative w-full h-full shadow-2xl bg-white" style={containerStyle}>
               {/* Background Image Area */}
               <div className="absolute inset-0 h-[75%] overflow-hidden z-0">
                   <img src={bgImage} alt="Property" className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
               </div>
               
               {/* Diagonal Overlay */}
               <div 
                  className="absolute bottom-0 left-0 w-full h-[45%] z-10 flex flex-col justify-end p-8" 
                  style={{ 
                      backgroundColor: secondaryColor, 
                      clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' 
                  }}
               >
                   <div className={`text-white mt-12 ${getTextAlignClass()} flex flex-col`}>
                       <div className="flex items-center gap-2 mb-2">
                           <div className="px-2 py-0.5 bg-white text-gray-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                               {getBadgeText('For Sale')}
                           </div>
                       </div>
                       <h2 className="text-4xl font-black mb-1">{data.price}</h2>
                       <p className="text-white/80 font-medium mb-4">{data.address}</p>
                       
                       <div className="flex gap-4 text-sm font-bold border-t border-white/20 pt-4 w-full">
                           <span className="flex items-center gap-1"><Bed className="w-3 h-3"/> {data.beds}</span>
                           <span className="flex items-center gap-1"><Bath className="w-3 h-3"/> {data.baths}</span>
                           <span className="flex items-center gap-1"><Square className="w-3 h-3"/> {data.sqft}</span>
                       </div>
                   </div>
               </div>

               {/* Floating Agent Badge */}
               {layout.showAgentInfo && (
                   <div className="absolute bottom-6 right-6 z-20">
                       <AgentBadge light simple />
                   </div>
               )}
               
               {/* Logo Top Left */}
               <div className="absolute top-6 left-6 z-20">
                   <Logo />
               </div>
          </div>
      );
  }

  // 3. Soft Luxury (Editorial style)
  if (type === 'soft-luxury') {
      return (
          <div className={`relative w-full h-full shadow-2xl flex flex-col p-4 ${getFlexPositionClass()}`} style={containerStyle}>
               <img src={bgImage} alt="Property" className="absolute inset-0 w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
               
               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />
               
               {/* Glass Card */}
               <div className={`relative z-10 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 flex flex-col ${getTextAlignClass()}`}>
                   <div className="flex justify-center -mt-12 mb-3">
                       <div className="bg-white p-2 rounded-full shadow-lg">
                           <Home className="w-5 h-5" style={{ color: primaryColor }} />
                       </div>
                   </div>
                   
                   <p className="text-xs font-serif uppercase tracking-[0.2em] text-gray-500 mb-2">{getBadgeText('Luxury Residence')}</p>
                   <h2 className="text-3xl font-serif text-gray-900 mb-1">{data.price}</h2>
                   <p className="text-gray-600 text-sm mb-4 font-light">{data.address}</p>
                   
                   <div className="flex justify-center gap-4 text-xs font-medium text-gray-500 mb-4">
                        <span>{data.beds} Bedrooms</span>
                        <span>•</span>
                        <span>{data.baths} Bathrooms</span>
                        <span>•</span>
                        <span>{data.sqft} Sq. Ft.</span>
                   </div>

                   {layout.showAgentInfo && (
                       <div className="border-t border-gray-200 pt-3 flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                {brandSettings?.agentPhotoUrl && <img src={brandSettings.agentPhotoUrl} className="w-6 h-6 rounded-full object-cover" />}
                                <span className="text-xs font-bold text-gray-800">{brandSettings?.agentName}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{brandSettings?.agencyName}</span>
                       </div>
                   )}
               </div>

               {/* Top Badge */}
               <div className="absolute top-6 right-6 z-10">
                   <Logo dark={false} />
               </div>
          </div>
      );
  }


  // --- EXISTING TEMPLATES ---

  if (type === 'just-listed') {
    return (
      <div className={`relative overflow-hidden bg-gray-900 text-white flex flex-col shadow-2xl ${getFlexPositionClass()}`} style={containerStyle}>
        <img src={bgImage} alt="Property" className="absolute inset-0 w-full h-full origin-center" style={baseImgStyle} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            {layout.showBadge ? (
                 <div className="px-4 py-2 text-sm font-bold tracking-widest uppercase shadow-md text-white" style={{ backgroundColor: primaryColor }}>{getBadgeText('Just Listed')}</div>
            ) : <div></div>}
            <Logo />
        </div>
        <div className={`relative z-10 p-6 flex flex-col ${getTextAlignClass()}`}>
          <h2 className="text-4xl font-extrabold mb-2 text-white drop-shadow-lg tracking-tight">{data.price}</h2>
          <div className="flex items-center text-gray-100 mb-5 text-sm font-medium">
            <MapPin className="w-4 h-4 mr-1" style={{ color: primaryColor }} />
            {data.address}
          </div>
          <div className="flex items-center justify-between border-t border-white/20 pt-4 w-full">
            <div className="flex gap-4">
                <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-gray-300" /><span className="text-sm font-bold">{data.beds}</span></div>
                <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-gray-300" /><span className="text-sm font-bold">{data.baths}</span></div>
                <div className="flex items-center gap-1"><Square className="w-4 h-4 text-gray-300" /><span className="text-sm font-bold">{data.sqft}</span></div>
            </div>
            <AgentBadge light />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'sold') {
    return (
      <div className={`relative overflow-hidden bg-black text-white flex items-center justify-center shadow-2xl`} style={containerStyle}>
        <img src={bgImage} alt="Property" className="absolute inset-0 w-full h-full origin-center" style={{...baseImgStyle, filter: (baseImgStyle.filter || '') + ' grayscale(100%)'}} />
        <div className="absolute inset-0 border-[16px] m-4 opacity-80 pointer-events-none" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="absolute top-8 right-8 z-10"><Logo /></div>
        <div className={`relative z-10 text-center bg-black/80 p-8 border backdrop-blur-sm mx-6 max-w-xs flex flex-col ${getTextAlignClass()}`} style={{ borderColor: primaryColor }}>
            {layout.showBadge && (
                 <h1 className="text-5xl font-serif mb-2 tracking-widest" style={{ color: primaryColor }}>{getBadgeText('SOLD')}</h1>
            )}
            <div className="h-0.5 w-16 bg-white mx-auto mb-4 opacity-50"></div>
            <p className="text-lg font-light tracking-wide">{data.address}</p>
            {brandSettings && layout.showAgentInfo && (
                 <div className="mt-6 pt-4 border-t border-white/10 w-full text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Represented by</p>
                    <p className="text-sm font-medium mt-1">{brandSettings.agentName}</p>
                    <p className="text-[9px] text-gray-400 mt-1">{brandSettings.phone}</p>
                    <p className="text-[9px] text-gray-400">{brandSettings.email}</p>
                 </div>
            )}
        </div>
      </div>
    );
  }

  if (type === 'open-house') {
    return (
      <div className="relative overflow-hidden bg-white text-gray-900 shadow-2xl flex flex-col" style={containerStyle}>
        <div className="h-3/5 relative overflow-hidden">
             <img src={bgImage} alt="Property" className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
             <div className="absolute top-4 left-4 z-10"><Logo /></div>
             {layout.showBadge && (
                <div className="absolute bottom-4 right-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm z-10">{getBadgeText('Open House')}</div>
             )}
        </div>
        <div className={`h-2/5 p-6 flex flex-col justify-center bg-white relative z-10 ${getTextAlignClass()}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-xs font-bold text-center border-4 border-white" style={{ backgroundColor: primaryColor }}>SUN<br/>1-4PM</div>
            <h3 className="text-3xl font-extrabold mt-4" style={{ color: secondaryColor }}>{data.price}</h3>
            <p className="text-gray-500 text-sm mb-6">{data.address}</p>
            <div className="flex justify-between items-end w-full">
                <div className="flex gap-4 text-gray-600">
                    <span className="text-xs font-bold uppercase flex flex-col items-center"><span className="text-lg leading-none">{data.beds}</span> Bed</span>
                    <div className="w-px bg-gray-200 h-8"></div>
                    <span className="text-xs font-bold uppercase flex flex-col items-center"><span className="text-lg leading-none">{data.baths}</span> Bath</span>
                    <div className="w-px bg-gray-200 h-8"></div>
                    <span className="text-xs font-bold uppercase flex flex-col items-center"><span className="text-lg leading-none">{data.sqft}</span> Sqft</span>
                </div>
                {brandSettings && layout.showAgentInfo && (
                    <div className="text-right flex flex-col items-end">
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Contact</p>
                         <p className="text-xs font-bold" style={{ color: primaryColor }}>{brandSettings.website}</p>
                         <p className="text-[9px] text-gray-500">{brandSettings.phone}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  if (type === 'price-drop') {
    return (
      <div className="relative overflow-hidden text-white shadow-2xl" style={{ ...containerStyle, backgroundColor: secondaryColor }}>
         <img src={bgImage} alt="Property" className="absolute inset-0 w-full h-full mix-blend-overlay origin-center" style={baseImgStyle} />
         <div className="absolute top-4 left-4 z-10"><Logo /></div>
         {layout.showBadge && (
            <div className="absolute top-10 right-0 bg-red-600 text-white px-8 py-3 font-bold text-xl shadow-lg transform translate-x-6 translate-y-4 rotate-3 border-2 border-white z-10">{getBadgeText('PRICE DROP')}</div>
         )}
         <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-8 pt-24 pointer-events-none">
            <div className={`flex flex-col ${getTextAlignClass()}`}>
                <h2 className="text-5xl font-extrabold mb-2 leading-tight tracking-tight">{data.price}</h2>
                <p className="text-xl font-light opacity-90 mb-6">{data.address}</p>
                <div className="flex items-center justify-between border-t border-white/20 pt-4 w-full">
                <div className="flex gap-4 text-sm font-medium">
                    <span>{data.beds} Beds</span><span>•</span><span>{data.baths} Baths</span><span>•</span><span>{data.sqft} sqft</span>
                </div>
                <AgentBadge light />
                </div>
            </div>
         </div>
      </div>
    );
  }

  // 1. Modern Minimal
  if (type === 'modern-minimal') {
    return (
        <div className="bg-white flex flex-col shadow-2xl" style={containerStyle}>
            <div className="h-[65%] w-full relative overflow-hidden">
                <img src={bgImage} alt="Prop" className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                {layout.showBadge && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider z-10">{getBadgeText('For Sale')}</div>
                )}
            </div>
            <div className={`flex-1 p-8 flex flex-col justify-center relative z-10 bg-white ${getTextAlignClass()}`}>
                 <h2 className="text-3xl font-light text-gray-900 mb-1">{data.price}</h2>
                 <p className="text-gray-500 text-sm mb-6 font-medium">{data.address}</p>
                 <div className="flex gap-6 text-gray-800 border-t border-gray-100 pt-6 w-full">
                    <div className="flex flex-col"><span className="font-bold text-xl">{data.beds}</span><span className="text-[10px] text-gray-400 uppercase">Beds</span></div>
                    <div className="flex flex-col"><span className="font-bold text-xl">{data.baths}</span><span className="text-[10px] text-gray-400 uppercase">Baths</span></div>
                    <div className="flex flex-col"><span className="font-bold text-xl">{data.sqft}</span><span className="text-[10px] text-gray-400 uppercase">Sqft</span></div>
                 </div>
                 <div className="mt-auto pt-4 flex justify-between items-center w-full">
                    <AgentBadge simple />
                    <Logo dark />
                 </div>
            </div>
        </div>
    );
  }

  // 2. Luxury Serif
  if (type === 'luxury-serif') {
    return (
        <div className="bg-[#1a1a1a] p-6 shadow-2xl flex flex-col items-center justify-center text-center" style={containerStyle}>
             <div className="border p-1 w-full h-full flex flex-col relative" style={{ borderColor: primaryColor === '#0284c7' ? '#d4af37' : primaryColor }}>
                <div className="h-3/5 w-full relative mb-6 overflow-hidden">
                    <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1, filter: (baseImgStyle.filter || '') + ' grayscale(20%)'}} />
                    {layout.showBadge && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1a1a1a] px-4 py-1 border z-10" style={{ borderColor: primaryColor === '#0284c7' ? '#d4af37' : primaryColor }}>
                            <span className="text-xs font-serif uppercase tracking-[0.2em]" style={{ color: primaryColor === '#0284c7' ? '#d4af37' : primaryColor }}>{getBadgeText('Exclusive Listing')}</span>
                        </div>
                    )}
                </div>
                <div className={`flex-1 flex flex-col items-center px-4 ${getTextAlignClass()}`}>
                    <h2 className="text-3xl text-white font-serif italic mb-2">{data.price}</h2>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">{data.address}</p>
                    <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-4 mb-auto" style={{ color: primaryColor === '#0284c7' ? '#d4af37' : primaryColor }}>
                        <span className="font-serif">{data.beds} Bed</span>
                        <span className="font-serif">{data.baths} Bath</span>
                        <span className="font-serif">{data.sqft} Sqft</span>
                    </div>
                    <div className="pb-4">
                        <AgentBadge light />
                    </div>
                </div>
             </div>
        </div>
    );
  }

  // 3. Bold Grid
  if (type === 'bold-grid') {
      return (
          <div className="bg-white p-4 shadow-2xl relative" style={containerStyle}>
             <div className="w-full h-full relative overflow-hidden">
                 <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                 <div className="absolute inset-0 border-[8px] z-10 pointer-events-none" style={{ borderColor: primaryColor }}></div>
                 
                 <div className={`absolute bottom-8 right-8 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20 max-w-[280px] flex flex-col ${getTextAlignClass()}`}>
                     <h2 className="text-3xl font-black text-black mb-1">{data.price}</h2>
                     <p className="text-sm font-bold text-gray-600 mb-4 leading-tight">{data.address}</p>
                     <div className="flex gap-3 text-sm font-bold mb-4">
                        <span className="bg-gray-100 px-2 py-1">{data.beds} BD</span>
                        <span className="bg-gray-100 px-2 py-1">{data.baths} BA</span>
                     </div>
                     {layout.showAgentInfo && brandSettings && (
                         <div className="border-t pt-3 flex items-center gap-2">
                             <div className="text-xs text-gray-600 font-bold flex flex-col">
                                 <span>{brandSettings.agentName}</span>
                                 <span className="text-[10px] font-normal">{brandSettings.phone}</span>
                             </div>
                         </div>
                     )}
                 </div>
                 
                 {layout.showBadge && (
                    <div className="absolute top-8 left-8 bg-black text-white px-3 py-1 font-bold uppercase tracking-tighter text-sm z-20">
                        {getBadgeText('New on Market')}
                    </div>
                 )}

                 {layout.showLogo && brandSettings?.logoUrl && (
                    <div className="absolute top-8 right-8 z-20 bg-white p-2">
                        <img src={brandSettings.logoUrl} className="h-8 w-auto" />
                    </div>
                 )}
             </div>
          </div>
      );
  }

  // 4. Geometric Pop
  if (type === 'geometric-pop') {
      return (
          <div className="shadow-2xl relative" style={{ ...containerStyle, backgroundColor: secondaryColor }}>
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 70%)', zIndex: 0 }}></div>
              <div className="absolute top-0 right-0 w-[90%] h-[65%] z-10 shadow-xl overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
                   <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                   <div className={`flex flex-col ${getTextAlignClass()}`}>
                        <div className="w-12 h-1 mb-4" style={{ backgroundColor: primaryColor }}></div>
                        <h2 className="text-4xl font-bold text-white mb-2">{data.price}</h2>
                        <p className="text-white/80 font-light mb-6">{data.address}</p>
                        
                        <div className="flex items-center gap-6 text-white text-sm">
                            <div className="flex items-center gap-2"><Home className="w-4 h-4" /> {data.beds}bd</div>
                            <div className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> {data.baths}ba</div>
                            <div className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full"></div> {data.sqft}sqft</div>
                        </div>
                   </div>
              </div>
              
              {/* Agent info for Geometric Pop */}
              <div className="absolute bottom-8 right-8 z-20">
                 <AgentBadge light simple className="!bg-black/30" />
              </div>
          </div>
      );
  }

  // 5. Feature Split
  if (type === 'feature-split') {
      return (
          <div className="shadow-2xl flex flex-col" style={containerStyle}>
             <div className="h-1/2 relative overflow-hidden">
                 <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                 <div className="absolute bottom-0 left-0 bg-white px-4 py-2 font-bold text-sm rounded-tr-xl z-10" style={{ color: secondaryColor }}>
                     {data.address}
                 </div>
             </div>
             <div className="h-1/2 p-6 flex flex-col relative z-10" style={{ backgroundColor: secondaryColor }}>
                 <div className="flex justify-between items-start mb-6">
                     <div className={`flex flex-col ${getTextAlignClass()}`}>
                         {layout.showBadge && <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{getBadgeText('Listing Price')}</p>}
                         <h2 className="text-4xl text-white font-light">{data.price}</h2>
                     </div>
                     <Logo dark={false} />
                 </div>
                 
                 <div className="grid grid-cols-3 gap-4 mb-6">
                     <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
                         <Bed className="w-5 h-5 text-white mx-auto mb-1" />
                         <span className="text-white font-bold">{data.beds}</span>
                     </div>
                     <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
                         <Bath className="w-5 h-5 text-white mx-auto mb-1" />
                         <span className="text-white font-bold">{data.baths}</span>
                     </div>
                     <div className="bg-white/10 p-3 rounded-lg text-center backdrop-blur-sm">
                         <Square className="w-5 h-5 text-white mx-auto mb-1" />
                         <span className="text-white font-bold">{data.sqft}</span>
                     </div>
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                             <ArrowRight className="w-4 h-4 text-white" />
                         </div>
                         <span className="text-white text-sm font-medium">Swipe for details</span>
                     </div>
                     <AgentBadge light simple />
                 </div>
             </div>
          </div>
      );
  }

  // 6. Story Portrait
  if (type === 'story-portrait') {
      return (
          <div className={`relative shadow-2xl overflow-hidden flex flex-col ${getFlexPositionClass()}`} style={containerStyle}>
              <img src={bgImage} className="absolute inset-0 w-full h-full origin-center" style={baseImgStyle} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
              
              {layout.showBadge && (
                <div className="absolute top-8 left-0 w-full text-center z-10">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                        {getBadgeText('Just Listed')}
                    </span>
                </div>
              )}

              <div className={`relative z-10 px-6 flex flex-col ${getTextAlignClass()}`}>
                  <h2 className="text-5xl font-bold text-white mb-2 tracking-tighter">{data.price}</h2>
                  <p className="text-white/90 text-lg leading-snug mb-4">{data.address}</p>
                  
                  <div className="flex gap-4 text-white/80 text-sm font-medium mb-4">
                      <span>{data.beds} Beds</span>
                      <span>|</span>
                      <span>{data.baths} Baths</span>
                      <span>|</span>
                      <span>{data.sqft} Sq. Ft.</span>
                  </div>
                  <AgentBadge light />
              </div>
          </div>
      );
  }

  // 7. Classic Card
  if (type === 'classic-card') {
      return (
          <div className="flex items-center justify-center shadow-2xl" style={{ ...containerStyle, backgroundColor: '#f3f4f6' }}>
              <div className="w-[85%] h-[85%] bg-white shadow-xl p-4 rotate-1 relative transition-transform hover:rotate-0 duration-500">
                  <div className="h-[60%] w-full bg-gray-100 mb-4 overflow-hidden">
                       <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                  </div>
                  <div className={`flex flex-col ${getTextAlignClass()}`}>
                      <h3 className="text-2xl font-serif text-gray-900 mb-1">{data.price}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{data.address}</p>
                      <div className="flex justify-center gap-3 text-xs font-bold text-gray-700 w-full mb-3">
                           <span>{data.beds} BD</span>
                           <span className="text-gray-300">•</span>
                           <span>{data.baths} BA</span>
                           <span className="text-gray-300">•</span>
                           <span>{data.sqft} SF</span>
                      </div>
                      <div className="border-t pt-2 w-full flex justify-center">
                          <AgentBadge simple className="bg-gray-50 p-1" />
                      </div>
                  </div>
                  {layout.showBadge && (
                    <div className="absolute -top-3 -left-3 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg rotate-12 z-10" style={{ backgroundColor: secondaryColor }}>
                        <Star className="w-6 h-6 fill-white" />
                    </div>
                  )}
              </div>
          </div>
      );
  }

  // 8. Under Contract
  if (type === 'under-contract') {
      return (
          <div className="relative shadow-2xl flex items-center justify-center overflow-hidden" style={containerStyle}>
              <img src={bgImage} className="absolute inset-0 w-full h-full origin-center" style={{...baseImgStyle, filter: (baseImgStyle.filter || '') + ' blur(4px) brightness(50%)'}} />
              
              <div className="relative z-10 w-[80%] bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg text-green-600">
                      <Key className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{getBadgeText('Under Contract')}</h2>
                  <p className="text-white/80 mb-6 text-sm">{data.address}</p>
                  
                  {layout.showAgentInfo && (
                    <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            {brandSettings?.agentPhotoUrl && <img src={brandSettings.agentPhotoUrl} className="w-10 h-10 rounded-full object-cover" />}
                            <div className="text-left">
                                <p className="text-xs text-gray-500 uppercase">Contact for similar listings</p>
                                <p className="text-sm font-bold text-gray-900">{brandSettings?.agentName || 'Agent'}</p>
                                <p className="text-[10px] text-gray-600">{brandSettings?.phone}</p>
                            </div>
                        </div>
                    </div>
                  )}
              </div>
          </div>
      );
  }

  // 9. New Price
  if (type === 'new-price') {
      return (
          <div className="flex flex-col shadow-2xl bg-white" style={containerStyle}>
              <div className="relative h-[60%] overflow-hidden">
                  <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                  {layout.showBadge && (
                    <div className="absolute -bottom-8 right-8 w-24 h-24 rounded-full text-white flex flex-col items-center justify-center shadow-lg border-4 border-white rotate-12 z-10" style={{ backgroundColor: 'red' }}>
                        <span className="text-xs font-bold uppercase">{getBadgeText('New')}</span>
                        <span className="text-sm font-bold uppercase">{getBadgeText('Price')}</span>
                    </div>
                  )}
              </div>
              <div className={`flex-1 p-8 pt-10 flex flex-col ${getTextAlignClass()}`}>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">{data.price}</h2>
                  <p className="text-gray-500 mb-6 font-medium">{data.address}</p>
                  
                  <div className="flex gap-2">
                       <Tag className="w-4 h-4 mt-1 text-red-500" />
                       <p className="text-sm text-gray-600 italic">"Motivated seller! Beautiful updates throughout."</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                       <AgentBadge simple />
                  </div>
              </div>
          </div>
      );
  }

  // 10. Neighborhood Focus
  if (type === 'neighborhood-focus') {
      return (
          <div className="flex flex-col shadow-2xl" style={{ ...containerStyle, backgroundColor: primaryColor }}>
              <div className="h-2/5 p-8 flex flex-col justify-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <MapPin className="w-32 h-32" />
                  </div>
                  <div className={`relative z-10 flex flex-col ${getTextAlignClass()}`}>
                      <div className="flex items-center gap-2 mb-2 opacity-80 text-sm font-medium uppercase tracking-wider">
                          <MapPin className="w-4 h-4" /> {getBadgeText('Location Spotlight')}
                      </div>
                      <h2 className="text-3xl font-bold leading-tight mb-2">{data.address.split(',')[0]}</h2>
                      <p className="text-xl opacity-90">{data.address.split(',').slice(1).join(', ')}</p>
                  </div>
              </div>
              <div className="h-3/5 bg-white relative p-2">
                  <div className="h-full w-full relative rounded-lg overflow-hidden">
                       <img src={bgImage} className="w-full h-full origin-center" style={{...baseImgStyle, opacity: 1}} />
                       <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg z-10">
                           <p className="text-2xl font-bold text-gray-900">{data.price}</p>
                       </div>
                       
                       <div className="absolute top-4 right-4 z-10">
                           <AgentBadge simple />
                       </div>
                  </div>
              </div>
          </div>
      );
  }

  // Fallback
  return <div style={containerStyle} className="bg-gray-200 flex items-center justify-center">Unknown Template</div>;
};

export default TemplateRenderer;