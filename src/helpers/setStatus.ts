export class SetLanguageStatusToIndonesian {
    public AssignDriver(status: string) {
        switch (status) {
            case "need_assign_driver":
                return "Butuh Assign Driver"
            default:
                return status
        }
    }
    public LoadingDriver(status: string) {
        switch (status) {
            case "driver_assigned":
                return "Driver ditugaskan"
            default:
                return status
        }
    }
    public AssignPorter(status: string) {
        switch (status) {
            case "driver_assigned":
                return "Driver ditugaskan"
            case "shipped":
                return "Terkirim"
            default:
                return status
        }
    }
    public MonitoringDelivery(status: string) {
        switch (status) {
            case "Cancel":
                return "Dibatalkan"
            case "aggregasion_process":
                return "Proses Agregasi"
            default:
                return status
        }
    }
    public Request3pl(status: string) {
        switch (status) {
            case "requested":
                return "Telah di request"
            case "shipped":
                return "Terkirim"
            case "driver_assigned":
                return "Driver ditugaskan"
            default:
                return status
        }
    }
}
