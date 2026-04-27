import Script from "next/script";

export function PendoScript() {
  const apiKey = process.env.NEXT_PUBLIC_PENDO_API_KEY ?? "YOUR_PENDO_API_KEY_HERE";
  return (
    <Script id="pendo-snippet" strategy="afterInteractive">
      {`(function(apiKey){
          (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
          v=['initialize','identify','updateOptions','pageLoad','track'];
          for(w=0,x=v.length;w<x;++w)(function(m){
            o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};
          })(v[w]);
          y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
          z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);
        })(window,document,'script','pendo');`}
      {`window.pendo && window.pendo._q && window.pendo._q.push(['_init','${apiKey}']);`}
    </Script>
  );
}
