const ADS_SCRIPT = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7307476520007592'

const AutoAdsense = () => {
    const head = document.head
    const s = document.createElement("script")
    s.type = "text/javascript"
    s.src = ADS_SCRIPT
    s.onload = () => {
        return window.consent
            ? (adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=0
            : (adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1
    }
    head.appendChild(s)
}

export default AutoAdsense;
