export default async function page({ params }: { params: { offerId: string } }) {
  return (
    <div>This is Offer page {params.offerId}</div>
  );
}
