export default async function page({ params }: { params: { submitId: string } }) {
  return (
    <div>This is Submit page {params.submitId}</div>
  );
}
