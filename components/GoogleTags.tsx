import Script from "next/script";

// Set these in Vercel > Settings > Environment Variables. Nothing loads until at least one is set.
const SAFE_ID = /^(G|AW)-[A-Z0-9]{4,20}$/i;
const clean = (v?: string) => {
  const id = v?.replace(/["'\s]/g, "");
  return id && SAFE_ID.test(id) ? id : "";
};

export default function GoogleTags() {
  const ga = clean(process.env.NEXT_PUBLIC_GA_ID);
  const ads = clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
  const first = ga || ads;
  if (!first) return null;

  const init =
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());" +
    (ga ? `gtag('config','${ga}');` : "") +
    (ads ? `gtag('config','${ads}');` : "");

  return (
    <>
      <Script src={"https://www.googletagmanager.com/gtag/js?id=" + first} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: init }} />
    </>
  );
}