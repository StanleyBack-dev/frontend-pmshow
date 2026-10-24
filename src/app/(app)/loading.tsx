import { PageLoading } from "@/features/layout/components/PageLoading";

// The signed-in shell stays on screen; only the content area waits. Each
// section with sub-pages has its own loading.tsx re-using PageLoading.
export default function Loading() {
  return <PageLoading />;
}
