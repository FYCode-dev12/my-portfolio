import { Button } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";

export default function NotFound() {
  return (
    <div className="gutter pb-24 pt-10 sm:pt-16">
      <PageTitle lines={["Halaman", "tidak ada."]} />
      <p className="t-lead mt-8 max-w-[36ch] text-muted">
        Alamat yang Anda tuju tidak ada atau sudah dipindahkan.
      </p>
      <Button href="/" className="mt-10">
        Kembali ke beranda
      </Button>
    </div>
  );
}
