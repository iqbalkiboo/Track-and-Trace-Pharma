export const subMenuProduction: { name: string; link: string; access: string }[] = [
  {
    name: "serialiasi",
    link: "/serialisasi",
    access: "produksi-serialisasi.list",
  },
  {
    name: "pengemasan",
    link: "/pengemasan",
    access: "produksi-pengemasan.list",
  },
  {
    name: "inspeksi akhir",
    link: "/pengecekan/tahap1",
    access: "produksi-inspeksi-akhir.list",
  },
  {
    name: "rilis produk",
    link: "/pengecekan/tahap2",
    access: "produksi-rilis-produk.list",
  },
]

export const subMenuPenyimpanan: { name: string; link: string; access: string }[] = [
  {
    name: "stok",
    link: "/stok",
    access: "penyimpanan-stok.list",
  },
  {
    name: "transfer",
    link: "/transfer",
    access: "penyimpanan-transfer-order.list",
  },
  {
    name: "penyesuaian",
    link: "/penyesuaian",
    access: "penyimpanan-penyesuaian.list",
  },
]

export const subMenuPengiriman: { name: string; link: string; access: string }[] = [
  {
    name: "",
    link: "/agregasi/crossdocking",
    access: "pengiriman-cabang.list",
  },
  {
    name: "",
    link: "/agregasi/customer",
    access: "pengiriman-customer.list",
  },
  {
    name: "",
    link: "/assign-driver",
    access: "pengiriman-assign-driver.list",
  },
  {
    name: "",
    link: "/assign-porter",
    access: "pengiriman-assign-porter.list",
  },
  {
    name: "",
    link: "/loading-driver",
    access: "pengiriman-loading-driver.list",
  },
  {
    name: "",
    link: "/monitoring",
    access: "pengiriman-monitor-delivery.list",
  },
  {
    name: "",
    link: "/serialisasi",
    access: "pengiriman-request-3pl.list",
  },
  {
    name: "",
    link: "/faktur-kembali",
    access: "pengiriman-faktur-kembali.list",
  },
]

export const subMenuPenerimaan: { name: string; link: string; access: string }[] = [
  {
    name: "",
    link: "/reception?page=1",
    access: "penerimaan-penerimaan.list",
  },
  {
    name: "",
    link: "/return",
    access: "penerimaan-return.list",
  },
  {
    name: "",
    link: "/serialisasi-external",
    access: "penerimaan-serialisasi-external.list",
  },
]

export const subMenuLacak: { name: string; link: string; access: string }[] = [
  {
    name: "",
    link: "/batch",
    access: "lacak-by-batch.find",
  },
  {
    name: "",
    link: "/serialisasi",
    access: "lacak-by-serialisasi.find",
  },
]

export const subMenuReport: { name: string; link: string; access: string }[] = [
  {
    name: "",
    link: "/mutasi-barang",
    access: "report-mutasi-barang.create",
  },
  {
    name: "",
    link: "/inventory-control-data",
    access: "report-inventory-control-data.create",
  },
]

export const subMenuAlertLog: { name: string; link: string; access: string }[] = [
  {
    name: "",
    link: "/alert",
    access: "alert-log-alert.list",
  },
  {
    name: "",
    link: "/log",
    access: "alert-log-log.list",
  },
  {
    name: "",
    link: "/user-log",
    access: "alert-log-user-log.list",
  },
]

export const subMenuSettings: { name: string; link: string; access: string }[] = [
  {
    name: "",
    link: "/master-produk",
    access: "setting-produk.list",
  },
  {
    name: "",
    link: "/master-principal",
    access: "setting-principal.list",
  },
  {
    name: "",
    link: "/master-tipe-produk",
    access: "setting-tipe-produk.list",
  },
  {
    name: "",
    link: "/master-uom",
    access: "setting-uom.list",
  },
  {
    name: "",
    link: "/master-mapping-produk",
    access: "setting-mapping-produk.list",
  },
  {
    name: "",
    link: "/master-vendor",
    access: "setting-vendor.list",
  },
  {
    name: "",
    link: "/master-warehouse",
    access: "setting-warehouse.list",
  },
  {
    name: "",
    link: "/kategori-kemasan",
    access: "setting-kemasan.list",
  },
  {
    name: "",
    link: "/master-user",
    access: "setting-user.list",
  },
  {
    name: "",
    link: "/master-driver",
    access: "setting-driver.list",
  },
  {
    name: "",
    link: "/master-porter",
    access: "setting-porter.list",
  },
  {
    name: "",
    link: "/master-customer",
    access: "setting-customer.list",
  },
  {
    name: "",
    link: "/master-kendaraan",
    access: "setting-kendaraan.list",
  },
  {
    name: "",
    link: "/master-threepl",
    access: "setting-3pl.list",
  },
  {
    name: "",
    link: "/hak-akses",
    access: "setting-hak-akses.list",
  },
  {
    name: "",
    link: "/master-perusahaan",
    access: "setting-cabang.list",
  },
  {
    name: "",
    link: "/master-company",
    access: "setting-perusahaan.list",
  },
  {
    name: "",
    link: "/master-holding",
    access: "setting-holding.list",
  },
]