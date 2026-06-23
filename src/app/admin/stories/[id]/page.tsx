import AdminStoryEditorPageV2 from "@/components/admin/pages/AdminStoryEditorPageV2";

export default async function AdminEditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminStoryEditorPageV2 storyId={id} />;
}
