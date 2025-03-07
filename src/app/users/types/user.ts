export interface UserType {
    kind: string
    id: string
}

export interface Superadmin {
    id: string
    name: string
    email: string
    phone: string
}

export interface User {
    id: string
}

export interface CreatedBy {
    is_superadmin: boolean
    superadmin: Superadmin
    user: User
}

export interface Role {
    id: string
    name: string
    slug: string
}

export interface Status {
    label: string
    value: number
}

export interface Warehouse {
    id: string
    name: string
    code: string
}

export interface List {
    id: string
    user_type: UserType
    created_by: CreatedBy
    role: Role
    name: string
    username: string
    email: string
    position: string
    erp_code: string
    permission: string[]
    status: Status
    password: string
    last_login?: Date
    created_at: Date
    updated_at: any
    deleted_at: string
    warehouses: Warehouse[]
}

export interface Data {
    list: List[]
    total_page: number
    total_data: number
    page: number
    limit: number
}

export interface UserResponse {
    status: number
    validation: Record<string, string>
    data: Data
    message: string
}
