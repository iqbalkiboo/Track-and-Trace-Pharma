interface Province {
    id: string
    name: string
    slug: string
}

interface District {
    id: string
    name: string
    slug: string
}

interface SubDistrict {
    id: string
    name: string
    slug: string
}

interface UrbanVillage {
    id: string
    name: string
    slug: string
}

interface Address {
    detail: string
    province: Province
    district: District
    sub_district: SubDistrict
    urban_village: UrbanVillage
    postal_code: string
}

interface Destination {
    name: string
    address: Address
}

interface Do {
    id: string
    code: string
    do_type: string
    destination: Destination
}

interface Total {
    qty: number
    packing: number
}

interface Driver {
    id: string
    name: string
    status: string
    type: string
    vehicle: {
        id?: string
        plate_number?: string
    }
    vehicle_category: {
        id?: string
        name?: string
    }
}

interface DriverInfo {
    is_assigned: boolean
    assigned_at: Date
    drivers?: Driver[]
}

interface PickupWarehouse {
    id: string
    code: string
    name: string
}

interface ThreePl {
    id: string
    name: string
    order_id: string
    pickup_date: string
    pickup_time: string
    pickup_warehouse: PickupWarehouse
}

interface CreatedBy {
    is_superadmin: boolean
    superadmin: any
    user?: any
}

enum DeliveryTypeEnum {
    DIRECT_MANUAL = "direct_manual",
    DIRECT_KENDARAAN = "direct_kendaraan",
    THREEPL = "3pl",
}

interface List {
    _id: string
    id: string
    company_id: string
    do: Do
    code: string
    delivery_date: string
    target_delivery_date: string
    delivery_type?: `${DeliveryTypeEnum}`
    weight: number
    volume: number
    total: Total
    driver_info: DriverInfo
    "3pl": ThreePl
    status: string
    created_by: CreatedBy
    created_at: Date
    updated_at?: any
}

interface Data {
    list: List[]
    limit: number
    page: number
    total_data: number
    total_page: number
}

export interface ManifestResponse {
    status: number
    message: string
    validation?: any
    data: Data
}

export interface ManifestDetailResponse {
    status: number
    message: string
    validation?: any
    data: List
}
