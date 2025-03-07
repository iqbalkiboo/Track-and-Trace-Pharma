import type { ResponseWrapper } from "@/types"

interface Superadmin {
    id: string
    name: string
    email: string
    phone: string
}

interface User {
    id: string
    name: string
}

interface CreatedBy {
    is_superadmin: boolean
    superadmin: Superadmin
    user: User
}

interface ThreePl {
    id: string
    name: string
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
    province: Province
    district: District
    sub_district: SubDistrict
    urban_village: UrbanVillage
}

interface Location {
    type: string
    coordinates: number[]
}

interface Pic {
    value: string
    contact: string
}

interface Counts {
    building: number
    room: number
    rack: number
    bin: number
    pallete: number
}

interface List {
    id: string
    company_id: string
    created_by: CreatedBy
    "3pl": ThreePl[]
    address: Address
    code: string
    name: string
    description: string
    location: Location
    pic: Pic
    counts: Counts
    erp_code: string
    created_at: Date
    updated_at: Date
    deleted_at: string
}

interface RootObject {
    list: List[]
    total_page: number
    total_data: number
    page: number
    limit: number
}

export function useWarehouseApi() {
    const { data, ...rest } =
        useHttp<ResponseWrapper<RootObject>>("/warehouse/v1/list")

    return {
        data: computed(() => data.value?.data),
        ...rest,
    }
}
