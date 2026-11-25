export const TRAFFIC_LABELS={instagram:'Instagram',whatsapp:'WhatsApp',web:'Página web',facebook:'Facebook',tiktok:'TikTok',directo:'Directo o desconocido',otro:'Otro sitio'};
export function trafficSource(search,referrer){
 const tag=new URLSearchParams(search).get('utm_source')?.trim().toLowerCase();
 const mapping={instagram:'instagram',ig:'instagram',whatsapp:'whatsapp',wa:'whatsapp',web:'web',facebook:'facebook',fb:'facebook',tiktok:'tiktok'};
 if(tag)return mapping[tag]||'otro';
 let host='';try{host=new URL(referrer).hostname.toLowerCase()}catch{}
 if(/(^|\.)instagram\.com$/.test(host))return 'instagram';
 if(/(^|\.)(whatsapp\.com|whatsapp\.net|wa\.me)$/.test(host))return 'whatsapp';
 if(/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host))return 'facebook';
 if(/(^|\.)tiktok\.com$/.test(host))return 'tiktok';
 return host?'otro':'directo';
}
export function currentTraffic(){
 const source=trafficSource(location.search,document.referrer);
 try{const params=new URLSearchParams(location.search);if(params.has('utm_source')||source!=='directo')sessionStorage.setItem('catalog_traffic',source);return sessionStorage.getItem('catalog_traffic')||source}catch{return source}
}
