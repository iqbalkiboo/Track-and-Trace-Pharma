export interface Superadmin {
    id: string
    name: string
    email: string
    phone: string
}

export interface CreatedBy {
    is_superadmin: boolean
    superadmin: Superadmin
    user: any
}

export interface VehicleCategories {
    id: string
    name: string
    owner: string
}

export interface Warehouse {
    id: string
    name: string
    code: string
}

export interface Status {
    value: number
    label: string
}

export interface List {
    id: string
    company_id: string
    created_by: CreatedBy
    vehicle_categories: VehicleCategories
    warehouses: Warehouse[]
    plate_number: string
    volume: number
    maximum_weight: number
    apikey_iot: string
    status: Status
    created_at: Date
    updated_at: Date
    deleted_at?: any
}

export interface Data {
    list: List[]
    limit: number
    page: number
    total_data: number
    total_page: number
}

export interface VehicleResponse {
    status: number
    message: string
    validation: any
    data: Data
}
