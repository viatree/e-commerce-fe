import CardPage from "@/components/CartPage/index";

// generate seo metadata
export async function generateMetadata() {
  return {
    title: "Cart",
    description: "Cart",
  };
}
// main page
export default async function CartPage() {
  return <CardPage />;
}
