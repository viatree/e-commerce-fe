import TrackingOrder from "@/components/TrackingOrder/index";

// generate seo metadata
export async function generateMetadata() {
  return {
    title: "Tracking Order",
    description: "Tracking Order",
  };
}

// main page
export default async function trackingOrderPage() {
  return <TrackingOrder />;
}
