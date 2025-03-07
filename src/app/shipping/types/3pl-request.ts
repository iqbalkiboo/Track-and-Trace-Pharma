interface PickupWarehouse {
    id: string
    code: string
    name: string
}

interface ThreePl {
    holding_id: string
    name: string
    deleted_at: Date
    _id: string
    created_at: Date
    updated_at: Date
}

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
    postal_code: string
    province: Province
    district: District
    sub_district: SubDistrict
    urban_village: UrbanVillage
}

interface Destination {
    name: string
    address: Address
}

interface Do {
    code: string
    id: string
    destination: Destination
}

interface Manifest {
    _id: string
    do: Do
    code: string
    total: {
        qty: number
        packing: number
    }
}

interface ThreePlRequest {
    _id: string
    pickup_date: string
    
    pickup_time: string
    pickup_warehouse: PickupWarehouse
    "3pl": ThreePl
    destination: Destination
    manifests: Manifest[]
    status: string
    created_by?: any
    created_at: string
    updated_at: string
    weight: number
    volume: number
    do: Do
    order_id: string
    __v: number
    qty_manifest: number
    qty_packing: number
}

interface Data {
    docs: ThreePlRequest[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage?: any
    nextPage?: any
}

export interface ThreePlRequestResponse {
    data: Data
    statusCode: number
    message: string
}

export interface ThreePlRequestDetailResponse {
    data: ThreePlRequest
    statusCode: number
    message: string
}