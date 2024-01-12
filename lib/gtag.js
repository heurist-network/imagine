export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }) => {
  console.log('report event', window.gtag);
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
  console.log('-dataLayer-', dataLayer);
};
