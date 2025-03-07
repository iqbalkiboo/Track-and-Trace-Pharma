const constants = {
  accessPrivileges: {
    product: "product",
    principal: "principal",
    productType: "product_type",
    uom: "uom",
    mappingProduct: "mapping_product",
    vendor: "vendor",
    warehouse: "warehouse",
    collectivePackaging: "collective_packaging",
    user: "user",
    driver: "driver",
    porter: "porter",
    customer: "customer",
    vehicle: "vehicle",
    threepl: "3pl",
    accessPrivileges: "access_privileges",
    company: "company",
    holding: "holding",
  },
  accessProduksi: {
    serialisasi: "produksi-serialisasi",
    serialisasiBundling: "produksi-serialisasi-bundling",
    pengemasan: "produksi-pengemasan",
    inspeksiAkhir: "produksi-inspeksi-akhir",
    rilisProduct: "produksi-rilis-produk",
  },
  accessStorage: {
    penyimpananStok: "penyimpanan-stok",
    penyimpananTransferOrder: "penyimpanan-transfer-order",
    penyimpananPenyesuaian: "penyimpanan-penyesuaian",
  },
  accessDelivery: {
    pengirimanCabang: "pengiriman-cabang",
    pengirimanCustomer: "pengiriman-customer",
    pengirimanAssignDriver: "pengiriman-assign-driver",
    pengirimanAssignPorter: "pengiriman-assign-porter",
    pengirimanLoadingDriver: "pengiriman-loading-driver",
    pengirimanMonitorDelivery: "pengiriman-monitor-delivery",
    pengirimanRequest3pl: "pengiriman-request-3pl",
    pengirimanFakturKembali: "pengiriman-faktur-kembali",
  },
  accessReceive: {
    penerimaan: "penerimaan-penerimaan",
    penerimaanReturn: "penerimaan-return",
    penerimaanSerialisasiExternal: "penerimaan-serialisasi-external",
  },
  accessTrack: {
    lacakByBatch: "lacak-by-batch",
    lacakBySerialisasi: "lacak-by-serialisasi",
  },
  accessReport: {
    reportMutasiBarang: "report-mutasi-barang",
    reportInventoryControlData: "report-inventory-control-data",
  },
  accessAlert: {
    alertLog: "alert-log-alert",
    alertLogLog: "alert-log-log",
    alertLogUserLog: "alert-log-user-log",
  },
  accessSettings: {
    settingProduk: "setting-produk",
    settingPrincipal: "setting-principal",
    settingTipeProduk: "setting-tipe-produk",
    settingUOM: "setting-uom",
    settingMappingProduk: "setting-mapping-produk",
    settingVendor: "setting-vendor",
    settingWarehouse: "setting-warehouse",
    settingKemasanKolektif: "setting-kemasan-kolektif",
    settingUser: "setting-user",
    settingDriver: "setting-driver",
    settingPorter: "setting-porter",
    settingCustomer: "setting-customer",
    settingKendaraan: "setting-kendaraan",
    setting3pl: "setting-3pl",
    settingHakAkses: "setting-hak-akses",
    settingCabangPlan: "setting-cabang-plan",
    settingCabang: "setting-cabang",
    settingPerusahaan: "setting-perusahaan",
    settingHolding: "setting-holding",
  },
  productionStatus: {
    readyToPack: "ready_to_pack",
    processPacking: "process_packing",
    readyToCheck: "ready_to_check",
  },
}

export default constants
